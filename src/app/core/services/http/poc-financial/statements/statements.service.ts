/*
 * @Author: chenyuting
 * @Date: 2024-12-11 17:35:16
 * @LastEditors: chenyuting
 * @LastEditTime: 2024-12-27 09:57:54
 * @Description:
 */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { timeToTimestamp, timeToTimestampMillisecond } from '@app/utils/tools';
import { DatePipe } from '@angular/common';
import { BaseHttpService } from '../../base-http.service';

export interface Adata {
  exportStrategy: string;
  taskName: string;
  tokenId: string | number;
  txTypes: Array<any>;
}

export interface Sdata {
  exportRuleId: string | number;
  state: number;
}

export interface Cdata {
  exportType: string | number;
  moduleType: string | number;
  transactionRecordsListReqVO?: any;
  billTxListReqVO?: any;
}

@Injectable({
  providedIn: 'root'
})
export class StatementsService {
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
    const param: any = {
      data: {
        exportStrategy: filters.exportStrategy || '',
        status: filters.status || '',
        taskName: filters.taskName || '',
        tokenId: filters.tokenId || '',
        createStartTime: filters.createTime[0]
          ? timeToTimestampMillisecond(
              this.date.transform(filters.createTime[0], 'yyyy-MM-dd') +
                ' 00:00:00'
            )
          : '',
        createEndTime: filters.createTime[1]
          ? timeToTimestampMillisecond(
              this.date.transform(filters.createTime[1], 'yyyy-MM-dd') +
                ' 23:59:59'
            )
          : '',
        lastExecutedStartTime: filters.lastExecutedTime[0]
          ? timeToTimestampMillisecond(
              this.date.transform(filters.lastExecutedTime[0], 'yyyy-MM-dd') +
                ' 00:00:00'
            )
          : '',
        lastExecutedEndTime: filters.lastExecutedTime[1]
          ? timeToTimestampMillisecond(
              this.date.transform(filters.lastExecutedTime[1], 'yyyy-MM-dd') +
                ' 23:59:59'
            )
          : ''
      },
      page: {
        pageSize: pageSize,
        pageNum: pageIndex
      }
    };

    return this.https.post('/v1/export/task/list/rule', param).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  public createTask(params: Adata): Observable<any> {
    return this.http.post(`/v1/export/task/create/rule`, params);
  }

  public statusUpdate(params: Sdata): Observable<any> {
    return this.http.post(`/v1/export/task/rule/operate`, params);
  }

  public taskDetail(params: { exportRuleId: number }): Observable<any> {
    return this.http.post(`/v1/export/task/rule/detail`, params);
  }

  public taskDelete(params: { exportTaskId: number }): Observable<any> {
    return this.http.post(`/v1/export/task/delete`, params);
  }

  public createExport(params: Cdata): Observable<any> {
    return this.http.post(`/v1/export/task/create`, params);
  }
  public taskDetailRecordsList(
    pageIndex: number,
    pageSize: number,
    filters: any
  ): Observable<any> {
    const param: any = {
      data: {
        exportRuleId: filters.exportRuleId || '',
        exportState: filters.exportState || '',
        fileId: filters.fileId || '',
        moduleType: filters.moduleType || '',
        createStartTime: filters.createTime[0]
          ? timeToTimestampMillisecond(
              this.date.transform(filters.createTime[0], 'yyyy-MM-dd') +
                ' 00:00:00'
            )
          : '',
        createEndTime: filters.createTime[1]
          ? timeToTimestampMillisecond(
              this.date.transform(filters.createTime[1], 'yyyy-MM-dd') +
                ' 23:59:59'
            )
          : '',
        txStartTime: filters.txnTime[0]
          ? timeToTimestampMillisecond(
              this.date.transform(filters.txnTime[0], 'yyyy-MM-dd')
            )
          : '',
        txEndTime: filters.txnTime[1]
          ? timeToTimestampMillisecond(
              this.date.transform(filters.txnTime[1], 'yyyy-MM-dd')
            )
          : ''
      },
      page: {
        pageSize: pageSize,
        pageNum: pageIndex
      }
    };

    return this.https.post('/v1/export/task/list/all', param).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  public taskExportRecordsList(
    pageIndex: number,
    pageSize: number,
    filters: any
  ): Observable<any> {
    const param: any = {
      data: {
        exportState: filters.exportState || '',
        blockchainId: filters.blockchainId || '',
        fileId: filters.fileId || '',
        moduleType: filters.moduleType || 5,
        tokenId: filters.tokenId || '',
        createStartTime: filters.createTime[0]
          ? timeToTimestampMillisecond(
              this.date.transform(filters.createTime[0], 'yyyy-MM-dd') +
                ' 00:00:00'
            )
          : '',
        createEndTime: filters.createTime[1]
          ? timeToTimestampMillisecond(
              this.date.transform(filters.createTime[1], 'yyyy-MM-dd') +
                ' 23:59:59'
            )
          : '',
        txStartTime: filters.txnTime[0]
          ? timeToTimestampMillisecond(
              this.date.transform(filters.txnTime[0], 'yyyy-MM-dd')
            )
          : '',
        txEndTime: filters.txnTime[1]
          ? timeToTimestampMillisecond(
              this.date.transform(filters.txnTime[1], 'yyyy-MM-dd')
            )
          : ''
      },
      page: {
        pageSize: pageSize,
        pageNum: pageIndex
      }
    };

    return this.https.post('/v1/export/task/list/my', param).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
}
