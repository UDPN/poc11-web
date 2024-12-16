/*
 * @Author: chenyuting
 * @Date: 2024-12-11 17:35:16
 * @LastEditors: chenyuting
 * @LastEditTime: 2024-12-13 14:26:16
 * @Description:
 */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { BaseHttpService } from '../base-http.service';

@Injectable({
  providedIn: 'root'
})
export class PocDownloadCenterService {
  constructor(
    public http: BaseHttpService,
    private https: HttpClient
  ) {}
  public fetchList(
    pageIndex: number,
    pageSize: number
  ): Observable<any> {
    const param: any = {
      data: {},
      page: {
        pageSize: pageSize,
        pageNum: pageIndex
      }
    };

    return this.https.post('/v1/export/task/list/my', param).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
}
