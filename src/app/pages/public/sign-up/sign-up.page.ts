import { Component, OnInit } from '@angular/core';
import { RoutingService } from 'src/app/shared/services/client-service/routing.service';
import { User } from 'src/app/shared/models/User';
import { UserType, Collection } from 'src/app/shared/enums/enums';
import { AuthenticationService } from 'src/app/shared/services/database-service/authentication.service';
import { UtilService } from 'src/app/shared/services/client-service/util.service';
import { CloudFirestoreService } from 'src/app/shared/services/database-service/cloud-firestore-service';
import { StorageService } from 'src/app/shared/services/client-service/storage.service';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {
  showPassword : boolean = false;
  showConfirmPassword : boolean = false;
  passwordTxt : string;
  confirmPasswordTxt : string;
  user : User = new User();
  userTypes : string[];
  constructor(
    public routingService : RoutingService,
    public authenticationService : AuthenticationService,
    public cloudFirestore : CloudFirestoreService,
    private util : UtilService,
  ) { 

  }

  ngOnInit() {
    this.userTypes = Object.keys(UserType);
  }

  toggleShowPassword(el){
    this.showPassword = !this.showPassword;
    if(this.showPassword){
      el.valueAccessor.el.nativeElement.type = "text";
    }else{
      el.valueAccessor.el.nativeElement.type = "password";
    }
  }

  toggleShowConfirmPassword(el){
    this.showConfirmPassword = !this.showConfirmPassword;
    if(this.showConfirmPassword){
      el.valueAccessor.el.nativeElement.type = "text";
    }else{
      el.valueAccessor.el.nativeElement.type = "password";
    }
  }

  goToSignIn(){
    this.routingService.goToSignIn();
  }

  async signUp(){
    let loader = await this.util.showLoader();
    loader.present();
    try{
      this.user.fullName = `${this.user.firstName} ${this.user.lastName}`;
      this.user.createdOn = new Date().getTime();
    if(this.user.type === UserType.vendor){
      this.user.verified = 0;
    }
    let signUpRespnse = await this.authenticationService.createUser(this.user.email,this.passwordTxt);
    if(signUpRespnse){
      this.user.id = signUpRespnse.user.uid;
      await this.cloudFirestore.set(this.user,this.user.id,Collection.Users);
      this.routingService.goToProfile();
    }
    loader.dismiss();
    }catch(e){
      loader.dismiss();
      this.util.showToast(e.message);
    }
    
  }

}
