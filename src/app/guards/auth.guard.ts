import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { StorageService } from '../shared/services/client-service/storage.service';
import { UtilService } from '../shared/services/client-service/util.service';
import { StorageKeys, Path } from '../shared/enums/enums';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    public storage: StorageService,
    public util: UtilService,
    public router: Router
  ) {

  }

  canActivate(): boolean {
    if (!this.storage.GetProperty(StorageKeys.User)){
      this.router.navigate([Path.SignIn], { replaceUrl: true });
    }
    return this.storage.isAuthenticated();
  }
}
