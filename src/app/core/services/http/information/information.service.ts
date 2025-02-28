/*
 * @Author: zhangxuefeng
 * @Date: 2023-10-17 15:43:56
 * @LastEditors: chenyuting
 * @LastEditTime: 2024-12-18 15:29:18
 * @Description:
 */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { BaseHttpService } from '../base-http.service';

export interface InformationData {
  bankBic: string;
  contactName: string;
  detailedAddress: string;
  email: string;
  interbankSettlementStatus: string | number;
  mobileNumber: string;
  paymentStatus: string | number;
  spBriefIntroduction: string;
  spDescription: string;
  spName: string;
}
export interface InformationEditData {
  contactName: string;
  mobileNumber: string;
  email: string;
  detailedAddress: string;
  spCode: string;
  spName: string;
  bankBic: string;
  spBriefIntroduction: string;
  spDescription: string;
  interbankSettlementStatus: string | number;
  paymentStatus: string | number;
}
@Injectable({
  providedIn: 'root'
})
export class InformationService {
  constructor(public http: BaseHttpService, private https: HttpClient) {}

  public addForm(params: InformationData): Observable<any> {
    return this.http.post(`/v1/commercial/bank/add`, params);
  }

  public detail(): Observable<any> {
    return this.http.post(`/v1/commercial/bank/detail`);
    // return this.http.post(`/v1/fxsp/sys/sp/detail`);
  }

  public editForm(params: InformationEditData): Observable<any> {
    return this.http.post(`/v1/fxsp/sys/sp/edit`, params);
  }

  public uploadImg(params: File): Observable<any> {
    let file: File = params;
    let formData: FormData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post(`/v1/fxsp/sys/file/upload`, formData);
  }

  public downImg(params: { hash: string }): Observable<any> {
    return this.http.post(`/v1/fxsp/sys/file/download`, params);
  }

  public getWalletAddress(): Observable<any> {
    return this.http.post(`/v1/fxsp/sys/sp/getWalletAddress`, {});
  }

  public getUpgrade(): Observable<any> {
    return this.http.post(`/v1/fxsp/sys/upgrade/detail`, {});
  }

  public getCentralBank(): Observable<any> {
    return this.http.post(`/v1/commercial/bank/belongCentralBank`, {});
  }
}
