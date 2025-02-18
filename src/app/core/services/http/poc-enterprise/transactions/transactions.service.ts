/*
 * @Author: chenyuting
 * @Date: 2024-12-11 17:35:16
 * @LastEditors: chenyuting
 * @LastEditTime: 2025-02-10 15:20:22
 * @Description:
 */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { BaseHttpService } from '../../base-http.service';
import { timeToTimestampMillisecond } from '@app/utils/tools';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {
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
          : '',
        currency: filters.currency || '',
        enterpriseCode: filters.enterpriseCode || '',
        status: filters.status || '',
        transactionType: filters.transactionType || '',
        txHash: filters.txHash || '',
        walletAddress: filters.walletAddress || ''
      },
      page: {
        pageSize: pageSize,
        pageNum: pageIndex
      }
    };
    return this.https.post('/v2/tx/order/listPage', param).pipe(
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
        txHash: filters.txHash || '',
        toAccountAddress: filters.toAccountAddress || '',
        type: filters.type || '',
        appliedOnBegin: filters.createTime[0]
          ? timeToTimestampMillisecond(
              this.date.transform(filters.createTime[0], 'yyyy-MM-dd') +
                ' 00:00:00'
            )
          : '',
        appliedOnEnd: filters.createTime[1]
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
    return this.https.post('/v2/tx/transfer/listPage', param).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
}
