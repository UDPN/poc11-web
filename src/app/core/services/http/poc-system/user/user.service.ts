import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { BaseHttpService } from '../../base-http.service';

export interface Adata {
  lockable: string;
  userName: string;
  telephone: string;
  roleIdList: any;
  email: string;
  realName: string;
}

export interface Edata {
  lockable: string;
  userName: string;
  telephone: string;
  roleIdList: any;
  email: string;
  realName: string;
  userId: string;
}

export interface Sdata {
  lockable: number;
  userId: string;
}


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(public http: BaseHttpService, private https: HttpClient) { }
  public list(
    pageIndex: number,
    pageSize: number,
    filters: any
  ): Observable<any> {
    const data: any = {
      userName: filters.userName || '',
      realName: filters.realName || '',
      pageSize: pageSize,
      pageNum: pageIndex
    };
    return this.https.post('/v1/fxsp/sys/user/manage/searches', data)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  public add(params: Adata): Observable<any> {
    return this.http.post(`/v1/fxsp/sys/user/manage/save`, params);
  }

  public edit(params: Edata): Observable<any> {
    return this.http.post(`/v1/fxsp/sys/user/manage/edit`, params);
  }

  public info(params: { userId: string }): Observable<any> {
    return this.http.post(`/v1/fxsp/sys/user/manage/edit/detail/search`, params);
  }

  public resetPassword(params: { userId: string }): Observable<any> {
    return this.http.post(`/v1/fxsp/sys/user/manage/password/reset`, params);
  }

  public statusUpdate(params: Sdata): Observable<any> {
    return this.http.post(`/v1/fxsp/sys/user/manage/status/update`, params);
  }

  public roleList(): Observable<any> {
    return this.http.post(`/v1/fxsp/sys/role/manage/all/searches`, {});
  }


}
