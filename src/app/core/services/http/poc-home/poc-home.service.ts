/*
 * @Author: zhangxuefeng
 * @Date: 2023-10-17 10:48:53
 * @LastEditors: chenyuting
 * @LastEditTime: 2024-05-22 10:47:16
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

export interface Wdata {
  chainAccountAddress?: string;
  currency?: string;
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

  public walletBalance(params: Wdata): Observable<any> {
    return this.http.post(`/v1/cockpit/walletInfo`, params);
  }

  public getMovements(params: { currency: any }): Observable<any> {
    return this.http.post(`/v1/cockpit/transaction/stat`, params);
  }

  public getCurrencyList(): Observable<any> {
    return this.http.post(`/v1/cockpit/getActiveCurrency`, {});
  }

  public getFiatAmount(params: { amount: number }): Observable<any> {
    return this.http.post(`/v1/wallet/fiat/currency/conversion`, params);
  }
}
