import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/shared/models/User';
import { StorageService } from 'src/app/shared/services/client-service/storage.service';
import { RoutingService } from 'src/app/shared/services/client-service/routing.service';
import { CloudFirestoreService } from 'src/app/shared/services/database-service/cloud-firestore-service';
import { UserType, Collection } from 'src/app/shared/enums/enums';
import { UtilService } from 'src/app/shared/services/client-service/util.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.page.html',
  styleUrls: ['./users-list.page.scss'],
})
export class UsersListPage implements OnInit {
  tavellers : User[] = [];
  vendors : User[] = [];
  userTypes : string[];
  selectedTab : string = "traveller"
  
  constructor(
    private storage : StorageService,
    private routingService : RoutingService,
    private cloudFirestoreService : CloudFirestoreService,
    private util : UtilService
  ) { }

  async ngOnInit() {
    this.userTypes = Object.keys(UserType);
    await this.getUsers();
  }

  changeTab(event){
    this.selectedTab = event.target.value;
  }

  async getUsers(){
    let laoder = await this.util.showLoader();
    laoder.present();
    try{
      let users = await this.cloudFirestoreService.getAll("verified",1,"createdOn","desc",Collection.Users);
      for(let item of users){
        let user = new User();
        user = Object.assign(user,item);
        if(user.cnic){
          user.cnic = `${user.cnic.slice(0,5)}-${user.cnic.slice(5,12)}-${user.cnic.slice(12,13)}`;
        }
        if(user.type === this.userTypes[0]){
          this.vendors.push(user);
        }else{
          this.tavellers.push(user);
        }
      }
      laoder.dismiss();
    }catch(e){
      laoder.dismiss();
      this.util.showToast(e.message);
    }
  }

  goToDashboard(){
    this.routingService.goToDashboard();
  }

  async revokeUser(item : User){
    let loader = await this.util.showLoader();
    loader.present();
    try{
      item.verified = 0;
      await this.cloudFirestoreService.set(item,item.id,Collection.Users);
      this.tavellers = [];
      this.vendors = [];
      await this.getUsers();
      loader.dismiss();
    }catch(e){
      loader.dismiss();
      this.util.showToast(e.message)
    }
    
  }

}
