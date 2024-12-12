/*
 * @Author: chenyuting
 * @Date: 2024-12-11 17:35:16
 * @LastEditors: chenyuting
 * @LastEditTime: 2024-12-12 10:07:08
 * @Description:
 */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { BaseHttpService } from '../base-http.service';
import { timeToTimestamp } from '@app/utils/tools';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class PocDownloadCenterService {
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
        blockchainCode: filters.blockchainCode || '',
        blockchainId: filters.blockchainId || '',
        blockchainName: filters.blockchainName || '',
        exportRuleId: filters.exportRuleId || '',
        createStartTime: filters.createTime[0]
          ? timeToTimestamp(
              this.date.transform(filters.createTime[0], 'yyyy-MM-dd') +
                ' 00:00:00'
            )
          : '',
        createEndTime: filters.createTime[1]
          ? timeToTimestamp(
              this.date.transform(filters.createTime[1], 'yyyy-MM-dd') +
                ' 23:59:59'
            )
          : '',
        exportState: filters.exportState || '',
        fileId: filters.fileId || '',
        moduleType: filters.moduleType || '',
        tokenId: filters.tokenId || '',
        txEndTime: filters.txTime[1]
          ? timeToTimestamp(
              this.date.transform(filters.txTime[1], 'yyyy-MM-dd') + ' 23:59:59'
            )
          : '',
        txStartTime: filters.txTime[0]
          ? timeToTimestamp(
              this.date.transform(filters.txTime[0], 'yyyy-MM-dd') + ' 00:00:00'
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
