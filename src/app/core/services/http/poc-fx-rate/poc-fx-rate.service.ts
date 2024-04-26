/*
 * @Author: chenyuting
 * @Date: 2024-04-18 15:29:43
 * @LastEditors: chenyuting
 * @LastEditTime: 2024-04-24 11:22:10
 * @Description:
 */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { BaseHttpService } from '../base-http.service';
import { timeToTimestamp } from '@app/utils/tools';
import { DatePipe } from '@angular/common';

export interface Adata {
  lockable: string;
  userName: string;
  telephone: string;
  roleIdList: any;
  email: string;
  realName: string;
}

@Injectable({
  providedIn: 'root'
})
export class PocFxRateService {
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
      data: {
        fromCurrency: filters.fromCurrency || '',
        toCurrency: filters.toCurrency || '',
        startDate: filters.updateTime[0]
          ? timeToTimestamp(
              this.date.transform(filters.updateTime[0], 'yyyy-MM-dd') +
                ' 00:00:00'
            )
          : '',
        endDate: filters.updateTime[1]
          ? timeToTimestamp(
              this.date.transform(filters.updateTime[1], 'yyyy-MM-dd') +
                ' 23:59:59'
            )
          : ''
      },
      page: {
        pageSize: pageSize,
        pageNum: pageIndex
      }
    };
    return this.https.post('/v1/fxRate/listPage', param).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  public getCurrency(): Observable<any> {
    return this.http.post(`/v1/fxRate/all/currency/pair/searches`, {});
  }
}
