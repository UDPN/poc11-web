/*
 * @Author: chenyuting
 * @Date: 2024-12-11 17:35:16
 * @LastEditors: chenyuting
 * @LastEditTime: 2024-12-19 13:40:58
 * @Description:
 */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { BaseHttpService } from '../base-http.service';

@Injectable({
  providedIn: 'root'
})
export class PocBankAccountService {
  constructor(
    public http: BaseHttpService,
    private https: HttpClient
  ) {}
  public fetchList(
    pageIndex: number,
    pageSize: number,
    filters: any
  ): Observable<any> {
    const param: any = {
      data: {
        centralBankId: filters.centralBankId || ''
      },
      page: {
        pageSize: pageSize,
        pageNum: pageIndex
      }
    };

    return this.https
      .post('/v1/bank/account/flat/money/transactions', param)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  public getOverview(): Observable<any> {
    return this.http.post(`/v1/bank/account/overview/search`, {});
  }

  public getWalletInfo(param: {currency: any}): Observable<any> {
    return this.http.post(`/v1/bank/account/master/wallet/search`, param);
  }

}
