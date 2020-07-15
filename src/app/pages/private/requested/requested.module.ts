import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RequestedPageRoutingModule } from './requested-routing.module';

import { RequestedPage } from './requested.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RequestedPageRoutingModule
  ],
  declarations: [RequestedPage]
})
export class RequestedPageModule {}
