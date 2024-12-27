/*
 * @Author: chenyuting
 * @Date: 2024-04-22 11:32:45
 * @LastEditors: chenyuting
 * @LastEditTime: 2024-12-27 14:18:00
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
export class PocAccessKeyService {
  constructor(
    public http: BaseHttpService,
    private https: HttpClient,
    private date: DatePipe
  ) {}

  public gatewayUrl(): Observable<any> {
    return this.http.post(`/v1/access/access/get`, {});
  }
}
