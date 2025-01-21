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

    return this.https.post('/v1/enterprise/listPage', param);
  }

  public saveEnterprise(data: EnterpriseSubmitData): Observable<any> {
    return this.https.post('/v1/enterprise/save', data);
  }
}
