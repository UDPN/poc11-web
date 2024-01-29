import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { BaseHttpService } from '../../base-http.service';
import { timeToTimestamp, timeToTimestampMillisecond } from '@app/utils/tools';
import { DatePipe } from '@angular/common';
import { head } from 'lodash';

export interface Sdata {
  bankWalletAddReqVO: {
    bnCode: any;
    centralBankId: any;
    creationMethod: any;
    walletAddress?: any;
    keyStorePassword?: any;
    verifyKeyStorePassword?: any;
  };
  file?: any;
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
        chainAccountAddress: filters.chainAccountAddress || '',
        createTimeBegin: filters.createTime[0]
          ? timeToTimestampMillisecond(
              this.date.transform(filters.createTime[0], 'yyyy-MM-dd') +
                ' 00:00:00'
            )
          : '',
        createTimeEnd: filters.createTime[1]
          ? timeToTimestampMillisecond(
              this.date.transform(filters.createTime[1], 'yyyy-MM-dd') +
                ' 23:59:59'
            )
          : '',
        currency: filters.currency || '',
        region: filters.region || '',
        state: filters.state
      },
      page: {
        pageSize: pageSize,
        pageNum: pageIndex
      }
    };
    return this.https.post('/v1/wallet/listPage', param).pipe(
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

  public getWalletAddress(params: { centralBankId: any }): Observable<any> {
    return this.http.post(`/v1/wallet/address/list`, params);
  }

  public save(params: Sdata): Observable<any> {
    let file: File = params.file;
    let formData: FormData = new FormData();
    formData.append(
      'bankWalletAddReqVO',
      new Blob([JSON.stringify(params.bankWalletAddReqVO)], {
        type: 'application/json'
      })
    );
    if (params.file) {
      formData.append('file', file, file.name);
    }
    return this.http.post(`/v1/wallet/save`, formData);
  }

  public topUpOrWithdraw(params: Tdata): Observable<any> {
    return this.http.post(`/v1/wallet/applyCbdcTx`, params);
  }

  public getBasicInfo(params: { bankAccountId: any }): Observable<any> {
    return this.http.post(`/v1/wallet/detail/basic`, params);
  }

  public getTransactionSummary(params: {
    bankAccountId: any;
  }): Observable<any> {
    return this.http.post(`/v1/wallet/detail/transaction/summary`, params);
  }

  public getTransactionList(
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
      .post('/v1/wallet/detail/transaction/listPage', param)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  public getRecordList(
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
    return this.https.post('/v1/wallet/detail/operation/listPage', param).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  public getSign(param: { account: string }): Observable<any> {
    return this.http.post(`/v1/remittanceManagement/signTest`, param);
  }
}
