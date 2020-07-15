import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilePageRoutingModule } from './profile-routing.module';

import { ProfilePage } from './profile.page';

import { FileUploadModule } from 'ng2-file-upload';

import { NgxMaskIonicModule } from 'ngx-mask-ionic';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfilePageRoutingModule,
    FileUploadModule,
    NgxMaskIonicModule
  ],
  declarations: [ProfilePage]
})
export class ProfilePageModule {}
