import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/shared/models/User';
import { RoutingService } from 'src/app/shared/services/client-service/routing.service';
import { AuthenticationService } from 'src/app/shared/services/database-service/authentication.service';
import { CloudFirestoreService } from 'src/app/shared/services/database-service/cloud-firestore-service';
import { UtilService } from 'src/app/shared/services/client-service/util.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.page.html',
  styleUrls: ['./forget-password.page.scss'],
})
export class ForgetPasswordPage implements OnInit {
  user : User = new User();
  constructor(
    public routingService : RoutingService,
    public authenticationService : AuthenticationService,
    public cloudFirestore : CloudFirestoreService,
    private util : UtilService,
  ) { }

  ngOnInit() {
  }

  goToSignIn(){
    this.routingService.goToSignIn();
  }

  async recoverAccount(){
    let loader = await this.util.showLoader();
    loader.present();
    try{
      let passResetResponse = await this.authenticationService.recoverPassword(this.user.email);
      loader.dismiss();
    if(passResetResponse){
      this.util.showToast(`Password Reset Link Successfully Sent To ${this.user.email}`);
      this.routingService.goToSignIn();
    }
    }catch(e){
      loader.dismiss();
      this.util.showToast(e.message);
    }
    
  }

}
