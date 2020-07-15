import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { StorageService } from './storage.service';
import { Path } from '../../enums/enums';
import { ServiceFormComponent } from 'src/app/components/service-form/service-form.component';
import { Service } from '../../models/Service';
import { Attendant } from '../../models/Attendants';
import { UsersListComponent } from 'src/app/components/users-list/users-list.component';
import { RequestslistComponent } from 'src/app/components/requestslist/requestslist.component';
import { ServiceInfoComponent } from 'src/app/components/service-info/service-info.component';

@Injectable({
  providedIn: "root"
})
export class RoutingService {
  constructor(
    private router: Router,
    private activatedRoute : ActivatedRoute,
    private modalCtrl: ModalController,
    private storage : StorageService
  ) { }

  // overall App Routing

  goToSignIn() {
    this.route(Path.SignIn);
  }
  
  goToSignUp() {
    this.route(Path.SignUp);
  }

  goToProfile() {
    this.route(Path.Profile);
  }

  goToDashboard() {
    this.route(Path.Dashboard);
  }

  goToUsersList() {
    this.route(Path.UsersList);
  }

  goToServicesList() {
    this.route(Path.ServicesList);
  }

  goToHome() {
    this.route(Path.Home);
  }

  goToRequestList(){
    this.route(Path.Requested);
  }

  goToForgetPassword(){
    this.route(Path.forgetPassword);
  }


  // goToEditProject(id? : string) {
  //   this.setBackPath(PathEnum.Home);
  //   let data : any;
  //   if(id){
  //     data = {
  //       id : id
  //     }
  //   }
  //   this.route(PathEnum.EditProject,data);
  // }

  

  route(path:string,data?:any,replaceUrl:boolean = true){
    if(!data)
      {
        this.router.navigate([path], { replaceUrl: replaceUrl });
      }else{
        this.router.navigate([path,{data : JSON.stringify(data)}], { replaceUrl: replaceUrl });
      }
  }

  // routeBack(){
  //   if(this.storage.GetProperty("canBack")){
  //     let path = this.getBackPath();
  //     this.route(path);
  //     if(path === PathEnum.UserGuide){
  //       this.setBackPath(PathEnum.Help);
  //     }else{
  //       this.setBackPath(PathEnum.Home);
  //     }
  //     if(path === PathEnum.Home){
  //       console.log("Close The App");
  //     }
  //   }
  // }

  // setBackPath(path:PathEnum){
  //   this.storage.SetProperty("backPath",path);
  // }

  getBackPath(){
    return this.storage.GetProperty("backPath");
  }

  // modalController

  async showServiceFormModal(props?:Service) {
    if(props){
      let data= {
        service : props
      }
      await this.showModal(ServiceFormComponent, 'servicePopup',data);
    }else{
      await this.showModal(ServiceFormComponent, 'servicePopup');
    }
    return true;
  }

  async showAttendantsModal(props:Attendant[]) {
      let data= {
        attendants : props
      }
      await this.showModal(UsersListComponent, 'servicePopup',data);
  }

  async showRequestsModal(props:Attendant[],serviceId : string) {
    let data= {
      requests : props,
      serviceId : serviceId
    }
    await this.showModal(RequestslistComponent, 'servicePopup',data);
}

async showServiceInfoModal(props:Service,validate:boolean=false) {
  let data= {
    service : props,
    validate : validate
  }
  await this.showModal(ServiceInfoComponent, 'serviceinfo',data);
}

  // async showPrint(map,layerInfo) {
  //   let props= {
  //     layerInfo : layerInfo,
  //     map : map
  //   }
  //   await this.showModal(PrintPopupComponent, 'printPopup',props);
  // }

  
  
  async showModal(component:any,cssClass:string,props?:any,showBackdrop:boolean=true){
    const modal = await this.modalCtrl.create({
      component: component,
      cssClass: cssClass,
      componentProps: props && props,
      showBackdrop : showBackdrop
    });
    this.storage.SetProperty("canBack",false);
    await modal.present();
    let dismissRes =  await modal.onWillDismiss();
    this.storage.SetProperty("canBack",true);
    return dismissRes;
  }

}
