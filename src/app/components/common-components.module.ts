import { IonicModule } from "@ionic/angular";
import { CommonModule } from "@angular/common";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { FormsModule } from '@angular/forms';
import { ServiceFormComponent } from './service-form/service-form.component';
import { UsersListComponent } from './users-list/users-list.component';
import { RequestslistComponent } from './requestslist/requestslist.component';
import { ServiceInfoComponent } from './service-info/service-info.component';
@NgModule({
  declarations: [
    ServiceFormComponent,
    UsersListComponent,
    RequestslistComponent,
    ServiceInfoComponent
  ],
  exports: [
    ServiceFormComponent,
    UsersListComponent,
    RequestslistComponent,
    ServiceInfoComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule
  ],
  entryComponents: [
    ServiceFormComponent,
    UsersListComponent,
    RequestslistComponent,
    ServiceInfoComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class CommonComponentsModule { }