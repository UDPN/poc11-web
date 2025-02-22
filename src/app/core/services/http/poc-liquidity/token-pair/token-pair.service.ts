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
          return response.data;
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

  public getTokenPairDetail(): Observable<any> {
    return new Observable((observer) => {
      setTimeout(() => {
        observer.next({
          code: 0,
          data: {
            tokenPair: 'tEUR/tSAR',
            fxType: 'Local FX',
            status: 1, // 1: Active, 0: Processing, 2: Inactive
            fxRate: '1 tEUR = 3.89 tSAR',
            fxRateUpdatedOn: new Date('2024-03-10T10:23:12+08:00').getTime(),
            createdBy: 'Admin',
            createdOn: new Date('2024-07-07T10:14:41+08:00').getTime()
          }
        });
        observer.complete();
      }, 500);
    });
  }

  public getFxRateHistory(params: { startDate?: Date; endDate?: Date }): Observable<any> {
    return new Observable((observer) => {
      setTimeout(() => {
        observer.next({
          code: 0,
          data: {
            rows: [
              {
                tokenPair: '1 tEUR/tSAR',
                fxRate: '3.89',
                date: new Date('2024-03-09T09:12:41+08:00').getTime()
              },
              {
                tokenPair: '1 tEUR/tSAR',
                fxRate: '3.89',
                date: new Date('2024-03-09T09:10:41+08:00').getTime()
              },
              {
                tokenPair: '1 tEUR/tSAR',
                fxRate: '3.89',
                date: new Date('2024-03-09T09:08:41+08:00').getTime()
              },
              {
                tokenPair: '1 tEUR/tSAR',
                fxRate: '3.89',
                date: new Date('2024-03-09T09:06:41+08:00').getTime()
              }
            ],
            page: {
              total: 4
            }
          }
        });
        observer.complete();
      }, 500);
    });
  }

  public getOperationRecords(params: { operationType?: string }): Observable<any> {
    // Mock data
    const mockData = {
      code: 0,
      data: {
        rows: [
          {
            operationType: 'Activate',
            createdBy: 'yunying',
            createdOn: new Date('2024-05-15 12:14:41').getTime(),
            comments: 'Activate token pairs.',
            status: 'Success'
          },
          {
            operationType: 'Deactivate',
            createdBy: 'yunying',
            createdOn: new Date('2024-05-10 13:14:41').getTime(),
            comments: 'Deactivate token pairs.',
            status: 'Success'
          },
          {
            operationType: 'Add',
            createdBy: 'yunying',
            createdOn: new Date('2024-05-10 12:30:41').getTime(),
            comments: 'N/A',
            status: 'Success'
          }
        ],
        page: {
          total: 3
        }
      },
      message: 'Success'
    };

    // Filter by operation type if provided
    if (params.operationType) {
      mockData.data.rows = mockData.data.rows.filter(
        record => record.operationType === params.operationType
      );
      mockData.data.page.total = mockData.data.rows.length;
    }

    return of(mockData).pipe(delay(500));
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
}
