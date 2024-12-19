/*
 * @Author: zhangxuefeng
 * @Date: 2023-10-21 10:20:36
 * @LastEditors: chenyuting
 * @LastEditTime: 2024-12-19 10:16:08
 * @Description:
 */
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
  CanActivateChild,
  CanActivate
} from '@angular/router';
import { Observable } from 'rxjs';
import { InformationService } from '../../http/information/information.service';

import { WindowService } from '../window.service';
import { UpdateStoreService } from '../../store/onboarding-store/update.service';
import { IsFirstLogin, TokenKey } from '@app/config/constant';

@Injectable({
  providedIn: 'root'
})
export class EditGuard implements CanActivate {
  constructor(
    private windowSrc: WindowService,
    private router: Router,
    public _informationService: InformationService,
    private updateStoreService: UpdateStoreService
  ) {}
  canActivate(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    return this._informationService.detail().pipe(
      map((data) => {
        if (data && data.spStatus === 0) {
          this.router.navigateByUrl('/information/form');
          return false;
        }
        if (data !== null && data.spStatus === 5) {
          // this.router.navigateByUrl('/information/detail');
          return true;
        }
        if (data !== null && data.spStatus === 15) {
          // return true;
          return false;
        }
        // if (data !== null && data.spStatus === 10) {
        //   this.router.navigateByUrl('/poc/poc-home/home');
        //   return false;
        // }
        return true;
      })
    );
  }
}
