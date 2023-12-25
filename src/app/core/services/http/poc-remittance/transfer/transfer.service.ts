/*
 * @Author: zhangxuefeng
 * @Date: 2023-12-23 14:09:48
 * @LastEditors: zhangxuefeng
 * @LastEditTime: 2023-12-25 11:25:05
 * @Description:
 */
import { HttpClient, HttpHandler, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseHttpService } from '../../base-http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransferService {
  constructor(public http: BaseHttpService, private https: HttpClient) {}
  // List of all wallets (aggregated)
  public fetchAllWalletList(): Observable<any> {
    return this.http.post(`/v1/common/allWalletList`);
  }
  // Query the list of central banks
  public fetchBankList(): Observable<any> {
    // return this.http.post(`/v1/common/centralBankList`);
    return this.http.post(
      `https://4b376e97-faaa-4d8d-a88f-4380dd38ed43.mock.pstmn.io/v1/common/centralBankList`
    );
  }
  // exchange rate information
  public exchange(params: { from: string; to: string }): Observable<any> {
    return this.http.post(`/v1/common/fxRates`, params);
  }
  // National central bank information
  public nationalInformation(): Observable<any> {
    return this.http.post(`/v1/common/nationalCentralBank`);
  }
  // List of national wallets
  public nationalWallets(): Observable<any> {
    return this.http.post(`/v1/common/nationalWalletList`);
  }
}
