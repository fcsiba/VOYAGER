import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/shared/services/client-service/storage.service';
import { CloudFirestoreService } from 'src/app/shared/services/database-service/cloud-firestore-service';
import { UtilService } from 'src/app/shared/services/client-service/util.service';
import { UserType, VehicleType, Collection } from 'src/app/shared/enums/enums';
import { Service } from 'src/app/shared/models/Service';
import { User } from 'src/app/shared/models/User';
import { RoutingService } from 'src/app/shared/services/client-service/routing.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-services-list-admin',
  templateUrl: './services-list-admin.page.html',
  styleUrls: ['./services-list-admin.page.scss'],
})
export class ServicesListAdminPage implements OnInit {
  services : Service[] = [];
  userTypes : string[];
  public user : User = new User();
  vehicleTypes = Object.keys(VehicleType);
  constructor(
    private storage : StorageService,
    private cloudFirestoreService : CloudFirestoreService,
    private util : UtilService,
    private routingService : RoutingService,
    private alertCtrl: AlertController
  ) { }

  async ngOnInit() {
    this.userTypes = Object.keys(UserType);
    this.user = this.storage.getUser();
    if(this.user.type === UserType.admin){
      await this.getServicesForAdmin();
    }else if(this.user.type === UserType.traveller){
      await this.getServicesForTraveller();
    }
  }

  goToDashboard(){
    this.routingService.goToDashboard();
  }

  //ADMIN

  async attendantsPopUp(item : Service){
    await this.routingService.showAttendantsModal(item.attendants);
    await this.getServicesForAdmin();
  }

  async requestsPopUp(item: Service) {
    await this.routingService.showRequestsModal(item.requests,item.id);
    await this.getServicesForAdmin();
  }

  async getServicesForAdmin(){
    let loader = await this.util.showLoader();
    loader.present();
    try{
      let services = await this.cloudFirestoreService.getAllAdmin("createdOn","desc",Collection.Services);
      this.services=[]
      for(let item of services){
        let service = new Service();
        service = Object.assign(service,item);
        this.services.push(service);
      }
      console.log(this.services);
      loader.dismiss();
    }catch(e){
      loader.dismiss();
      console.log(e);
      this.util.showToast(e.message);
    }
  }

  //TAVELLER
  
  async getServicesForTraveller(){
    let loader = await this.util.showLoader();
    loader.present();
    try{
      this.services=[];
      for(let item of this.user.services){
        let doc = await this.cloudFirestoreService.get(item,Collection.Services);
        let service = doc.data() as Service;
        if(service){
          service.call = `tel:${service.vendorPhoneNumber}`;
          if(new Date().getTime() > new Date(service.scheduleDate).getTime() + 86400000){
            service.expired = true;
          }else{
            service.expired = false;
          }
          this.services.push(service);
        }
      }
      console.log(this.services);
      loader.dismiss();
    }catch(e){
      loader.dismiss();
      console.log(e);
      this.util.showToast(e.message);
    }
  }

  async cancelBooking(item : Service){
    console.log(item);
    let loader = await this.util.showLoader();
    loader.present();
    this.user.services.splice(this.user.services.indexOf(item.id),1);
    try{
      await this.cloudFirestoreService.set(this.user,this.user.id,Collection.Users);
      let updatedService = await this.cloudFirestoreService.get(item.id,Collection.Services);
      let service = updatedService.data() as Service;
      service.attendants.splice(service.attendants.findIndex(a => a.id === this.user.id));
      service.seats = service.seats + 1;
      await this.cloudFirestoreService.set(service,service.id,Collection.Services);
      this.util.showToast("Booking Cancelled Successfully !");
      loader.dismiss();
      await this.getServicesForTraveller();
    }catch(e){
      loader.dismiss();
      this.util.showToast(e.message);
    }
  }

  async cancelBookingAlert(item: Service){
    let alert = await this.alertCtrl.create({
      message: "Are You Sure ?",
      buttons: [
        {
          text: "No",
        },
        {
          text: "Yes",
          handler: async () => {
                await this.cancelBooking(item);
          },
        },
      ],
    });
    alert.present();
  }
  
  callVendor(item:Service){
    let a = document.createElement("a");
    a.href = item.call;
    a.click();
    a.remove();
  }

  showInfoModal(item : Service){
    this.routingService.showServiceInfoModal(item);
  }


}
