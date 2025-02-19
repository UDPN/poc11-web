/*
 * @Author: chenyuting
 * @Date: 2024-12-11 17:35:16
 * @LastEditors: chenyuting
 * @LastEditTime: 2025-01-20 17:32:56
 * @Description:
 */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { BaseHttpService } from '../../base-http.service';
import { Observable } from 'rxjs';
import { timeToTimestampMillisecond } from '@app/utils/tools';

interface EnterpriseSubmitData {
  contactEmail: string;
  contactName: string;
  description: string;
  enterpriseFlatAccount: string;
  enterpriseFlatBank: string;
  enterpriseName: string;
  txApprovalThreshold: number;
  walletApproval: number;
  enterpriseCode: string;
}

interface EnterpriseEditData extends EnterpriseSubmitData {
  enterpriseId: number;
}

interface EnterpriseDetailParams {
  enterpriseId: number;
  status: number;
}

interface TokenListItem {
  apiUrl: string;
  bankIdentifierCode: string;
  bankName: string;
  bankType: number;
  centralBankId: number;
  contractBankCode: string;
  digitalCurrencyName: string;
  digitalSymbol: string;
  legalCurrencyName: string;
  legalCurrencySymbol: string;
  token: string;
}

interface TokenInfo {
  tokenName: string;
}

interface EnterpriseDetailInfo {
  accessKey: string;
  approvalTime: number;
  approvalUser: string;
  contactEmail: string;
  contactName: string;
  createTime: number;
  createUser: string;
  dataPrivateKey: string;
  dataPublicKey: string;
  enterpriseCode: string;
  enterpriseName: string;
  remarks: string;
  signPrivateKey: string;
  signPublicKey: string;
  status: number;
  tokenList: TokenInfo[];
}

interface EnterpriseStateParams {
  enterpriseId: number;
  status: number;
}

interface WalletListParams {
  data: {
    enterpriseId: number;
  };
  page: {
    pageNum: number;
    pageSize: number;
  };
}

interface WalletItem {
  chainAccountAddress: string;
  createTime: number;
  status: number;
  tokenName: string;
  totalBalance: number;
}

interface OperationRecordsParams {
  data: {
    enterpriseId: number;
    operationType: number;
  };
  page: {
    pageNum: number;
    pageSize: number;
  };
}

interface OperationRecord {
  createTime: number;
  createUser: string;
  operationType: number;
  status: number;
}

@Injectable({
  providedIn: 'root'
})
export class EnterpriseOnboardingService {
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
    const param = {
      data: {
        contactEmail: filters.contactEmail || '',
        contactName: filters.contactName || '',
        createEndTime: filters.createdOn?.[1]
          ? timeToTimestampMillisecond(
              this.date.transform(filters.createdOn[1], 'yyyy-MM-dd') +
                ' 23:59:59'
            )
          : 0,
        createStartTime: filters.createdOn?.[0]
          ? timeToTimestampMillisecond(
              this.date.transform(filters.createdOn[0], 'yyyy-MM-dd') +
                ' 00:00:00'
            )
          : 0,
        enterpriseCode: filters.enterpriseCode || '',
        enterpriseName: filters.enterpriseName || '',
        status: filters.status || 0
      },
      page: {
        pageNum: pageIndex,
        pageSize: pageSize
      }
    };

    return this.https.post('/v2/enterprise/listPage', param);
  }

  public saveEnterprise(data: EnterpriseSubmitData): Observable<any> {
    return this.https.post('/v2/enterprise/save', data);
  }

  public getEnterpriseCode(): Observable<any> {
    return this.https.post('/v2/enterprise/getEnterpriseCode', {});
  }

  public getEnterpriseDetail(params: EnterpriseDetailParams): Observable<any> {
    return this.https.post('/v2/enterprise/detail/basicInfo', params);
  }

  public editEnterprise(data: EnterpriseEditData): Observable<any> {
    return this.https.post('/v2/enterprise/edit', data);
  }


  public userWalletList(data: EnterpriseEditData): Observable<any> {
    return this.https.post('/v2/enterprise/detail/userWalletList', data);
  }

  public getTokenList(): Observable<any> {
    return this.https.post('/v2/enterprise/tokenList', {});
  }

  public updateEnterpriseState(params: EnterpriseStateParams): Observable<any> {
    return this.https.post('/v2/enterprise/updateState', params);
  }

  public getUserWalletList(params: WalletListParams): Observable<any> {
    return this.https.post('/v2/enterprise/detail/userWalletList', params);
  }

  public getOperationRecords(params: OperationRecordsParams): Observable<any> {
    return this.https.post('/v2/enterprise/detail/operationRecords', params);
  }
  public setAudit(params: any): Observable<any> {
    return this.https.post('/v2/enterprise/audit', params);
  }

  public downloadSecretKey(enterpriseId: number): Observable<any> {
    return this.https.post('/v2/enterprise/downloadSpSecretKey', 
      { enterpriseId }, 
      { responseType: 'blob' }
    );
  }
}
