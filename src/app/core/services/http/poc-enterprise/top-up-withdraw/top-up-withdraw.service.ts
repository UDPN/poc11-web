/*
 * @Author: chenyuting
 * @Date: 2024-12-11 17:35:16
 * @LastEditors: chenyuting
 * @LastEditTime: 2025-01-22 17:28:05
 * @Description:
 */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { BaseHttpService } from '../../base-http.service';
import { Observable, map } from 'rxjs';
import { timeToTimestampMillisecond } from '@app/utils/tools';

@Injectable({
  providedIn: 'root'
})
export class TopUpWithdrawService {
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
        applicationId: filters.applicationId || '',
        currency: filters.currency || '',
        enterpriseCode: filters.enterpriseCode || '',
        status: filters.status || '',
        transactionType: filters.transactionType || '',
        txHash: filters.txHash || '',
        walletAddress: filters.walletAddress || '',
        appliedOnBegin: filters.appliedOn[0]
          ? timeToTimestampMillisecond(
              this.date.transform(filters.appliedOn[0], 'yyyy-MM-dd') +
                ' 00:00:00'
            )
          : '',
        appliedOnEnd: filters.appliedOn[1]
          ? timeToTimestampMillisecond(
              this.date.transform(filters.appliedOn[1], 'yyyy-MM-dd') +
                ' 23:59:59'
            )
          : ''
      },
      page: {
        pageSize: pageSize,
        pageNum: pageIndex
      }
    };
    return this.https.post('/v1/tx/approval/order/listPage', param).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  public fetchTransferList(
    pageIndex: number,
    pageSize: number,
    filters: any
  ): Observable<any> {
    const param: any = {
      data: {
        applicationId: filters.applicationId || '',
        enterpriseCode: filters.enterpriseCode || '',
        fromAccountAddress: filters.fromAccountAddress || '',
        receivingCurrency: filters.receivingCurrency || '',
        sendingCurrency: filters.sendingCurrency || '',
        state: filters.state || '',
        toAccountAddress: filters.toAccountAddress || '',
        type: filters.type || '',
        startTxTime: filters.createTime[0]
          ? timeToTimestampMillisecond(
              this.date.transform(filters.createTime[0], 'yyyy-MM-dd') +
                ' 00:00:00'
            )
          : '',
        endTxTime: filters.createTime[1]
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
    return this.https.post('/v1/tx/approval/transfer/listPage', param).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  public getInfo(params: { accountCbdcId: any }): Observable<any> {
    return this.http.post(`/v1/tx/approval/order/detail`, params);
  }

  public getTransferInfo(params: { transferId: any }): Observable<any> {
    return this.http.post(`/v1/tx/approval/transfer/detail`, params);
  }
}
