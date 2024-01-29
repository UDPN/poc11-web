import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { BaseHttpService } from '../../base-http.service';
import { timeToTimestamp } from '@app/utils/tools';
import { DatePipe } from '@angular/common';

export interface Edata {
  billInfoId: any;
  transactionNo: any;
  billNo: any;
  recipientList: any;
}

export interface Pdata {
  billNo: any;
  recipientList: any;
}

@Injectable({
  providedIn: 'root'
})
export class BillService {

  constructor(public http: BaseHttpService, private https: HttpClient, private date: DatePipe) { }
  public getList(
    pageIndex: number,
    pageSize: number,
    filters: any
  ): Observable<any> {
    const data: any = {
      billNo: filters.billNo || '',
      billCycle: filters.billCycle ? timeToTimestamp(this.date.transform(filters.billCycle, 'yyyy-MM')+'-01 00:00:00') : '',
      bankId: filters.bankId || '',
      bankName: filters.bankName || '',
      formPlatform: filters.formPlatform || '',
      formCurrency: filters.formCurrency || '',
      toPlatform: filters.toPlatform|| '',
      toCurrency: filters.toCurrency|| '',
      startDate: filters.creation[0] ? timeToTimestamp(this.date.transform(filters.creation[0], 'yyyy-MM-dd')+' 00:00:00') : "",
      endDate: filters.creation[1] ? timeToTimestamp (this.date.transform(filters.creation[1], 'yyyy-MM-dd')+' 23:59:59') : "",
      pageSize: pageSize,
      pageNum: pageIndex
    };
    return this.https.post('/v1/fxsp/sys/bill/page/list', data)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  public getInfo(params: {billNo: string}): Observable<any> {
    return this.http.post(`/v1/fxsp/sys/bill/detail`, params);
  }

  public getInvoice(params: {billNo: string}): Observable<any> {
    return this.http.post(`/v1/fxsp/sys/bill/invoice/select`, params);
  }

  public getTransactionList(
    pageIndex: number,
    pageSize: number,
    filters: any
  ): Observable<any> {
    const data: any = {
      billNo: filters.billNo || '',
      transactionNo: filters.transactionNo || '',
      fromBnId: filters.fromBnId || '',
      pageSize: pageSize,
      pageNum: pageIndex
    };
    return this.https.post('/v1/fxsp/sys/bill/transaction/detail', data)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  public getExport(params: Edata, timeZone: any): Observable<any> {
    return this.https.post(`/v1/fxsp/sys/bill/export`, params, { headers: {'timeZone': timeZone } });
  }

  public getExportPdf(params: Pdata, timeZone: any): Observable<any> {
    return this.https.post(`/v1/fxsp/sys/bill/invoice/export`, params, { headers: {'timeZone': timeZone } });
  }

}
