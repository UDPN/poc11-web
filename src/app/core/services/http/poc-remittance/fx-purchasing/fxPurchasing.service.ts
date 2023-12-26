/*
 * @Author: zhangxuefeng
 * @Date: 2023-12-23 14:09:48
 * @LastEditors: zhangxuefeng
 * @LastEditTime: 2023-12-26 15:05:37
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
  // 获取FX Receiving
  public fetchFxReceiving(): Observable<any> {
    // return this.http.post(`/v1/common/allWalletList`);
    return this.http.post(
      `https://988b6337-e8a8-427d-8008-04cffd5abaf4.mock.pstmn.io/v1/common/fetchFxReceiving`
    );
  }
  // 获取FX Purchase
  public fetchFXPurchase(): Observable<any> {
    // return this.http.post(`/v1/common/allWalletList`);
    return this.http.post(
      `https://3d58a99c-2e30-40f8-ab45-2a607e93c7ad.mock.pstmn.io/v1/common/fetchFXPurchase`
    );
  }
  // 获取汇率信息
  public fetchRateInfo(params: { from: string; to: string }): Observable<any> {
    // return this.http.post(`/v1/common/allWalletList`);
    return this.http.post(
      `https://d29e6f43-176f-486c-9330-e6bb3e4c0143.mock.pstmn.io/v1/common/fxRates`,
      // params
      { from: '123', to: '0x231456465465489214564613213211315' }
    );
  }
}
