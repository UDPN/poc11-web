/*
 * @Author: zhangxuefeng
 * @Date: 2023-12-23 14:09:48
 * @LastEditors: zhangxuefeng
 * @LastEditTime: 2024-05-15 16:05:04
 * @Description:
 */
import { HttpClient, HttpHandler, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseHttpService } from '../../base-http.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FxPurchasingService {
  constructor(public http: BaseHttpService, private https: HttpClient) {}
  //  FX Receiving
  public fetchFxReceiving(params: { centralBankId: any }): Observable<any> {
    return this.http.post(
      `/v1/remittanceManagement/fxReceivingWalletList`,
      params
    );

    // return this.http.post(
    //   `https://988b6337-e8a8-427d-8008-04cffd5abaf4.mock.pstmn.io/v1/common/fetchFxReceiving`
    // );
  }
  // get FX Purchase
  public fetchFXPurchase(params: { centralBankId: any }): Observable<any> {
    // return this.http.post(`/v1/common/allWalletList`);
    return this.http.post(
      `/v1/remittanceManagement/remitterInformation`,
      params
    );
    // return this.http.post(
    //   `https://3d58a99c-2e30-40f8-ab45-2a607e93c7ad.mock.pstmn.io/v1/common/fetchFXPurchase`
    // );
  }
  // Get exchange rate information
  public fetchRateInfo(params: { from: string; to: string }): Observable<any> {
    return this.http.post(`/v1/common/fxRates`, params);
    // return this.http.post(
    //   `https://d29e6f43-176f-486c-9330-e6bb3e4c0143.mock.pstmn.io/v1/common/fxRates`
    //   // params
    // );
  }
  // transfer
  public transfer(params: {
    fxPurchaseAmount: number;
    fxPurchasingInformation: string;
    receivingWalletId: number;
    passWord: string;
    rateId: string;
    transactionWalletId: string;
    receivingAmount: number;
    sendingAmount: number;
    sendingWalletId: number;
  }): Observable<any> {
    return this.https.post(`/v1/remittanceManagement/fxPurchasing`, params);
  }
}
