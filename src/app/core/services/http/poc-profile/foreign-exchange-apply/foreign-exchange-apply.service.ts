/*
 * @Author: zhangxuefeng
 * @Date: 2023-10-26 11:05:43
 * @LastEditors: zhangxuefeng
 * @LastEditTime: 2023-10-26 14:41:23
 * @Description:
 */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { BaseHttpService } from '../../base-http.service';
import { timeToTimestamp } from '@app/utils/tools';
import { DatePipe } from '@angular/common';

export interface Adata {
  settlementInformations: any;
  exchangeInformations: any;
  businessType: any;
}

export interface Rdata {
  exchangeInformations: any;
}

@Injectable({
  providedIn: 'root'
})
export class ForeignExchangeApplyService {
  constructor(
    public http: BaseHttpService,
    private https: HttpClient,
    private date: DatePipe
  ) { }

  public getList(
    pageIndex: number,
    pageSize: number,
    filters: any
  ): Observable<any> {
    const data: any = {
      pageSize: pageSize,
      pageNum: pageIndex,
      businessApplicationCode: filters.businessApplicationCode || '',
      businessApplicationStatus: filters.businessApplicationStatus,
      applicationType: filters.applicationType,
      startApplicationDate: filters.applicationTime[0]
        ? timeToTimestamp(
          this.date.transform(filters.applicationTime[0], 'yyyy-MM-dd') +
          ' 00:00:00'
        )
        : '',
      endApplicationDate: filters.applicationTime[1]
        ? timeToTimestamp(
          this.date.transform(filters.applicationTime[1], 'yyyy-MM-dd') +
          ' 23:59:59'
        )
        : '',
      startApprovalDate: filters.approvalTime[0]
        ? timeToTimestamp(
          this.date.transform(filters.approvalTime[0], 'yyyy-MM-dd') +
          ' 00:00:00'
        )
        : '',
      endApprovalDate: filters.approvalTime[1]
        ? timeToTimestamp(
          this.date.transform(filters.approvalTime[1], 'yyyy-MM-dd') +
          ' 23:59:59'
        )
        : ''
    };
    return this.https.post('/v1/fxsp/sys/exchange/searches', data).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  public getInfo(params: { businessApplicationCode: string }): Observable<any> {
    return this.http.post(`/v1/fxsp/sys/exchange/search`, params);
  }

  public add(params: Adata): Observable<any> {
    return this.https.post(`/v1/fxsp/sys/exchange/save`, params);
  }

  public getSpInfo(): Observable<any> {
    return this.http.post(`/v1/fxsp/sys/exchange/spinfo/search`, {});
  }
  public getSpApproved(): Observable<any> {
    return this.http.post(`/v1/fxsp/sys/exchange/approved/search`, {});
  }
  public getSpApprovedInfo(): Observable<any> {
    return this.http.post(`/v1/fxsp/sys/exchange/approved/sp/info/search`, {});
  }

  public reduce(params: Rdata): Observable<any> {
    return this.http.post(`/v1/fxsp/sys/exchange/delete/exchange/pair`, params);
  }

  public reduceList(): Observable<any> {
    return this.http.post(`/v1/fxsp/sys/home/latest/exchange/rate/searches`,{});
  }
}
