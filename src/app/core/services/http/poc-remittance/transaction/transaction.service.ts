/*
 * @Author: chenyuting
 * @Date: 2024-12-09 15:40:45
 * @LastEditors: chenyuting
 * @LastEditTime: 2024-12-23 13:54:08
 * @Description: 
 */
/*
 * @Author: zhangxuefeng
 * @Date: 2023-12-26 16:43:23
 * @LastEditors: chenyuting
 * @LastEditTime: 2024-12-11 17:52:34
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
export class TransactionRecordService {
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
        startCreateTime: filters.creationTime[0]
          ? timeToTimestampMillisecond(
              this.date.transform(filters.creationTime[0], 'yyyy-MM-dd') +
                ' 00:00:00'
            )
          : '',
        endCreateTime: filters.creationTime[1]
          ? timeToTimestampMillisecond(
              this.date.transform(filters.creationTime[1], 'yyyy-MM-dd') +
                ' 23:59:59'
            )
          : '',
        fromAccountAddress: filters.fromAccountAddress || '',
        serialNumber: filters.serialNumber || '',
        state: filters.state,
        type: filters.type,
        toAccountAddress: filters.toAccountAddress || ''
      },
      page: {
        pageSize: pageSize,
        pageNum: pageIndex
      }
    };
    return this.https
      .post('/v1/remittanceManagement/transaction/listPage', param)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  public getInfo(param: { transferId: any }): Observable<any> {
    return this.http.post(`/v1/remittanceManagement/transaction/details`, param);
  }
}
