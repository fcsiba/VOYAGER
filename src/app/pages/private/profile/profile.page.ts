import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { User } from 'src/app/shared/models/User';
import { StorageService } from 'src/app/shared/services/client-service/storage.service';
import { UserType, ViewMode, Collection } from 'src/app/shared/enums/enums';
import { CloudFirestoreService } from 'src/app/shared/services/database-service/cloud-firestore-service';
import { UtilService } from 'src/app/shared/services/client-service/util.service';
import * as firebase from 'firebase';
import { FileUploader } from 'ng2-file-upload';
import { RoutingService } from 'src/app/shared/services/client-service/routing.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  user : User = new User();
  userBeforeEdit : User = new User();
  userTypes : string[];
  viewModes : string[]; 
  viewMode : ViewMode = ViewMode.view;
  @ViewChild("fileInput", { static: true }) myFileInput;
  constructor(private storage: StorageService,private cloudFirestore : CloudFirestoreService,private util : UtilService,private routingService : RoutingService) { }
  public uploader: FileUploader = new FileUploader({});

  ngOnInit() {
    this.user = this.storage.getUser();
    this.userTypes = Object.keys(UserType);
    this.viewModes = Object.keys(ViewMode);
  }

  async toggleView(cancel=false){
    if(this.viewMode === ViewMode.view){
      this.viewMode = ViewMode.edit;
      this.userBeforeEdit = JSON.parse(JSON.stringify(this.user));
    }else{
      if(cancel){
        this.viewMode = ViewMode.view;
        this.myFileInput.nativeElement.value = "";
        let url = this.user.photoUrl;
        this.user = this.userBeforeEdit;
        this.user.photoUrl = url;
      }else{
        let loader = await this.util.showLoader();
        loader.present();
        await this.updateUser();
        this.viewMode = ViewMode.view;
        loader.dismiss();
      }
    }
  }

  async updateUser(){
    try{
      this.user.fullName = `${this.user.firstName} ${this.user.lastName}`;
      await this.cloudFirestore.set(this.user,this.user.id,Collection.Users);
    }catch(e){
      this.util.showToast(e.message);
    }
  }

  async onFileChanged(event) {
    let file : any = this.uploader.queue[this.uploader.queue.length-1]._file
    if(file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/jpg"){
      const loading = await this.util.showLoader();
      await loading.present();
      let upload = await this.uploadToFirebase(file,"profilePictures",this.user.id);
      if(upload){
        this.user.photoUrl = upload.url;
        this.updateUser();
        await loading.dismiss();
      }else{
        await loading.dismiss();
        await this.util.showToast("Upload Picture Failed");
      }
      
    }
    else{
     this.myFileInput.nativeElement.value = "";
     await this.util.showToast("Upload Coorect Format PNG or JPG");
    }
   }

   async uploadToFirebase(
    file: any,
    name: string,
    child: string = "profilePictures"
  ) {
    try {
      let storageRef = firebase.storage().ref();
      const metadata = {
        contentType: file.type,
      };
      const task = await storageRef
        .child(child)
        .child(name)
        .put(file, metadata);
      let url = await task.ref.getDownloadURL();
      let res = await task.ref.getMetadata();
      url = url.slice(0, url.indexOf("&token")) + `&version=${Math.random()}`;
      const data = {
        url: url,
        res: res,
      };
      return data;
    } catch (e) {
      console.log(e.message);
      await this.util.showToast("Upload Failed");
      return false;
    }
  }

  goToDashboard(){
    this.routingService.goToDashboard();
  }

}
