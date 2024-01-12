/*
 * @Author: zhangxuefeng
 * @Date: 2023-12-23 14:09:48
 * @LastEditors: zhangxuefeng
 * @LastEditTime: 2024-01-12 13:25:14
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
    // return this.http.post(
    //   `https://2f488421-27a1-4b4d-98d1-9f667c1d7020.mock.pstmn.io/v1/common/allWalletList`
    // );
  }
  // Query the list of central banks
  public fetchBankList(): Observable<any> {
    return this.http.post(`/v1/common/centralBankList`);
    // return this.http.post(
    //   `https://4b376e97-faaa-4d8d-a88f-4380dd38ed43.mock.pstmn.io/v1/common/centralBankList`
    // );
  }
  // exchange rate information
  public exchange(params: { from: string; to: string }): Observable<any> {
    return this.http.post(`/v1/common/fxRates`, params);
    // return this.http.post(
    //   `https://d29e6f43-176f-486c-9330-e6bb3e4c0143.mock.pstmn.io/v1/common/fxRates`,
    //   params
    // );
  }
  // National central bank information
  public nationalInformation(): Observable<any> {
    return this.http.post(`/v1/common/nationalCentralBank`);
  }
  // List of national wallets
  public nationalWallets(): Observable<any> {
    return this.http.post(`/v1/common/nationalWalletList`);
  }

  // transfer
  public transfer(params: {
    beneficiaryBankId: number;
    beneficiaryWalletAddress: string;
    interbankSettlementAmount: number;
    remittanceInformation: string;
    remitterWalletId: number;
    rateId: string;
    passWord: string;
    toCommercialBankId: number;
  }): Observable<any> {
    console.log(params);
    return this.http.post(`/v1/remittanceManagement/transferzzz`, params);
  }
  public fetchAllOhter(params: {
    bankName: string;
    chainAccountAddress: string;
  }): Observable<any> {
    return this.http.post(
      `/v1/remittanceManagement/beneficiaryWalletList`,
      params
    );
  }
}
