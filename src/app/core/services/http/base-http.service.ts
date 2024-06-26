import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { environment } from '@env/environment';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzMessageService } from 'ng-zorro-antd/message';
import * as qs from 'qs';

export interface HttpCustomConfig {
  needSuccessInfo?: boolean;
  showLoading?: boolean;
  otherUrl?: boolean;
}

export interface ActionResult<T> {
  code: number | string;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class BaseHttpService {
  uri: string;
  url: string = '';
  protected constructor(
    public http: HttpClient,
    public message: NzMessageService
  ) {
    this.uri = environment.production ? '' : '';
  }

  get<T>(
    path: string,
    param?: NzSafeAny,
    config?: HttpCustomConfig
  ): Observable<T> {
    config = config || { needSuccessInfo: false };
    let reqPath = this.getUrl(path, config);
    const params = new HttpParams({ fromString: qs.stringify(param) });
    return this.http
      .get<ActionResult<T>>(reqPath, { params })
      .pipe(this.resultHandle<T>(config));
  }

  delete<T>(
    path: string,
    param?: NzSafeAny,
    config?: HttpCustomConfig
  ): Observable<T> {
    config = config || { needSuccessInfo: false };
    let reqPath = this.getUrl(path, config);
    const params = new HttpParams({ fromString: qs.stringify(param) });
    return this.http
      .delete<ActionResult<T>>(reqPath, { params })
      .pipe(this.resultHandle<T>(config));
  }

  post<T>(
    path: string,
    param?: NzSafeAny,
    config?: HttpCustomConfig
  ): Observable<T> {
    config = config || { needSuccessInfo: false };
    let reqPath = this.getUrl(path, config);
    return this.http
      .post<ActionResult<T>>(reqPath, param)
      .pipe(this.resultHandle<T>(config));
  }

  put<T>(
    path: string,
    param?: NzSafeAny,
    config?: HttpCustomConfig
  ): Observable<T> {
    config = config || { needSuccessInfo: false };
    let reqPath = this.getUrl(path, config);
    return this.http
      .put<ActionResult<T>>(reqPath, param)
      .pipe(this.resultHandle<T>(config));
  }

  downLoadWithBlob(
    path: string,
    param?: NzSafeAny,
    config?: HttpCustomConfig
  ): Observable<NzSafeAny> {
    config = config || { needSuccessInfo: false };
    let reqPath = this.getUrl(path, config);
    return this.http.post(reqPath, param, {
      responseType: 'blob',
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  getUrl(path: string, config: HttpCustomConfig): string {
    let reqPath = this.uri + path;
    if (config.otherUrl) {
      reqPath = path;
    }
    this.url = reqPath;
    return reqPath;
  }

  resultHandle<T>(
    config: HttpCustomConfig
  ): (observable: Observable<ActionResult<T>>) => Observable<T> {
    return (observable: Observable<ActionResult<T>>) => {
      return observable.pipe(
        filter((item) => {
          return this.handleFilter(item, !!config.needSuccessInfo);
        }),
        map((item: any) => {
          if (item.code !== '0' && item.code !== 0) {
            // throw new Error(item.message);
          } else {
            if (this.url !== '/v1/commercial/bank/detail') {
              return item.data === null ? true : item.data;
            } else {
              return item.data;
            }
          }
        })
      );
    };
  }

  handleFilter<T>(item: any, needSuccessInfo: boolean): boolean {
    if (item.code !== '0' && item.code !== 0) {
    } else if (needSuccessInfo) {
      this.message.success('Successful operation !');
    }
    return true;
  }
}
