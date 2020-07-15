import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'sign-in',
    loadChildren: () => import('./pages/public/sign-in/sign-in.module').then( m => m.SignInPageModule)
  },
  {
    path: 'sign-up',
    loadChildren: () => import('./pages/public/sign-up/sign-up.module').then( m => m.SignUpPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/private/profile/profile.module').then( m => m.ProfilePageModule),
    canActivate: [AuthGuard] 
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/private/dashboard/dashboard.module').then( m => m.DashboardPageModule),
    canActivate: [AuthGuard] 
  },
  {
    path: 'users-list',
    loadChildren: () => import('./pages/private/users-list/users-list.module').then( m => m.UsersListPageModule),
    canActivate: [AuthGuard] 
  },
  {
    path: 'services-list-admin',
    loadChildren: () => import('./pages/private/services-list-admin/services-list-admin.module').then( m => m.ServicesListAdminPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/private/home/home.module').then( m => m.HomePageModule),
  },
  {
    path: 'requested',
    loadChildren: () => import('./pages/private/requested/requested.module').then( m => m.RequestedPageModule),
    canActivate: [AuthGuard]
  },  {
    path: 'forget-password',
    loadChildren: () => import('./pages/public/forget-password/forget-password.module').then( m => m.ForgetPasswordPageModule)
  }





];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
