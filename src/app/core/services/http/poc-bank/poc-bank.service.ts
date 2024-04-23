/*
 * @Author: chenyuting
 * @Date: 2024-04-22 11:32:45
 * @LastEditors: chenyuting
 * @LastEditTime: 2024-04-22 13:49:45
 * @Description:
 */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { BaseHttpService } from '../base-http.service';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class PocBankService {
  constructor(
    public http: BaseHttpService,
    private https: HttpClient,
    private date: DatePipe
  ) {}

  public fetchList(
    pageIndex: number,
    pageSize: number,
    filters: any
  ): Observable<any> {
    const param: any = {
      data: {
        bic: filters.bic || '',
        commercialBankName: filters.commercialBankName || '',
        currency: filters.currency || ''
      },
      page: {
        pageSize: pageSize,
        pageNum: pageIndex
      }
    };
    return this.https
      .post('/v1/bankQuery/commercial/bank/listPage', param)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
}
