import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanActivateChild } from '@angular/router';

import { TokenKey,IsFirstLogin } from '@config/constant';

import { WindowService } from '../window.service';


@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivateChild {
  constructor(private windowSrc: WindowService, private router: Router) {}

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    const isLogin = !!this.windowSrc.getSessionStorage(TokenKey);
    const isFirstLogin = this.windowSrc.getStorage(IsFirstLogin);

    if( isFirstLogin === 'true'){
      return this.router.parseUrl('/onboarding/bn-onboarding-details');
    }
    if (isLogin) {
        return this.router.parseUrl('/poc/poc-home/home');
    }
    return true;
  }
}



