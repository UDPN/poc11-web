/*
 * @Author: zhangxuefeng
 * @Date: 2023-10-17 15:43:56
 * @LastEditors: zhangxuefeng
 * @LastEditTime: 2023-10-27 13:59:55
 * @Description:
 */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { BaseHttpService } from '../base-http.service';

export interface InformationData {
  spBriefIntroduction: string;
  spDescription: string;
  bnCode: string;
  contactName: string;
  mobileNumber: string;
  email: string;
  detailedAddress: string;
  businessLicenseUrl: string;
  spName: string;
  countryInfoId: string;
  spBesuWalletAddress: string;
}
export interface InformationEditData {
  spBriefIntroduction: string;
  spDescription: string;
  bnCode: string;
  contactName: string;
  mobileNumber: string;
  email: string;
  detailedAddress: string;
  businessLicenseUrl: string;
  spCode: string;
}
@Injectable({
  providedIn: 'root'
})
export class InformationService {
  constructor(public http: BaseHttpService, private https: HttpClient) {}

  public addForm(params: InformationData): Observable<any> {
    return this.http.post(`/v1/fxsp/sys/sp/add`, params);
  }

  public detail(): Observable<any> {
    return this.http.post(`/v1/fxsp/sys/sp/detail`);
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
  
}
