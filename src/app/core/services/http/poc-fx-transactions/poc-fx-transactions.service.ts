import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { BaseHttpService } from '../base-http.service';
import { timeToTimestamp } from '@app/utils/tools';
import { DatePipe } from '@angular/common';

export interface Adata {
  lockable: string;
  userName: string;
  telephone: string;
  roleIdList: any;
  email: string;
  realName: string;
}

@Injectable({
  providedIn: 'root'
})
export class PocFxTransactionsService {
  constructor(private http: BaseHttpService,private https: HttpClient, private date: DatePipe) { }
  public getList(
    pageIndex: number,
    pageSize: number,
    filters: any
  ): Observable<any> {
    const data: any = {
      transactionNo: filters.transactionNo || '',
      transactionHash: filters.transactionHash || '',
      formPlatform: filters.formPlatform || '',
      formCurrency: filters.formCurrency || '',
      toPlatform: filters.toPlatform || '',
      toCurrency: filters.toCurrency || '',
      startDate: filters.creation[0] ? timeToTimestamp(this.date.transform(filters.creation[0], 'yyyy-MM-dd')+' 00:00:00') : "",
      endDate: filters.creation[1] ? timeToTimestamp (this.date.transform(filters.creation[1], 'yyyy-MM-dd')+' 23:59:59') : "",
      pageSize: pageSize,
      pageNum: pageIndex
    };
    return this.https.post('/v1/fxsp/sys/transaction/page/list', data)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  public info(params: { transactionNo: string }): Observable<any> {
    return this.http.post(`/v1/fxsp/sys/transaction/detail`, params);
  }
}
