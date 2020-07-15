import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RequestedPage } from './requested.page';

const routes: Routes = [
  {
    path: '',
    component: RequestedPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestedPageRoutingModule {}
