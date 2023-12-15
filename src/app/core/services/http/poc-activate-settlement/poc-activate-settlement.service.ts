import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BaseHttpService } from '../base-http.service';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';

export interface Sdata {
  fileList: any,
  capitalPoolList: any
}


@Injectable({
  providedIn: 'root'
})
export class PocActivateSettlementService {

  constructor(private http: BaseHttpService, private https: HttpClient) { }
  public save(param: Sdata): Observable<any> {
    return this.http.post(`/v1/fxsp/sys/upgrade/save`, param);
  }

  public getInfo(): Observable<any> {
    return this.http.post(`/v1/fxsp/sys/upgrade/detail`, {});
  }
}
