/*
 * @Author: chenyuting
 * @Date: 2024-12-09 15:40:52
 * @LastEditors: chenyuting
 * @LastEditTime: 2024-12-21 10:17:48
 * @Description: 
 */
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BaseHttpService } from '../base-http.service';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';

export interface Sdata {
  fileList: any;
  capitalPoolList: any;
}

@Injectable({
  providedIn: 'root'
})
export class PocActivateSettlementService {
  constructor(private http: BaseHttpService, private https: HttpClient) {}
  public save(param: Sdata): Observable<any> {
    return this.http.post(`/v1/fxsp/sys/upgrade/save`, param);
  }

  public getInfo(): Observable<any> {
    return this.http.post(`/v1/fxsp/sys/upgrade/detail`, {});
  }

  public getWalletAdress(param: { currency: any }): Observable<any> {
    return this.http.post(`/v1/wallet/listByCurrency`, param);
  }
}
