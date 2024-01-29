/*
 * @Author: zhangxuefeng
 * @Date: 2024-01-11 14:58:13
 * @LastEditors: zhangxuefeng
 * @LastEditTime: 2024-01-24 14:28:41
 * @Description:
 */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { BaseHttpService } from '../../base-http.service';
import { timeToTimestamp, timeToTimestampMillisecond } from '@app/utils/tools';
import { DatePipe } from '@angular/common';

export interface Sdata {
  bnCode: string;
  centralBankId: any;
  creationMethod: any;
  walletAddress?: string;
}

export interface Tdata {
  amount: number;
  password: string;
  txType: any; //  1: Top Up 2: Withdraw
  walletAddress?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CbdcTransactionService {
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
        centralBankId: filters.centralBankId || '',
        bankAccountId: filters.bankAccountId || '',
        creationTimeStart: filters.createTime[0]
          ? timeToTimestampMillisecond(
              this.date.transform(filters.createTime[0], 'yyyy-MM-dd') +
                ' 00:00:00'
            )
          : '',
        creationTimeEnd: filters.createTime[1]
          ? timeToTimestampMillisecond(
              this.date.transform(filters.createTime[1], 'yyyy-MM-dd') +
                ' 23:59:59'
            )
          : '',
        transactionNo: filters.transactionNo || '',
        type: filters.type,
        from: filters.from || '',
        to: filters.to || '',
        status: filters.status
      },
      page: {
        pageSize: pageSize,
        pageNum: pageIndex
      }
    };
    return this.https.post('/v1/CBDCTransaction/listPage', param).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  public getInfo(param: { transferId: any }): Observable<any> {
    return this.http.post(`/v1/CBDCTransaction/details`, param);
  }
}
