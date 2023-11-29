import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { BaseHttpService } from '../../base-http.service';

export interface Idata {
  formRatePlatform: string;
  formRateCurrency: string;
  toRatePlatform: string;
  toRateCurrency: string;
}

export interface Adata {
  formRatePlatform: string;
  formRateCurrency: string;
  toRatePlatform: string;
  toRateCurrency: string;
  settlementModelName: string;
  chargingModel: number;
  regularCommission: string;
  ratioCommission: string;
  maxCommission: string;
}

export interface Edata {
  formRatePlatform: string;
  formRateCurrency: string;
  toRatePlatform: string;
  toRateCurrency: string;
  settlementModelName: string;
  chargingModel: number;
  regularCommission: string;
  ratioCommission: string;
  maxCommission: string;
}

export interface Hdata {
  formRatePlatform: string;
  formRateCurrency: string;
  toRatePlatform: string;
  toRateCurrency: string;
}


@Injectable({
  providedIn: 'root'
})
export class SettlementService {

  constructor(public http: BaseHttpService, private https: HttpClient) { }

  public getList(
    pageIndex: number,
    pageSize: number,
    filters: any
  ): Observable<any> {
    const data: any = {
      settlementModelCode: filters.settlementModelCode || '',
      settlementModelName: filters.settlementModelName || '',
      formRatePlatform: filters.formRatePlatform || '',
      formRateCurrency: filters.formRateCurrency || '',
      toRatePlatform: filters.toRatePlatform || '',
      toRateCurrency: filters.toRateCurrency || '',
      chargingModel: filters.chargingModel,
      pageSize: pageSize,
      pageNum: pageIndex
    };
    return this.https.post('/v1/fxsp/sys/settlement/model/page/list', data)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  public getInfo(params: Idata): Observable<any> {
    return this.http.post(`/v1/fxsp/sys/settlement/model/detail`, params);
  }

  public add(params: Adata): Observable<any> {
    return this.http.post(`/v1/fxsp/sys/settlement/model/add`, params);
  }

  public edit(params: Edata): Observable<any> {
    return this.http.post(`/v1/fxsp/sys/settlement/model/edit`, params);
  }

  public getInfoHistory(params: Hdata): Observable<any> {
    return this.http.post(`/v1/fxsp/sys/settlement/model/history/list`, params);
  }

  
}
