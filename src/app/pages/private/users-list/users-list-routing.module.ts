import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsersListPage } from './users-list.page';

const routes: Routes = [
  {
    path: '',
    component: UsersListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  schemas:[
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class UsersListPageRoutingModule {}
