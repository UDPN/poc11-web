/*
 * @Author: zhangxuefeng
 * @Date: 2023-10-17 15:43:56
 * @LastEditors: chenyuting
 * @LastEditTime: 2024-12-12 11:27:35
 * @Description:
 */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { BaseHttpService } from '../base-http.service';

export interface CommonData {
  dropDownTypeCode: string;
  csePCode?: string;
}
@Injectable({
  providedIn: 'root'
})
export class CommonService {
  constructor(public http: BaseHttpService, private https: HttpClient) {}

  public commonApi(params: CommonData): Observable<any> {
    return this.http.post(
      `/v1/fxsp/anon/common/drop/down/box/searches`,
      params
    );
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

  public download(busId: any, busType: any): Observable<any> {
    return this.http.get(
      `/v1/export/task/download?busId=${busId}&busType=${busType}`,
      { responseType: 'blob' }
    );
  }
}
