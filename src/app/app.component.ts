import { Component, OnInit } from '@angular/core';

import { Platform, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { RoutingService } from './shared/services/client-service/routing.service';
import { AuthenticationService } from './shared/services/database-service/authentication.service';
import { User } from './shared/models/User';
import { StorageService } from './shared/services/client-service/storage.service';
import * as firebase from 'firebase';
import { Collection, UserType } from './shared/enums/enums';
import { Service } from './shared/models/Service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  db: firebase.firestore.Firestore;
  user : User = new User();
  appLanuch : boolean = true;
  userTypes : string[];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private routingService : RoutingService,
    private authenticationService : AuthenticationService,
    private storage : StorageService,
    private menuCtrl : MenuController
  ) {
    this.initializeApp();
    this.platform.backButton.subscribe(async () => {
      // this.routingService.routeBack();
    });
  }

  async initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
    this.listenUser();
  }

  listenUser() {
    this.db = firebase.firestore();
    let auth: firebase.auth.Auth = firebase.auth();
    auth.onAuthStateChanged(async (user: firebase.User) => {
      if (user) {
      try{
      this.db.collection(Collection.Users).doc(user.uid).onSnapshot((doc: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>) => {
        this.storage.setUser(doc.data() as User);
        this.user = this.storage.getUser();
        if(this.appLanuch){
          if(this.user.type !== this.userTypes[2]){
            this.routingService.goToHome();
          }else{
            this.routingService.goToDashboard();
          }
          this.appLanuch = false;
        }
      })
    }catch(e){
      console.log(e.message)
    }
      }else{
        console.log("User Not Available");
        this.storage.RemoveAllProperties();
        this.routingService.goToSignIn();
        this.user = this.storage.getUser();
      }
    });
  }

  ngOnInit() {
    this.userTypes = Object.keys(UserType);
  }

  toggle(id:string){
    var elem = document.getElementById(id);
    if(elem){
      elem.click();
    }
  }

  async logOutUser(){
    await this.authenticationService.logoutUser();
    await this.menuCtrl.close();
    this.appLanuch = true;
  }

  goToProfile(){
    this.routingService.goToProfile();
  }

  goToDashboard(){
    this.routingService.goToDashboard();
  }

  goToList(){
    this.routingService.goToUsersList();
  }

  goToServicesList(){
    this.routingService.goToServicesList();
  }

  goToSignUp(){
    this.routingService.goToSignUp();
  }

  goToSignIn(){
    this.routingService.goToSignIn();
  }

  goToHome(){
    this.routingService.goToHome();
  }

  goToRequestList(){
    this.routingService.goToRequestList();
  }
  
  goToForgetPassword(){
    this.routingService.goToForgetPassword();
  }

}
