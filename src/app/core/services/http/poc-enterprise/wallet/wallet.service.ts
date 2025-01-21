/*
 * @Author: chenyuting
 * @Date: 2024-12-11 17:35:16
 * @LastEditors: chenyuting
 * @LastEditTime: 2025-01-21 17:09:06
 * @Description:
 */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { timeToTimestamp, timeToTimestampMillisecond } from '@app/utils/tools';
import { DatePipe } from '@angular/common';
import { BaseHttpService } from '../../base-http.service';

export interface Adata {
  bankAccountId: string | number;
  remarks: string;
  result: number;
}

export interface Gdata {
  bankAccountId: string | number;
  walletState: number;
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
          ? timeToTimestamp(
              this.date.transform(filters.createTime[0], 'yyyy-MM-dd') +
                ' 00:00:00'
            )
          : '',
        endCreateTime: filters.createTime[1]
          ? timeToTimestamp(
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
    return this.https.post('/v1/enterprise/wallet/listPage', param).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  public getBasicInfo(params: { bankAccountId: any }): Observable<any> {
    return this.http.post(`/v1/enterprise/wallet/detail`, params);
  }

  public getTopUpAndWithdrawInfo(
    pageIndex: number,
    pageSize: number,
    filters: any
  ): Observable<any> {
    const param: any = {
      data: {
        bankAccountId: filters.bankAccountId || ''
      },
      page: {
        pageSize: pageSize,
        pageNum: pageIndex
      }
    };
    return this.https
      .post('/v1/enterprise/wallet/detail/topUpAndWithdraw', param)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  public getTransferInfo(
    pageIndex: number,
    pageSize: number,
    filters: any
  ): Observable<any> {
    const param: any = {
      data: {
        bankAccountId: filters.bankAccountId || ''
      },
      page: {
        pageSize: pageSize,
        pageNum: pageIndex
      }
    };
    return this.https
      .post('/v1/enterprise/wallet/detail/transferAndFxpurchasing', param)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  public approve(params: Adata): Observable<any> {
    return this.http.post(`/v1/enterprise/wallet/process`, params);
  }

  public getStatusUpdate(params: Gdata): Observable<any> {
    return this.http.post(`/v1/enterprise/wallet/update/status`, params);
  }
}
