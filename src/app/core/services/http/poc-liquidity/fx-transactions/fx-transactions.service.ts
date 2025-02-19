/*
 * @Author: chenyuting
 * @Date: 2025-02-17 16:02:59
 * @LastEditors: chenyuting
 * @LastEditTime: 2025-02-19 15:18:18
 * @Description:
 */
import { Injectable } from '@angular/core';
import { BaseHttpService } from '../../base-http.service';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { Observable, map } from 'rxjs';
import { timeToTimestampMillisecond } from '@app/utils/tools';

@Injectable({
  providedIn: 'root'
})
export class LiquidityFxTransactionsService {
  constructor(
    public http: BaseHttpService,
    private https: HttpClient,
    private date: DatePipe
  ) {}

  public getList(
    pageIndex: number,
    pageSize: number,
    filters: any
  ): Observable<any> {
    const param: any = {
      data: {
        fromCapitalAddress: filters.fromCapitalAddress || '',
        fromCurrency: filters.fromCurrency || '',
        fromWalletAddress: filters.fromWalletAddress || '',
        fxType: filters.fxType || '',
        status: filters.status || '',
        toCapitalAddress: filters.toCapitalAddress || '',
        toCurrency: filters.toCurrency || '',
        toWalletAddress: filters.toWalletAddress || '',
        transactionNo: filters.transactionNo || '',
        txEndTime: filters.txTime[1]
          ? timeToTimestampMillisecond(
              this.date.transform(filters.txTime[1], 'yyyy-MM-dd') + ' 23:59:59'
            )
          : '',
        txStartTime: filters.txTime[0]
          ? timeToTimestampMillisecond(
              this.date.transform(filters.txTime[0], 'yyyy-MM-dd') + ' 00:00:00'
            )
          : ''
      },
      page: {
        pageSize: pageSize,
        pageNum: pageIndex
      }
    };
    return this.https.post('/v2/liquidity/fx/tx/listPage', param).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  public getInfo(params: { transferId: any }): Observable<any> {
    return this.http.post(`/v2/liquidity/fx/tx/transaction/details`, params);
  }

  public getTokenPair(): Observable<any> {
    return this.http.post(`/v2/liquidity/fx/tx/tokenPair/list`, {});
  }
}
