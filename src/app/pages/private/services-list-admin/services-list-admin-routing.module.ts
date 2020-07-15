import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ServicesListAdminPage } from './services-list-admin.page';

const routes: Routes = [
  {
    path: '',
    component: ServicesListAdminPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServicesListAdminPageRoutingModule {}
