import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ServicesListAdminPageRoutingModule } from './services-list-admin-routing.module';

import { ServicesListAdminPage } from './services-list-admin.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ServicesListAdminPageRoutingModule
  ],
  declarations: [ServicesListAdminPage]
})
export class ServicesListAdminPageModule {}
