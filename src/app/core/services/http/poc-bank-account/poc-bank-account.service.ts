/*
 * @Author: chenyuting
 * @Date: 2024-12-11 17:35:16
 * @LastEditors: chenyuting
 * @LastEditTime: 2024-12-12 14:11:05
 * @Description:
 */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { BaseHttpService } from '../base-http.service';
import { timeToTimestamp } from '@app/utils/tools';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class PocBankAccountService {
  constructor(
    public http: BaseHttpService,
    private https: HttpClient,
    private date: DatePipe
  ) {}
  public fetchList(
    pageIndex: number,
    pageSize: number,
    filters: any
  ): Observable<any> {
    const param: any = {
      data: {},
      page: {
        pageSize: pageSize,
        pageNum: pageIndex
      }
    };

    return this.https
      .post('/v1/bank/account/flat/money/transactions', param)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  public getOverview(): Observable<any> {
    return this.http.post(`/v1/bank/account/overview/search`, {});
  }
}
