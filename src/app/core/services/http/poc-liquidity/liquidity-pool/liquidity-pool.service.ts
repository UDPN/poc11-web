import { Injectable } from '@angular/core';
import { BaseHttpService } from '../../base-http.service';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { timeToTimestampMillisecond } from '@app/utils/tools';
import { timer } from 'rxjs';
import { map } from 'rxjs/operators';

export interface TokenListItem {
  tokenId: string;
  tokenName: string;
  minBalance: string;
}

interface SearchParams {
  liquidityPoolAddress: string;
  token: string;
  status: string;
  createdTime: any[];
}

interface TransactionSearchParams {
  data: {
    liquidityPoolId: number;
    status: number;
    txEndTime: number;
    txHash: string;
    txStartTime: number;
    txType: number;
    walletAddress: string;
  };
  page: {
    pageNum: number;
    pageSize: number;
  };
}

interface AuthorizationSearchParams {
  operationTime?: Date[];
  transactionHash?: string;
  transactionTime?: Date[];
  status?: number;
  pageIndex?: number;
  pageSize?: number;
}

interface AuthorizationResponse {
  code: number;
  data: {
    page: {
      isFirstPage: boolean;
      isLastPage: boolean;
      pageNum: number;
      pageSize: number;
      pages: number;
      total: number;
    };
    rows: Array<{
      authorizedAmount: number;
      operationTime: number;
      status: number;
      tokenSymbol: string;
      txHash: string;
      txTime: number;
    }>;
  };
  message: string;
}

interface OperationSearchParams {
  operationType?: number;
  pageIndex?: number;
  pageSize?: number;
}

interface OperationResponse {
  code: number;
  data: {
    page: {
      isFirstPage: boolean;
      isLastPage: boolean;
      pageNum: number;
      pageSize: number;
      pages: number;
      total: number;
    };
    rows: Array<{
      createdBy: string;
      createdTime: number;
      operationType: number;
      remarks: string;
      status: number;
      txHash: string;
      txTime: number;
    }>;
  };
  message: string;
}

export interface LiquidityPoolInfo {
  liquidityPoolAddress: string;
  token: string;
  walletBalance: string;
  authorizedAmount: string;
  availableAmount: string;
  minBalanceReq: string;
  status: string;
  createdBy: string;
  createdOn: number;
  transactionHash: string;
  transactionTime: number;
  tokenPairs: string[];
  belowMinimumWallet: boolean;
  belowMinimumAuthorized: boolean;
}

interface RegistrationCheckResponse {
  code: number;
  data: {
    firstRegistration: boolean;
  };
  message: string;
}

export interface TokenWalletResponse {
  code: number;
  data: Array<{
    walletAddress: string;
  }>;
  message: string;
}

export interface RegisterPoolEntry {
  tokenId: string;
  walletAddress: string;
}

export interface RegisterResponse {
  code: number;
  data: any;
  message: string;
}

export interface TokenPairInfo {
  fromToken: string;
  toToken: string;
}

export interface PoolInfoResponse {
  code: number;
  data: {
    authorizedAmount: number;
    createdBy: string;
    createdTime: number;
    liquidityPollAddress: string;
    minBalance: number;
    status: number;
    symbol: string;
    token: string;
    tokenPairInformationList: TokenPairInfo[];
    txHash: string;
    txTime: number;
    walletBalance: number;
  };
  message: string;
}

interface TransactionResponse {
  code: number;
  data: {
    page: {
      isFirstPage: boolean;
      isLastPage: boolean;
      pageNum: number;
      pageSize: number;
      pages: number;
      total: number;
    };
    rows: Array<{
      amount: number;
      fromAddress: string;
      fromTokenSymbol: string;
      fxRate: number;
      status: number;
      toAddress: string;
      toTokenSymbol: string;
      transactionNo: string;
      txHash: string;
      txTime: number;
      txType: number;
    }>;
  };
  message: string;
}

interface ModifyStatusRequest {
  liquidityPoolId: number;
  liquidityPoolStatus: number;
  remarks: string;
}

interface ModifyStatusResponse {
  code: number;
  data: Record<string, never>;
  message: string;
}

interface ReauthorizeRequest {
  authorizedAmount: number | string;
  liquidityPoolId: number;
}

interface ReauthorizeResponse {
  code: number;
  data: Record<string, never>;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class LiquidityPoolService {
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
        liquidityPollAddress: filters.liquidityPoolAddress || '',
        tokenId: filters.token || '',
        status: filters.status ,
        startCreatedTime: filters.createdTime?.[0]
          ? timeToTimestampMillisecond(
              this.date.transform(filters.createdTime[0], 'yyyy-MM-dd') +
                ' 00:00:00'
            )
          : '',
        endCreatedTime: filters.createdTime?.[1]
          ? timeToTimestampMillisecond(
              this.date.transform(filters.createdTime[1], 'yyyy-MM-dd') +
                ' 23:59:59'
            )
          : ''
      },
      page: {
        pageNum: pageIndex,
        pageSize: pageSize
      }
    };

    return this.https.post('/v2/liquidity-poll/list', param);
  }

  public getTokenList(): Observable<any> {
    return this.https.post<{
      code: number;
      data: TokenListItem[];
      message: string;
    }>('/v2/liquidity-poll/token/list', {});
  }
  public getTokenListAll(): Observable<any> {
    return this.https.post<{
      code: number;
      data: TokenListItem[];
      message: string;
    }>('/v2/liquidity-poll/token/list/all', {});
  }

  public getPoolInfo(liquidityPoolId: string): Observable<PoolInfoResponse> {
    return this.https.post<PoolInfoResponse>('/v2/liquidity-poll/basic/information', {
      liquidityPoolId: Number(liquidityPoolId)
    });
  }

  public getTransactionList(params: TransactionSearchParams): Observable<TransactionResponse> {
    return this.https.post<TransactionResponse>('/v2/liquidity-poll/transactions', params);
  }

  public getAuthorizationList(params: AuthorizationSearchParams, liquidityPoolId: string): Observable<AuthorizationResponse> {
    const requestParams = {
      data: {
        liquidityPoolId: Number(liquidityPoolId),
        operationEndTime: params.operationTime?.[1]
        ? timeToTimestampMillisecond(
            this.date.transform(params.operationTime[1], 'yyyy-MM-dd') +
              ' 23:59:59'
          )
        : '',
        operationStartTime: params.operationTime?.[0]
        ? timeToTimestampMillisecond(
            this.date.transform(params.operationTime[0], 'yyyy-MM-dd') +
              ' 00:00:00'
          )
        : '',
        txHash: params.transactionHash || '',

        txEndTime: params.transactionTime?.[1]
        ? timeToTimestampMillisecond(
            this.date.transform(params.transactionTime[1], 'yyyy-MM-dd') +
              ' 23:59:59'
          )
        : '',

        txStartTime: params.transactionTime?.[0]
        ? timeToTimestampMillisecond(
            this.date.transform(params.transactionTime[0], 'yyyy-MM-dd') +
              ' 00:00:00'
          )
        : '',
        txStatus: params.status ? Number(params.status) : ''
      },
      page: {
        pageNum: params.pageIndex || 1,
        pageSize: params.pageSize || 10
      }
    };

    return this.https.post<AuthorizationResponse>('/v2/liquidity-poll/authorization/records', requestParams);
  }

  public getOperationList(params: OperationSearchParams, liquidityPoolId: string): Observable<OperationResponse> {
    const requestParams = {
      data: {
        liquidityPoolId: Number(liquidityPoolId),
        operationType: params.operationType || ""
      },
      page: {
        pageNum: params.pageIndex || 1,
        pageSize: params.pageSize || 10
      }
    };

    return this.https.post<OperationResponse>('/v2/liquidity-poll/operation/records', requestParams);
  }

  public checkRegistration(): Observable<RegistrationCheckResponse> {
    return this.https.post<RegistrationCheckResponse>('/v2/liquidity-poll/registration/check', {});
  }

  public getTokenWallets(tokenId: string): Observable<TokenWalletResponse> {
    return this.https.post<TokenWalletResponse>('/v2/liquidity-poll/token/wallets', {
      tokenId: tokenId
    });
  }

  public register(entries: RegisterPoolEntry[]): Observable<RegisterResponse> {
    return this.https.post<RegisterResponse>('/v2/liquidity-poll/register', entries);
  }
  public modifyStatus(params: ModifyStatusRequest): Observable<ModifyStatusResponse> {
    return this.https.post<ModifyStatusResponse>('/v2/liquidity-poll/status/modification', params);
  }

  public reauthorize(params: ReauthorizeRequest): Observable<ReauthorizeResponse> {
    return this.https.post<ReauthorizeResponse>('/v2/liquidity-poll/reauthorize', params);
  }
  
  public rateCheck(params: {liquidityPoolId:number}): Observable<RegisterResponse> {
    return this.https.post<any>('/v2/liquidity-poll/rate/check', params);
  }
}
