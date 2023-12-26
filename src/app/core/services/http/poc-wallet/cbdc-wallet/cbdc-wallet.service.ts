import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { BaseHttpService } from '../../base-http.service';
import { timeToTimestamp } from '@app/utils/tools';
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
export class CbdcWalletService {

  constructor(public http: BaseHttpService, private https: HttpClient, private date: DatePipe) { }

  public getList(
    pageIndex: number,
    pageSize: number,
    filters: any
  ): Observable<any> {
    const param: any = {
      data: {
        centralBankId: filters.centralBankId || '',
        chainAccountAddress: filters.chainAccountAddress || '',
        createTimeBegin: filters.createTime[0]
          ? timeToTimestamp(
            this.date.transform(filters.createTime[0], 'yyyy-MM-dd') +
            ' 00:00:00'
          )
          : '',
        createTimeEnd: filters.createTime[1]
          ? timeToTimestamp(
            this.date.transform(filters.createTime[1], 'yyyy-MM-dd') +
            ' 23:59:59'
          )
          : '',
        currency: filters.currency || '',
        region: filters.region || '',
        state: filters.state,
      },
      page: {
        pageSize: pageSize,
        pageNum: pageIndex
      }
    };
    return this.https.post('/v1/wallet/listPage', param)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  public getCentralBankQuery(): Observable<any> {
    return this.http.post(`/v1/wallet/centralBank/opened/list`, {});
  }

  public getCentralBankAdd(): Observable<any> {
    return this.http.post(`/v1/wallet/centralBank/list`, {});
  }

  public getBnNode(): Observable<any> {
    return this.http.post(`/v1/commercial/bank/bnCodeSelect`, {});
  }

  public getWalletAddress(params: {centralBankId: any}): Observable<any> {
    return this.http.post(`/v1/wallet/address/list`, params);
  }

  public save(params: Sdata): Observable<any> {
    return this.http.post(`/v1/wallet/save`, params);
  }
  
  public topUpOrWithdraw(params: Tdata): Observable<any> {
    return this.http.post(`/v1/wallet/applyCbdcTx`, params);
  }

  public getBasicInfo(params: {bankAccountId: any}): Observable<any> {
    return this.http.post(`/v1/wallet/detail/basic`, params);
  }

  public getTransactionSummary(params: {bankAccountId: any}): Observable<any> {
    return this.http.post(`/v1/wallet/detail/transaction/summary`, params);
  }

}
