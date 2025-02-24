import { Injectable } from '@angular/core';
import { BaseHttpService } from '../../base-http.service';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { Observable, of } from 'rxjs';
import { timeToTimestampMillisecond } from '@app/utils/tools';
import { delay, map } from 'rxjs/operators';

interface SearchParams {
  tokenPair: string;
  status: number;
  updatedTime: any[];
}

export interface TokenPairDetail {
  tokenPair: string;
  fxType: string;
  status: number;
  fxRate: string;
  fxRateUpdatedOn: number;
  createdBy: string;
  createdOn: number;
}

export interface FxRateHistory {
  tokenPair: string;
  fxRate: string;
  date: number;
}

export interface OperationRecord {
  operationType: string;
  createdBy: string;
  createdOn: number;
  comments: string;
  status: string;
}

interface TokenPairListResponse {
  code: number;
  data: Array<{
    fromCurrency: string;
    toCurrency: string;
  }>;
  message: string;
}

interface SaveTokenPairRequest {
  fromCurrency: string;
  toCurrency: string;
}

interface SaveTokenPairResponse {
  code: number;
  data: Record<string, never>;
  message: string;
}

interface NetworkTokenPairItem {
  exchangeRate: number;
  fromCurrency: string;
  toCurrency: string;
  updateTime: number;
}

interface NetworkTokenPairResponse {
  code: number;
  data: NetworkTokenPairItem[];
  message: string;
}

interface NetworkTokenPairSaveRequest {
  fromCurrency: string;
  toCurrency: string;
}

interface NetworkTokenPairSaveResponse {
  code: number;
  data: Record<string, never>;
  message: string;
}

interface TokenPairDetailRequest {
  rateId: number;
}

export interface TokenPairDetailResponse {
  code: number;
  data: {
    createTime: number;
    createUser: string;
    exchangeRate: number;
    fromCurrency: string;
    rateId: number;
    state: number;
    toCurrency: string;
    updateTime: number;
  };
  message: string;
}

interface FxRateHistoryRequest {
  data: {
    endTime: number;
    rateId: number;
    startTime: number;
  };
  page: {
    pageNum: number;
    pageSize: number;
  };
}

interface FxRateHistoryResponse {
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
      createTime: number;
      exchangeRate: number;
      fromCurrency: string;
      rateId: number;
      rateRecordId: number;
      toCurrency: string;
    }>;
  };
  message: string;
}

interface OperationRecordsRequest {
  data: {
    operationType: number | string;
    rateId: number;
  };
  page: {
    pageNum: number;
    pageSize: number;
  };
}

interface OperationRecordsResponse {
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
      createTime: number;
      createUser: string;
      exchangeRate: number;
      fromCurrency: string;
      operationType: number;
      rateId: number;
      rateRecordId: number;
      remarks: string;
      state: number;
      toCurrency: string;
      txHash: string;
      txTime: number;
    }>;
  };
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class TokenPairService {
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
        startTime: filters.updatedTime?.[0]
          ? timeToTimestampMillisecond(
              this.date.transform(filters.updatedTime[0], 'yyyy-MM-dd') +
                ' 00:00:00'
            )
          : '',
        endTime: filters.updatedTime?.[1]
          ? timeToTimestampMillisecond(
              this.date.transform(filters.updatedTime[1], 'yyyy-MM-dd') +
                ' 23:59:59'
            )
          : '',
        rateId: '',
        state: filters.status || ''
      },
      page: {
        pageNum: pageIndex,
        pageSize: pageSize
      }
    };

    return this.https.post<any>('/v2/liquidity/rate/local/listPage', param);
  }

  public fetchNetworkList(
    pageIndex: number,
    pageSize: number,
    filters: any
  ): Observable<any> {
    const param = {
      data: {
        startTime: filters.updatedTime?.[0]
          ? timeToTimestampMillisecond(
              this.date.transform(filters.updatedTime[0], 'yyyy-MM-dd') +
                ' 00:00:00'
            )
          : '',
        endTime: filters.updatedTime?.[1]
          ? timeToTimestampMillisecond(
              this.date.transform(filters.updatedTime[1], 'yyyy-MM-dd') +
                ' 23:59:59'
            )
          : '',
        rateId: '',
      },
      page: {
        pageNum: pageIndex,
        pageSize: pageSize
      }
    };

    return this.https.post<any>('/v2/liquidity/rate/network/listPage', param).pipe(
      map(response => {
        if (response.code === 0) {
          return response;
        }
        throw new Error(response.message);
      })
    );
  }

  public getTokenPairList(): Observable<any> {
    return new Observable((observer) => {
      setTimeout(() => {
        observer.next({
          code: 0,
          data: [
            { key: 'tEUR/tUSD', value: 'tEUR/tUSD' },
            { key: 'tEUR/tSAR', value: 'tEUR/tSAR' },
            { key: 'tEUR/tAED', value: 'tEUR/tAED' },
            { key: 'tUSD/tEUR', value: 'tUSD/tEUR' }
          ]
        });
        observer.complete();
      }, 100);
    });
  }

  public getTokenPairDetail(rateId: number): Observable<TokenPairDetailResponse> {
    const params: TokenPairDetailRequest = { rateId };
    const selectedTab = localStorage.getItem('tokenPairTab');
    const apiUrl = selectedTab === 'local' 
      ? '/v2/liquidity/rate/local/detail/basic'
      : '/v2/liquidity/rate/network/detail/basic';
    return this.https.post<TokenPairDetailResponse>(apiUrl, params);
  }

  public getFxRateHistory(params: { rateId: number; startDate?: Date; endDate?: Date; pageSize?: number; pageIndex?: number }): Observable<FxRateHistoryResponse> {
    const param: FxRateHistoryRequest = {
      data: {
        rateId: params.rateId,
        startTime: params.startDate ? timeToTimestampMillisecond(
          this.date.transform(params.startDate, 'yyyy-MM-dd') + ' 00:00:00'
        ) : 0,
        endTime: params.endDate ? timeToTimestampMillisecond(
          this.date.transform(params.endDate, 'yyyy-MM-dd') + ' 23:59:59'
        ) : 0
      },
      page: {
        pageNum: params.pageIndex || 1,
        pageSize: params.pageSize || 10
      }
    };
    const selectedTab = localStorage.getItem('tokenPairTab');
    const apiUrl = selectedTab === 'local' 
      ? '/v2/liquidity/rate/local/detail/history'
      : '/v2/liquidity/rate/network/detail/history';
    return this.https.post<FxRateHistoryResponse>(apiUrl, param);
  }

  public getOperationRecords(params: {
    data: {
      rateId: number;
      operationType?: number;
    };
    page: {
      pageNum: number;
      pageSize: number;
    };
  }): Observable<OperationRecordsResponse> {
    const requestParams: OperationRecordsRequest = {
      data: {
        rateId: params.data.rateId,
        operationType: params.data.operationType || ""
      },
      page: {
        pageNum: params.page.pageNum,
        pageSize: params.page.pageSize
      }
    };
    const selectedTab = localStorage.getItem('tokenPairTab');
    const apiUrl = selectedTab === 'local' 
      ? '/v2/liquidity/rate/local/detail/records'
      : '/v2/liquidity/rate/network/detail/records';
    return this.https.post<OperationRecordsResponse>(apiUrl, requestParams);
  }

  public saveLocalTokenPair(params: SaveTokenPairRequest): Observable<SaveTokenPairResponse> {
    return this.https.post<SaveTokenPairResponse>('/v2/liquidity/rate/local/save', params);
  }

  public saveLocalTokenPairList(): Observable<TokenPairListResponse> {
    return this.https.post<TokenPairListResponse>('/v2/liquidity/rate/local/save/tokenPair/list', {});
  }

  public getLocalRates(): Observable<{ key: string; value: number }[]> {
    return this.https.post<any>('/v2/liquidity/rate/local/list', {}).pipe(
      map(response => {
        if (response.code === 0) {
          return response.data.map((item: { fromCurrency: string; toCurrency: string; rateId: number }) => ({
            key: `${item.fromCurrency}/${item.toCurrency}`,
            value: item.rateId
          }));
        }
        return [];
      })
    );
  }
  public getNetRates(): Observable<{ key: string; value: number }[]> {
    return this.https.post<any>('/v2/liquidity/rate/network/list', {}).pipe(
      map(response => {
        if (response.code === 0) {
          return response.data.map((item: { fromCurrency: string; toCurrency: string; rateId: number }) => ({
            key: `${item.fromCurrency}/${item.toCurrency}`,
            value: item.rateId
          }));
        }
        return [];
      })
    );
  }

  public getNetworkTokenPairList(): Observable<NetworkTokenPairResponse> {
    return this.https.post<NetworkTokenPairResponse>('/v2/liquidity/rate/network/save/tokenPair/list', {});
  }

  public saveNetworkTokenPair(params: NetworkTokenPairSaveRequest[]): Observable<NetworkTokenPairSaveResponse> {
    return this.https.post<NetworkTokenPairSaveResponse>('/v2/liquidity/rate/network/save', params);
  }
}
