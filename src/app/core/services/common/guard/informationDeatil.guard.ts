/*
 * @Author: zhangxuefeng
 * @Date: 2023-10-21 10:20:36
 * @LastEditors: zhangxuefeng
 * @LastEditTime: 2023-12-28 19:43:00
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

@Injectable({
  providedIn: 'root'
})
export class DeatilsGuard implements CanActivate {
  constructor(
    private windowSrc: WindowService,
    private router: Router,
    public _informationService: InformationService,
    private updateStoreService: UpdateStoreService
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    return this._informationService.detail().pipe(
      map((data) => {
        if (data === null) {
          this.router.navigateByUrl('/information/form');
          return false;
        }
        if (data !== null && data.spStatus === 5) {
          return true;
        }
        if (data !== null && data.spStatus === 15) {
          return true;
        }
        if (data !== null && data.spStatus === 10) {
          this.router.navigateByUrl('/poc/poc-home/home');
          return false;
        }
        return true;
      })
    );
  }
}
