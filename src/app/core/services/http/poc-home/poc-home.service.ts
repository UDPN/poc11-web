/*
 * @Author: zhangxuefeng
 * @Date: 2023-10-17 10:48:53
 * @LastEditors: zhangxuefeng
 * @LastEditTime: 2023-10-27 13:31:53
 * @Description:
 */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseHttpService } from '../base-http.service';
import { HttpClient } from '@angular/common/http';

export interface Pages {
  pageNum: number;
  pageSize: number;
}

export interface InPages {
  inPage: Pages;
}

export interface Data {
  sourceCurrency: string;
  sourcePlatform: string;
  targetCurrency: string;
  targetPlatform: string;
}

@Injectable({
  providedIn: 'root'
})
export class PocHomeService {
  constructor(private http: BaseHttpService, private https: HttpClient) {}
  public fetchHomeList(): Observable<any> {
    return this.https.post(
      `/v1/fxsp/sys/home/latest/exchange/rate/searches`,
      {}
    );
  }

  public dynamics(params: Data): Observable<any> {
    return this.https.post(
      `/v1/fxsp/sys/home/history/exchange/rate/dynamics/searches`,
      params
    );
  }

  public volume(): Observable<any> {
    return this.https.post(`/v1/fxsp/sys/home/transaction/volume/searches`, {});
  }
  public isFirstLogin(): Observable<any> {
    return this.https.post(`/v1/fxsp/sys/user/manage/first/login`, {});
  }

  public nonactivatedCurrency(): Observable<any> {
    return this.https.post(`/v1/fxsp/sys/home/nonactivated/currency`, {});
  }

  public pendingCurrency(): Observable<any> {
    return this.https.post(`/v1/fxsp/sys/home/pending/currency`, {});
  }

  public approveCurrency(): Observable<any> {
    return this.https.post(`/v1/fxsp/sys/home/approve/currency`, {});
  }

  
  public nonactivatedRate(): Observable<any> {
    return this.https.post(`/v1/fxsp/sys/home/nonactivated/rate`, {});
  }

  public pendingRate(): Observable<any> {
    return this.https.post(`/v1/fxsp/sys/home/pending/rate`, {});
  }
  
  // public approveCurrency(): Observable<any> {
  //   return this.https.post(`/v1/fxsp/sys/home/approve/currency`, {});
  // }

  
  
}
