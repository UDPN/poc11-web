import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of, delay } from 'rxjs';
import { timeToTimestampMillisecond } from '@app/utils/tools';
import { DatePipe } from '@angular/common';
import { BaseHttpService } from '../../base-http.service';

@Injectable({
  providedIn: 'root'
})
export class JournalService {
  constructor(
    public http: BaseHttpService,
    private https: HttpClient,
    private date: DatePipe
  ) {}

  public getBlockchainList(): Observable<any> {
    return this.https.get('/v1/common/blockchain/list');
  }

  public getTokenList(): Observable<any> {
    return this.https.get('/v1/common/token/list');
  }

  public fetchList(
    pageIndex: number,
    pageSize: number,
    filters: any
  ): Observable<any> {
    const param = {
      data: {
        blockchainCode: '',
        blockchainId: '',
        blockchainName: filters.blockchain || '',
        createEndTime: filters.createdOn?.[1]
          ? timeToTimestampMillisecond(
              this.date.transform(filters.createdOn[1], 'yyyy-MM-dd') +
                ' 23:59:59'
            )
          : '',
        createStartTime: filters.createdOn?.[0]
          ? timeToTimestampMillisecond(
              this.date.transform(filters.createdOn[0], 'yyyy-MM-dd') +
                ' 00:00:00'
            )
          : '',
        currencySymbol: filters.peggedCurrency || '',
        ledgerName: filters.ledgerName || '',
        stablecoinId: filters.tokenName || '',
        state: filters.status || ''
      },
      page: {
        pageNum: pageIndex,
        pageSize: pageSize
      }
    };

    return this.https.post('/v1/financial/bill/rule/listPage', param);
  }

  public updateStatus(params: { ruleId: string, state: number }): Observable<any> {
    return this.https.post('/v1/financial/bill/operate', params);
  }

  public fetchTxList(
    pageIndex: number,
    pageSize: number,
    filters: any
  ): Observable<any> {
    const param: any = {
      data: {
        ruleId: filters.ruleId || '',
        traceId: filters.traceId || '',
        txType: filters.txType || '',
        startTime: filters.dateTime?.[0]
          ? timeToTimestampMillisecond(
              this.date.transform(filters.dateTime[0], 'yyyy-MM-dd') +
                ' 00:00:00'
            )
          : '',
        endTime: filters.dateTime?.[1]
          ? timeToTimestampMillisecond(
              this.date.transform(filters.dateTime[1], 'yyyy-MM-dd') +
                ' 23:59:59'
            )
          : ''
      },
      page: {
        pageSize: pageSize,
        pageNum: pageIndex
      }
    };

    // 实际接口调用（当前注释掉）

    return this.https.post('/v1/financial/bill/tx/listPage', param).pipe(
      map((response: any) => {
        return response;
      })
    );


    // 模拟数据（用于开发测试）
    const mockData = {
      code: 0,
      data: {
        page: {
          isFirstPage: true,
          isLastPage: true,
          pageNum: pageIndex,
          pageSize: pageSize,
          pages: 1,
          total: 5
        },
        rows: [
          {
            currencyName: "THB",
            dateTime: 1734339764017,
            groupNumber: 1,
            loanType: 1,
            particularsAccount: "Transfer",
            ruleId: filters.ruleId,
            stablecoinId: 1,
            stablecoinName: "w-THB-UDPN",
            subjectCode: "1001",
            subjectTitle: "Cash Account",
            traceId: "TX001",
            txAmount: 1000,
            txHash: "0x123...abc1",
            txType: 3
          },
          {
            currencyName: "THB",
            dateTime: 1734339764018,
            groupNumber: 1,
            loanType: 2,
            particularsAccount: "Transfer",
            ruleId: filters.ruleId,
            stablecoinId: 1,
            stablecoinName: "w-THB-UDPN",
            subjectCode: "2001",
            subjectTitle: "Savings Account",
            traceId: "TX002",
            txAmount: 1000,
            txHash: "0x123...abc2",
            txType: 3
          },
          {
            currencyName: "THB",
            dateTime: 1734339764019,
            groupNumber: 2,
            loanType: 1,
            particularsAccount: "Top-up",
            ruleId: filters.ruleId,
            stablecoinId: 1,
            stablecoinName: "w-THB-UDPN",
            subjectCode: "1002",
            subjectTitle: "Deposit Account",
            traceId: "TX003",
            txAmount: 500,
            txHash: "0x123...abc3",
            txType: 1
          },
          {
            currencyName: "THB",
            dateTime: 1734339764020,
            groupNumber: 3,
            loanType: 2,
            particularsAccount: "Withdraw",
            ruleId: filters.ruleId,
            stablecoinId: 1,
            stablecoinName: "w-THB-UDPN",
            subjectCode: "3001",
            subjectTitle: "Withdrawal Account",
            traceId: "TX004",
            txAmount: 300,
            txHash: "0x123...abc4",
            txType: 2
          },
          {
            currencyName: "THB",
            dateTime: 1734339764021,
            groupNumber: 4,
            loanType: 1,
            particularsAccount: "FX Purchase",
            ruleId: filters.ruleId,
            stablecoinId: 1,
            stablecoinName: "w-THB-UDPN",
            subjectCode: "4001",
            subjectTitle: "FX Account",
            traceId: "TX005",
            txAmount: 2000,
            txHash: "0x123...abc5",
            txType: 4
          }
        ]
      },
      message: ""
    };

    // 返回模拟数据（开发完成后替换为上面的实际接口调用）
    return of(mockData).pipe(delay(500));
  }
}
