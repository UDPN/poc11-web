import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { BaseHttpService } from '../base-http.service';

export interface Pages {
  pageNum: number,
  pageSize: number
}

export interface InPages {
  inPage: Pages
}

export interface VnId {
  vnId: string
}

export interface CheckData {
  didDocument: string,
  didSignatureValue: string,
  version: string
}

export interface InsertData {
  bnEmailCode: string,
  chainMemberAddr: string,
  chainMemberContact: string,
  chainMemberLicense: string,
  chainMemberPhone: string,
  chainMemberUrl: string,
  countryId: number,
  enterpriseName: string,
  nodeEmail: string,
  udpnDidDocument: string,
  udpnPeerDesc: string,
  udpnPeerName: string,
  udpnPeerTitle: string,
  version: string,
  didSignatureValue:string
}

export interface UpdateInsertData {
  nodeId:string,
  bnEmailCode: string,
  chainMemberAddr: string,
  chainMemberContact: string,
  chainMemberLicense: string,
  chainMemberPhone: string,
  chainMemberUrl: string,
  countryId: number,
  enterpriseName: string,
  nodeEmail: string,
  udpnDidDoc: string,
  udpnPeerDesc: string,
  udpnPeerName: string,
  udpnPeerTitle: string,
  version: string,
  didSignatureValue:string
}

export interface UpdateInsertDataBN {
  bnEmailCode: string,
  chainMemberAddr: string,
  chainMemberContact: string,
  chainMemberPhone: number,
  nodeEmail: string,
  udpnPeerDesc: string,
  udpnPeerTitle: string
}
@Injectable({
  providedIn: 'root'
})
export class PocJoinService {

  constructor(public http: BaseHttpService, private https: HttpClient,) { }

  
  public fetchVnList(params: InPages): Observable<any> {
    return this.http.post(`/v1/udpn/bninit/vn/manage/searchs`, params);
  }

  
  public fetchSwitchVnList(params: InPages): Observable<any> {
    return this.http.post(`/v1/udpn/bninit/vn/manage/free/searchs`, params);
  }

  
  public bindVnId(params: VnId): Observable<any> {
    return this.http.post(`/v1/udpn/bninit/vn/manage/bind`, params);
  }

  
  public switchVnId(params: VnId): Observable<any> {
    return this.http.post(`/v1/udpn/bninit/vn/manage/switch`, params);
  }


  
  public checkOneStep(params: CheckData): Observable<any> {
    return this.http.post(`/v1/udpn/bninit/node/manager/from/vn/save`, params);
  }

  
  public fetchCountryList(): Observable<any> {
    return this.http.post(`/v1/udpn/bninit/node/manager/country/search`);
  }

  
  public sendMail(params: { toEmail: string }): Observable<any> {
    return this.http.post(`/v1/udpn/bninit/verification/code/manage/email/send`, params);
  }

  
  public fetchSendMailTime(params: { toEmail: string }): Observable<any> {
    return this.http.post(`/v1/udpn/bninit/verification/code/manage/excess/time/get`, params);
  }

  
  public insertNet(params: InsertData): Observable<any> {
    return this.http.post(`/v1/udpn/bninit/node/manager/save`, params);
  }

  
  public editInsertNet(params: UpdateInsertData): Observable<any> {
    return this.http.post(`/v1/udpn/bninit/node/manager/edit`, params);
  }


  public editInsertNetBN(params: UpdateInsertDataBN): Observable<any> {
    return this.http.post(`/v1/udpn/processing/node/manage/basic/info/update`, params);
  }

  
  public uploadImg(params: File): Observable<any> {
    let file: File = params;
    let formData: FormData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post(`/v1/udpn/processing/common/manage/file/upload`, formData);
  }

  
  public downImg(params: {hash:string}): Observable<any> {
    return this.http.post(`/v1/udpn/processing/common/manage/file/download`, params);
  }


  
  public fetchBnStatus(): Observable<any> {
    return this.http.post(`/v1/udpn/bninit/node/manager/detail/search`);
  }
}
