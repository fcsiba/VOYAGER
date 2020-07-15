import { Component, OnInit } from '@angular/core';
import { Service } from 'src/app/shared/models/Service';
import { User } from 'src/app/shared/models/User';
import { VehicleType, UserType, Collection } from 'src/app/shared/enums/enums';
import { StorageService } from 'src/app/shared/services/client-service/storage.service';
import { CloudFirestoreService } from 'src/app/shared/services/database-service/cloud-firestore-service';
import { UtilService } from 'src/app/shared/services/client-service/util.service';
import { RoutingService } from 'src/app/shared/services/client-service/routing.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-requested',
  templateUrl: './requested.page.html',
  styleUrls: ['./requested.page.scss'],
})
export class RequestedPage implements OnInit {

  services : Service[] = [];
  userTypes : string[];
  public user : User = new User();
  vehicleTypes = Object.keys(VehicleType);
  constructor(
    private storage : StorageService,
    private cloudFirestoreService : CloudFirestoreService,
    private util : UtilService,
    private routingService : RoutingService
  ) { }

  async ngOnInit() {
    this.userTypes = Object.keys(UserType);
    this.user = this.storage.getUser();
    await this.getServicesForTraveller();
  }

  async getServicesForTraveller(){
    let loader = await this.util.showLoader();
    loader.present();
    try{
      this.services=[];
      for(let item of this.user.requests){
        let doc = await this.cloudFirestoreService.get(item,Collection.Services);
        let service = doc.data() as Service;
        if(service){
          service.call = `tel:${service.vendorPhoneNumber}`;
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

  callVendor(item:Service){
    let a = document.createElement("a");
    a.href = item.call;
    a.click();
    a.remove();
  }
  showInfoModal(item : Service){
    this.routingService.showServiceInfoModal(item,true);
  }
}
