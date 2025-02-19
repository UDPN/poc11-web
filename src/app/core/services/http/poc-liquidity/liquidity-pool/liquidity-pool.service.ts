import { Injectable } from '@angular/core';
import { BaseHttpService } from '../../base-http.service';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { timeToTimestampMillisecond } from '@app/utils/tools';
import { timer } from 'rxjs';
import { map } from 'rxjs/operators';

interface SearchParams {
  liquidityPoolAddress: string;
  token: string;
  status: string;
  createdTime: any[];
}

interface TransactionSearchParams {
  walletAddress?: string;
  transactionType?: string;
  transactionHash?: string;
  status?: string;
  transactionTime?: Date[];
  pageIndex?: number;
  pageSize?: number;
}

interface AuthorizationSearchParams {
  operationType?: string;
  operationTime?: Date[];
  transactionHash?: string;
  transactionTime?: Date[];
  status?: string;
  pageIndex?: number;
  pageSize?: number;
}

interface OperationSearchParams {
  operationType?: string;
  createdBy?: string;
  createdTime?: Date[];
  status?: string;
  pageIndex?: number;
  pageSize?: number;
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
        tokenId: filters.token || 0,
        status: filters.status || 0,
        startCreatedTime: filters.createdTime?.[0]
          ? timeToTimestampMillisecond(
              this.date.transform(filters.createdTime[0], 'yyyy-MM-dd') +
                ' 00:00:00'
            )
          : 0,
        endCreatedTime: filters.createdTime?.[1]
          ? timeToTimestampMillisecond(
              this.date.transform(filters.createdTime[1], 'yyyy-MM-dd') +
                ' 23:59:59'
            )
          : 0
      },
      page: {
        pageNum: pageIndex,
        pageSize: pageSize
      }
    };

    return this.https.post('/v2/liquidity-poll/list', param);
  }

  public getTokenList(): Observable<any> {
    return new Observable((observer) => {
      setTimeout(() => {
        observer.next({
          code: 0,
          data: [
            { key: 'tUSD', value: 'tUSD' },
            { key: 'tEUR', value: 'tEUR' },
            { key: 'tSAR', value: 'tSAR' }
          ]
        });
        observer.complete();
      }, 100);
    });
  }

  public getPoolInfo(id: string): Observable<any> {
    // 模拟数据
    return new Observable((observer) => {
      setTimeout(() => {
        observer.next({
          code: 0,
          data: {
            liquidityPoolAddress: '0x47402d60a038362a3985f0ea4576db1ccc353a76',
            token: 'tEUR',
            walletBalance: '99,000,000.090876 tEUR',
            authorizedAmount: '2,000,000,000.00 tEUR',
            availableAmount: '100,000,000.00 tEUR',
            minBalanceReq: '50,000,000.00 tEUR',
            status: 'Active',
            createdBy: 'Admin',
            createdOn: new Date('2024-03-18T11:14:41+08:00').getTime(),
            transactionHash: '0x9e5854411b30056e03bc60c71fcfbe8356afe5e66acc8d6055359b38ac24db1c',
            transactionTime: new Date('2024-03-20T11:14:50+08:00').getTime(),
            tokenPairs: ['tUSD/tEUR', 'tUSD/tEUR', 'tEUR/tSAR'],
            belowMinimumWallet: true,
            belowMinimumAuthorized: true
          }
        });
        observer.complete();
      }, 500);
    });
  }

  public getTransactionList(params: TransactionSearchParams): Observable<any> {
    // 模拟数据
    return new Observable((observer) => {
      setTimeout(() => {
        observer.next({
          code: 0,
          data: {
            rows: [
              {
                no: 'F91601...4E64',
                from: '0x5acb...a561',
                to: '0x47402d60a038362a3985f0ea4576db1ccc353a76',
                type: 'Transfer',
                amount: '+500.00 tEUR',
                fxRate: 'tEUR/tSAR = 3.86',
                time: new Date('2024-03-10T10:23:12+08:00'),
                hash: '0xy742...b57a',
                status: 'Success'
              },
              {
                no: 'B4ABB6...4668',
                from: '0x9e19...5db6',
                to: '0x47402d60a038362a3985f0ea4576db1ccc353a76',
                type: 'Transfer',
                amount: '+500.00 tEUR',
                fxRate: 'tEUR/tSAR = 3.89',
                time: new Date('2024-03-09T10:23:12+08:00'),
                hash: '0x412...b90a',
                status: 'Success'
              },
              {
                no: 'B4ABB6...4668',
                from: '0x47402d60a038362a3985f0ea4576db1ccc353a76',
                to: '0x6e9f...f268',
                type: 'FX Purchasing',
                amount: '-257.12 tEUR',
                fxRate: 'tSAR/tEUR = 0.26',
                time: null,
                hash: '--',
                status: 'Processing'
              },
              {
                no: 'B4ABB6...4668',
                from: '0x47402d60a038362a3985f0ea4576db1ccc353a76',
                to: '0xd5db...3b07',
                type: 'FX Purchasing',
                amount: '-128.56 tEUR',
                fxRate: 'tSAR/tEUR = 0.26',
                time: new Date('2024-03-07T10:23:12+08:00'),
                hash: '0xa190...5c20',
                status: 'Active'
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

  public getAuthorizationList(params: AuthorizationSearchParams): Observable<any> {
    // 模拟数据
    return new Observable((observer) => {
      setTimeout(() => {
        observer.next({
          code: 0,
          data: {
            rows: [
              {
                operationType: 'Reauthorize',
                changeType: 'Increase',
                tokenName: 'tUSD',
                authorizedAmount: '500.00 tUSD',
                operationTime: new Date('2024-03-10T10:23:12+08:00'),
                transactionTime: null,
                transactionHash: '--',
                status: 'Processing'
              },
              {
                operationType: 'Reauthorize',
                changeType: 'Decrease',
                tokenName: 'tUSD',
                authorizedAmount: '5,000.00 tUSD',
                operationTime: new Date('2024-03-09T10:23:12+08:00'),
                transactionTime: new Date('2024-03-09T10:23:18+08:00'),
                transactionHash: '0x412...b90a',
                status: 'Success'
              },
              {
                operationType: 'Reauthorize',
                changeType: 'Increase',
                tokenName: 'tUSD',
                authorizedAmount: '20,000.00 tUSD',
                operationTime: new Date('2024-03-08T10:23:12+08:00'),
                transactionTime: new Date('2024-03-08T10:23:18+08:00'),
                transactionHash: '0xy742...b57a',
                status: 'Expired'
              },
              {
                operationType: 'Authorize',
                changeType: 'Increase',
                tokenName: 'tUSD',
                authorizedAmount: '10,000.00 tUSD',
                operationTime: new Date('2024-03-07T10:23:12+08:00'),
                transactionTime: new Date('2024-03-07T10:23:18+08:00'),
                transactionHash: '0xa190...5c20',
                status: 'Expired'
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

  public getOperationList(params: OperationSearchParams): Observable<any> {
    // Simulated API response
    return timer(500).pipe(
      map(() => ({
        code: 0,
        data: {
          rows: [
            {
              operationType: 'Activate',
              createdBy: 'yunying',
              createdOn: new Date('2024-07-07T10:14:41+08:00'),
              remarks: 'N/A',
              transactionTime: new Date('2024-07-07T10:14:50+08:00'),
              transactionHash: 'xa6d1...8cb1',
              status: 'Success'
            },
            {
              operationType: 'Deactivate',
              createdBy: 'yunying',
              createdOn: new Date('2024-03-19T11:14:41+08:00'),
              remarks: 'N/A',
              transactionTime: new Date('2024-03-19T11:14:50+08:00'),
              transactionHash: '0x235f...0a03',
              status: 'Success'
            },
            {
              operationType: 'Register',
              createdBy: 'yunying',
              createdOn: new Date('2024-03-18T11:14:41+08:00'),
              remarks: 'N/A',
              transactionTime: new Date('2024-03-18T11:14:50+08:00'),
              transactionHash: '0xe1c5...2804',
              status: 'Success'
            },
            {
              operationType: 'Register',
              createdBy: 'yunying',
              createdOn: new Date('2024-03-17T11:14:41+08:00'),
              remarks: 'Execution failed, reason: Blockchain Execution...',
              transactionTime: null,
              transactionHash: null,
              status: 'Failed'
            },
            {
              operationType: 'Register',
              createdBy: 'yunying',
              createdOn: new Date('2024-03-16T11:14:41+08:00'),
              remarks: 'Approval rejected, reason: Information Error.',
              transactionTime: null,
              transactionHash: null,
              status: 'Rejected'
            }
          ],
          page: {
            total: 5
          }
        }
      }))
    );
  }
}
