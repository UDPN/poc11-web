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
export class PocFxRateService {
  constructor(public http: BaseHttpService, private https: HttpClient, private date:DatePipe) { }
  public fetchList(
    pageIndex: number,
    pageSize: number,
    filters: any
  ): Observable<any> {
    const data: any = {
      formRatePlatform: filters.formRatePlatform || '',
      formRateCurrency: filters.formRateCurrency || '',
      toRatePlatform: filters.toRatePlatform || '',
      toRateCurrency: filters.toRateCurrency||'',
      startDate: filters.createTime[0] ? timeToTimestamp(this.date.transform(filters.createTime[0], 'yyyy-MM-dd')+' 00:00:00') : "",
      endDate: filters.createTime[1] ? timeToTimestamp(this.date.transform(filters.createTime[1], 'yyyy-MM-dd')+' 23:59:59') : "",
      pageSize: pageSize,
      pageNum: pageIndex
    };
   ;
    return this.https.post('/v1/fxsp/sys/history/rate/searches', data)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

}
