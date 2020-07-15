import { Component, OnInit } from '@angular/core';
import { ModalController, MenuController } from '@ionic/angular';
import { ServiceFormComponent } from 'src/app/components/service-form/service-form.component';
import { RoutingService } from 'src/app/shared/services/client-service/routing.service';
import { AuthenticationService } from 'src/app/shared/services/database-service/authentication.service';
import { UtilService } from 'src/app/shared/services/client-service/util.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage implements OnInit {

  showPassword : boolean = false;
  passwordTxt : string;
  emailTxt : string;

  constructor(
    public modalCtrl : ModalController,
    public routingService : RoutingService,
    public authenticationService : AuthenticationService,
    private util : UtilService
    ) { }

  ngOnInit() {
  }

  goToSignUp(){
    this.routingService.goToSignUp();
  }

  toggleShowPassword(el){
    this.showPassword = !this.showPassword;
    if(this.showPassword){
      el.valueAccessor.el.nativeElement.type = "text";
    }else{
      el.valueAccessor.el.nativeElement.type = "password";
    }
  }

  async signIn(){
    let loader = await this.util.showLoader();
    loader.present();
    try{
      await this.authenticationService.authenticateWithFirebase(this.emailTxt,this.passwordTxt);
      loader.dismiss();
    }catch(e){
      loader.dismiss();
      this.util.showToast(e.message);
    }
  }

  // async showModal(){
  //   const modal = await this.modalCtrl.create({
  //     component: ServiceFormComponent,
  //     cssClass: "",
  //   });
  //   await modal.present();
  // }

  goToForgetPassword(){
    this.routingService.goToForgetPassword();
  }

}
