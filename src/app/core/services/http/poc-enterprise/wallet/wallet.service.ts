/*
 * @Author: chenyuting
 * @Date: 2024-12-11 17:35:16
 * @LastEditors: chenyuting
 * @LastEditTime: 2025-01-20 17:35:31
 * @Description:
 */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { timeToTimestamp, timeToTimestampMillisecond } from '@app/utils/tools';
import { DatePipe } from '@angular/common';
import { BaseHttpService } from '../../base-http.service';

export interface Adata {
  exportStrategy: string;
  taskName: string;
  timeZone: string;
  tokenId: string | number;
  txTypes: Array<any>;
}

export interface Sdata {
  exportRuleId: string | number;
  state: number;
}

export interface Cdata {
  exportType: string | number;
  moduleType: string | number;
  timeZone: string;
  transactionRecordsListReqVO?: any;
  billTxListReqVO?: any;
}

@Injectable({
  providedIn: 'root'
})
export class WalletService {
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
        accountAddress: filters.accountAddress || '',
        currency: filters.currency || '',
        enterpriseCode: filters.enterpriseCode || '',
        status: filters.status || '',
        startCreateTime: filters.createTime[0]
          ? timeToTimestampMillisecond(
              this.date.transform(filters.createTime[0], 'yyyy-MM-dd') +
                ' 00:00:00'
            )
          : '',
        endCreateTime: filters.createTime[1]
          ? timeToTimestampMillisecond(
              this.date.transform(filters.createTime[1], 'yyyy-MM-dd') +
                ' 23:59:59'
            )
          : ''
      },
      page: {
        pageSize: pageSize,
        pageNum: pageIndex
      }
    };
    return this.https
      .post('/api/manage/v1/Enterprise/wallet/listPage', param)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  public detail(params: { bankAccountId: any }): Observable<any> {
    return this.http.post(`/api/manage/v1/Enterprise/wallet/detail`, params);
  }
}
