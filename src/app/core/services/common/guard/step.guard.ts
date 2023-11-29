import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanActivateChild, CanActivate } from '@angular/router';
import { map, Observable } from 'rxjs';
import { BnJoinService } from '../../http/bn-join/bn-join.service';
import { UpdateStoreService } from '../../store/onboarding-store/update.service';

import { WindowService } from '../window.service';


@Injectable({
    providedIn: 'root'
})
export class StepGuard implements CanActivate {
    constructor(private windowSrc: WindowService, private router: Router, public _bnJoinService: BnJoinService, private updateStoreService: UpdateStoreService) { }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        const isSecondStep = !!this.windowSrc.getSessionStorage('secondStep');
        if (isSecondStep) {
            return this._bnJoinService.fetchBnStatus().pipe(map((data) => {
      
                if (!data && typeof (data) != "undefined" && data != 0) {
                    this.windowSrc.removeSessionStorage("initData");
                    return true;
                }
                if (data.state === 6 || data.state === 2010) {
                    this.updateStoreService.setDataUpdateStore(data);
                }
                return true;
            }))
            return true;
        }
        this.router.navigateByUrl('/onboarding/bn-onboarding');
        return false;
    }

}
