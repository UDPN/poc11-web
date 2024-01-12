import { Inject, Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';


import { Menu } from '@core/services/types';
import { BaseHttpService } from '@services/base-http.service';
import { MenusService } from '@services/system/menus.service';
import { WindowService } from '../../common/window.service';
import { MENU_TOKEN } from '@app/config/menu';
import { HttpClient } from '@angular/common/http';

export interface UserLogin {
  name: string;
  password: string;
}

export interface UserLogins {
  code: string;
}


export interface UserPre {
  loginName: string
}

export interface ResourceList {
  resourceCode: string;
  resourceLevel: string;
}

export interface PermissionData {
  userId: number;
  userName: string;
  resourceList: ResourceList;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(
    public http: BaseHttpService, 
    private https: HttpClient,
    @Inject(MENU_TOKEN) public menus: Menu[],
    private menuService: MenusService,
    private windowServe: WindowService
  ) { }

  public login(params: UserLogins): Observable<any> {
    const param = new FormData();
    param.append('code', params.code);
    return this.http.post(`/fxsp/login/user`, param);
  }

  public register(params: UserLogins): Observable<any> {
    return this.http.post(`/v1/udpn/processing/register/manage/register`, params, { needSuccessInfo: false });
  }

  public getMenuByUserId(): Observable<Menu[]> {
    return of(this.menus);
  }


  public getUserPermission(params: UserPre): Observable<PermissionData> {
    return this.http.post(`/v1/udpn/member/user/manage/selectByLoginName`, params);
  }

  public fetchUserName(): Observable<any> {
    return this.http.post(`/v1/udpn/processing/user/manage/login/user/info/select`, {});
  }

  public fetchBnName(): Observable<any> {
    return this.http.post(`/v1/udpn/processing/login/manage/instance/select`, {});
  }

  public loginOut(): Observable<any> {
    return this.https.get(`/fxsp/logout/user`);
  }
}
