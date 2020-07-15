import { Component, OnInit } from '@angular/core';
import { Attendant } from 'src/app/shared/models/Attendants';
import { ModalController } from '@ionic/angular';
import { User } from 'src/app/shared/models/User';
import { UserType, Collection } from 'src/app/shared/enums/enums';
import { UtilService } from 'src/app/shared/services/client-service/util.service';
import { StorageService } from 'src/app/shared/services/client-service/storage.service';
import { CloudFirestoreService } from 'src/app/shared/services/database-service/cloud-firestore-service';
import { Service } from 'src/app/shared/models/Service';

@Component({
  selector: 'app-requestslist',
  templateUrl: './requestslist.component.html',
  styleUrls: ['./requestslist.component.scss'],
})
export class RequestslistComponent implements OnInit {
  serviceId : string;
  user : User = new User();
  userTypes = Object.keys(UserType);
  requests : Attendant[] = [];
  constructor(
    private modalCtrl : ModalController,
    private util : UtilService,
    private storage : StorageService,
    private cloudFirestoreService: CloudFirestoreService,
  ) { }

  ngOnInit() {
    this.user = this.storage.getUser();
  }

  dismiss(){
    this.modalCtrl.dismiss();
  }

  async acceptRequest(requestee : Attendant){
    let loader = await this.util.showLoader();
    loader.present();
    try {
      let doc = await this.cloudFirestoreService.get(this.serviceId, Collection.Services);
      let service = doc.data() as Service;
      service.requests.splice(service.requests.findIndex(req => req.id === requestee.id),1);
      service.attendants.push(requestee);
      service.seats = service.seats - 1; 
      await this.cloudFirestoreService.set(service,this.serviceId, Collection.Services);
      let doc2 = await this.cloudFirestoreService.get(requestee.id, Collection.Users);
      let user  = doc2.data() as User;
      user.requests.splice(this.user.requests.findIndex(id => id === service.id),1);
      user.services.push(service.id);
      await this.cloudFirestoreService.set(user,user.id,Collection.Users);
      this.util.showToast("Service Request Accepeted!");
      this.requests.splice(this.requests.findIndex(req => req.id === requestee.id),1);
      loader.dismiss();
    } catch (e) {
      loader.dismiss();
      this.util.showToast(e.message);
    }
  }

}
