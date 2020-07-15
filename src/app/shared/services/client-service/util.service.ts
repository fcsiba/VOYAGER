import { Injectable } from '@angular/core';
import { ToastController, LoadingController, ModalController} from '@ionic/angular';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: "root"
})
export class UtilService {
  constructor(
    public toastController: ToastController,
    private storage: StorageService,
    public loadingController: LoadingController,
    public modalCtrl: ModalController
  ) { }

  async showToast(msg,duration?) {
    const toast = await this.toastController.create({
      message: msg,
      position: "top",
      cssClass: 'inAppToast',
      mode: 'md',
      duration: duration ? duration : 1000
    });
    toast.present();
  }

  async showLoader(message?: string) {
    this.storage.SetProperty("canBack",false);
    let defaultMessage : string = "Please Wait";
    return await this.loadingController.create({
      spinner: null,
      // duration: duration,
      cssClass: 'custom-loading',
      message: message ? message : defaultMessage,
      translucent: true,
    //   cssClass: 'custom-class cu  stom-loading newLoader'
    });

  }

  enableBack(){
    this.storage.SetProperty("canBack",true);
  }

  getUTCDateMiliseconds(newDate?: Date) {
    var date = new Date();
    if (newDate !== undefined) {
      date = new Date(newDate.getTime());
    }

    var now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
      date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
    return new Date(now_utc).getTime();
  }

  getUTCDateTime(newDate?: Date) {
    var date = new Date();
    if (newDate !== undefined) {
      date = new Date(newDate.getTime());
    }

    var now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
      date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
    return new Date(now_utc);
  }

}