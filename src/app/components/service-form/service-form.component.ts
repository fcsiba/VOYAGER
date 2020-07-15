import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { StorageService } from '../../shared/services/client-service/storage.service';
import { UtilService } from '../../shared/services/client-service/util.service';
import { Cities } from '../../helpers/cities';
import { Service } from 'src/app/shared/models/Service';
import { User } from 'src/app/shared/models/User';
import { VehicleType, Collection } from 'src/app/shared/enums/enums';
import { CloudFirestoreService } from 'src/app/shared/services/database-service/cloud-firestore-service';

@Component({
  selector: 'app-service-form',
  templateUrl: './service-form.component.html',
  styleUrls: ['./service-form.component.scss'],
})
export class ServiceFormComponent implements OnInit {

  sourceCities = Cities;
  destinationCities = Cities;
  service : Service = new Service();
  user : User = new User();
  vehicleTypes = Object.keys(VehicleType);
  isNew : boolean = true;

  constructor(
    private modalCtrl : ModalController,
    private storage : StorageService,
    private util : UtilService,
    private cloudFirestoreService : CloudFirestoreService,
    private alertCtrl : AlertController
  ) { }

  ngOnInit(){
    this.user = this.storage.getUser();
    if(this.service.id){
      this.isNew = false;
      if(new Date().getTime() > new Date(this.service.scheduleDate).getTime() + 86400000){
        this.service.expired = true;
      }else{
        this.service.expired = false; 
      }
    }
  }

  dismiss(){
    this.modalCtrl.dismiss();
  }

  async submit(){
    this.service.scheduleDate = new Date(new Date(this.service.scheduleDate).setHours(0,0,0,0)).toISOString();
    if(this.isNew){
    this.service.createdOn = new Date().getTime();
    this.service.vendorId = this.user.id;
    this.service.vendorName = this.user.fullName;
    this.service.vendorPhoneNumber = this.user.phoneNumber;
    this.service.vendorPhotoUrl = this.user.photoUrl;
      await this.saveService();
    }else{
      await this.updateService();
    }
  }

  async saveService(){
    let loader = await this.util.showLoader();
    loader.present();
    this.service.id = this.service.createdOn.toString();
    this.user.services = this.user.services ? this.user.services : [];
    this.user.services.push(this.service.id);
    try{
      await this.cloudFirestoreService.set(this.service,this.service.id,Collection.Services);
      await this.cloudFirestoreService.set(this.user,this.user.id,Collection.Users);
      this.util.showToast("Service Added Successfully !");
      loader.dismiss();
      this.dismiss();
    }catch(e){
      loader.dismiss();
      this.util.showToast(e.message);
    }
  }

  async updateService(){
    let loader = await this.util.showLoader();
    loader.present();
    try{
      await this.cloudFirestoreService.set(this.service,this.service.id,Collection.Services);
      this.util.showToast("Service Updated Successfully !");
      loader.dismiss();
      this.dismiss();
    }catch(e){
      loader.dismiss();
      this.util.showToast(e.message);
    }
  }

  async deleteServiceAlert(){
    let alert = await this.alertCtrl.create({
      message: "Are You Sure ?",
      buttons: [
        {
          text: "No",
        },
        {
          text: "Yes",
          handler: async () => {
                await this.deleteService();
          },
        },
      ],
    });
    alert.present();
  }

  async deleteService(){
    let loader = await this.util.showLoader();
    loader.present();
    this.user.services.splice(this.user.services.indexOf(this.service.id),1);
    try{
      let updatedService = await this.cloudFirestoreService.get(this.service.id,Collection.Services);
      this.service = updatedService.data() as Service;
      await this.cloudFirestoreService.delete(this.service.id,Collection.Services);
      await this.cloudFirestoreService.set(this.user,this.user.id,Collection.Users);
      for(let item of this.service.attendants){
        let doc = await this.cloudFirestoreService.get(item.id,Collection.Users);
        let user = doc.data() as User;
        user.services.splice(user.services.indexOf(this.service.id),1);
        await this.cloudFirestoreService.set(user,user.id,Collection.Users);
      }
      for(let item of this.service.requests){
        let doc = await this.cloudFirestoreService.get(item.id,Collection.Users);
        let user = doc.data() as User;
        user.requests.splice(user.requests.indexOf(this.service.id),1);
        await this.cloudFirestoreService.set(user,user.id,Collection.Users);
      }
      this.util.showToast("Service Deleted Successfully !");
      loader.dismiss();
      this.dismiss();
    }catch(e){
      loader.dismiss();
      this.util.showToast(e.message);
    }
  }

  keyUp(event: KeyboardEvent, id: any) {
    if (event.keyCode === 13 || event.key === "Enter") {
      id.valueAccessor.el.nativeElement.setFocus();
    }
  }

}
