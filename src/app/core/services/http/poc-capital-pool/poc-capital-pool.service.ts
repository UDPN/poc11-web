import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BaseHttpService } from '../base-http.service';
import { HttpClient } from '@angular/common/http';
import { timeToTimestamp } from '@app/utils/tools';
import { DatePipe } from '@angular/common';

export interface Pages {
  pageNum: number,
  pageSize: number
}

export interface InPages {
  inPage: Pages
}

export interface Rdata {
  // businessType: any;
  settlementInformations: any;
}

@Injectable({
  providedIn: 'root'
})
export class PocCapitalPoolService {

  constructor(private http: BaseHttpService, private https: HttpClient, private date:DatePipe) { }
  public fetchList(): Observable<any> {
    return this.https.post(`/v1/fxsp/sys/capital/pool/searches`, {});
  }

  public getApplicationList(
    pageIndex: number,
    pageSize: number,
    filters: any
  ): Observable<any> {
    const data: any = {
      businessApplicationCode: filters.businessApplicationCode || '',
      businessApplicationStatus: filters.businessApplicationStatus,
      applicationType: filters.applicationType,
      startApplicationDate: filters.applicationDate[0] ? timeToTimestamp(this.date.transform(filters.applicationDate[0], 'yyyy-MM-dd')+' 00:00:00') : "",
      endApplicationDate: filters.applicationDate[1] ? timeToTimestamp(this.date.transform(filters.applicationDate[1], 'yyyy-MM-dd')+' 23:59:59') : "",
      startApprovalDate: filters.approvalDate[0] ? timeToTimestamp(this.date.transform(filters.approvalDate[0], 'yyyy-MM-dd')+' 00:00:00') : "",
      endApprovalDate: filters.approvalDate[1] ? timeToTimestamp(this.date.transform(filters.approvalDate[1], 'yyyy-MM-dd')+' 23:59:59') : "",
      pageSize: pageSize,
      pageNum: pageIndex
    };
    return this.https.post('/v1/fxsp/sys/capital/pool/application/searches', data)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  public getInfo(param: {businessApplicationCode: string}): Observable<any> {
    return this.http.post(`/v1/fxsp/sys/capital/pool/application/detail`, param);
  }

  public reduce(params: Rdata): Observable<any> {
    return this.http.post(`/v1/fxsp/sys/capital/pool/application/delete`, params);
  }

  public reduceList(): Observable<any> {
    return this.http.post(`/v1/fxsp/sys/capital/pool/delete/searches`,{});
  }
}
