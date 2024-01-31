import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ActionCode } from '@config/actionCode';
import { TokenKey, TokenPre } from '@config/constant';
import { SimpleReuseStrategy } from '@core/services/common/reuse-strategy';
import { TabService } from '@core/services/common/tab.service';
import { WindowService } from '@core/services/common/window.service';
import { Menu } from '@core/services/types';
import { LoginService } from '@services/login/login.service';
import { MenuStoreService } from '@store/common-store/menu-store.service';
import {
  UserInfo,
  UserInfoService
} from '@store/common-store/userInfo.service';
import { getDeepReuseStrategyKeyFn } from '@utils/tools';
import { fnFlatDataHasParentToTree } from '@utils/treeTableTools';
import { JwtHelperService } from '@auth0/angular-jwt';
import { SocketService } from './socket.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginInOutService {
  constructor(
    private activatedRoute: ActivatedRoute,
    private tabService: TabService,
    private loginService: LoginService,
    private router: Router,
    private userInfoService: UserInfoService,
    private menuService: MenuStoreService,
    private windowServe: WindowService,
    private socketService: SocketService,
    private notification: NzNotificationService
  ) {}

  getMenuByUserId(): Observable<Menu[]> {
    return this.loginService.getMenuByUserId();
  }

  loginIn(token: string): Promise<void> {
    if (environment.production) {
      let ws =
        'wss://poc11-oaigateway.commercial-bank1.svc.cluster.local:6480/wcbdccommercial/websocket/h5?token=';
      this.socketService.connect(
        ws + this.windowServe.getSessionStorage('token')
      );
    }

    return new Promise((resolve) => {
      this.windowServe.setSessionStorage(TokenKey, TokenPre + token);

      const userInfo: UserInfo = this.userInfoService.parsToken(
        TokenPre + token
      );
      userInfo.authCode.push(ActionCode.TabsDetail);
      userInfo.authCode.push(ActionCode.SearchTableDetail);

      userInfo.authCode.push('R0');

      this.userInfoService.setUserInfo(userInfo);

      const helper = new JwtHelperService();
      const { resourceList } = helper.decodeToken(token)['user_name'];
      this.getMenuByUserId()
        .pipe(
          finalize(() => {
            resolve();
          })
        )
        .subscribe((menus) => {
          menus = menus.filter((item) => {
            item.selected = false;
            item.open = false;
            return item.menuType === 'C' || resourceList.includes(item.code);
          });
          const temp = fnFlatDataHasParentToTree(menus);

          this.menuService.setMenuArrayStore(temp);
          resolve();
        });
    });
  }

  loginOut(): Promise<void> {
    return new Promise((resolve) => {
      this.tabService.clearTabs();
      this.windowServe.removeSessionStorage(TokenKey);
      SimpleReuseStrategy.handlers = {};
      SimpleReuseStrategy.scrollHandlers = {};
      this.menuService.setMenuArrayStore([]);
      SimpleReuseStrategy.waitDelete = getDeepReuseStrategyKeyFn(
        this.activatedRoute.snapshot
      );
      this.router.navigate(['/login/login-modify']).then(() => {
        resolve();
      });
    });
  }
}
