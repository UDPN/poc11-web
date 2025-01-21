import {
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, map, TimeoutError, Subject } from 'rxjs';
import { catchError, filter, takeUntil, timeout } from 'rxjs/operators';

import { TokenKey } from '@config/constant';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzMessageService } from 'ng-zorro-antd/message';

import { WindowService } from '../common/window.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { LoginInOutService } from '../common/login-in-out.service';
import { environment } from '@env/environment';
import { el } from 'date-fns/locale';
import { PocHomeService } from '../http/poc-home/poc-home.service';

interface CustomHttpConfig {
  headers?: HttpHeaders;
  url?: string;
}
const APP_XHR_TIMEOUT = 60000;
@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  reLoginCode: any = null;
  firstCode: any = null;
  errorCode: any = null;
  public cancelPenddingRequest$ = new Subject<void>();
  constructor(
    private windowServe: WindowService,
    public message: NzMessageService,
    private loginOutService: LoginInOutService,
    private modal: NzModalService,
    private translate: TranslateService,
    private router: Router,
    private pocHomeService: PocHomeService
  ) {}

  intercept(
    req: HttpRequest<NzSafeAny>,
    next: HttpHandler
  ): Observable<HttpEvent<NzSafeAny>> {
    // const token = this.windowServe.getSessionStorage(TokenKey);
    const token: any = sessionStorage.getItem('token');

    // const token: any = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpYXQiOjE3MDQxOTQxNzQsInN1YiI6ImFkbWluIiwiZXhwIjoxNzA0MjgwNTc0LCJvdXRKd3RUb2tlbkluZm8iOnsicm9sZUxpc3QiOlsiYWRtaW4iXSwiY2xpZW50SWQiOjEsImNsaWVudFJlYWxOYW1lIjoiYWRtaW4ifX0.4n2pjZ4h1PBCiNgf-i5TAwJj9Sul5sjGgbZxkgrRmO5mX07dimFFSZ25lCD7Aun8C8lYM2N1si29yZIC4eJ32A';
    let httpConfig: CustomHttpConfig = {};
    if (req.url.indexOf('fxsp') === -1) {
      this.pocHomeService.isFirstLogin().subscribe((res: any) => {
        return res;
      });
      let prefixUrl: string = '';
      if (req.url.indexOf('enterprise') !== -1) {
        prefixUrl = '/api/manage';
      } else {
        prefixUrl = '/wcbdccommercial';
      }
      httpConfig = {
        headers: req.headers.set('token', token),
        url: (environment.production ? prefixUrl : '') + req.url
      };
    } else {
      httpConfig = {
        url: (environment.production ? '/lpcp' : '') + req.url
      };
    }
    req = req.clone({
      withCredentials: environment.production ? true : false
    });

    const copyReq = req.clone(httpConfig);
    return next.handle(this.performRequest(copyReq)).pipe(
      filter((e) => e.type !== 0),
      map((res) => this.handleSuccess(res)),
      timeout(APP_XHR_TIMEOUT),
      catchError((error) => this.handleError(error)),
      takeUntil(this.cancelPenddingRequest$.asObservable())
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    const status = error.status;
    if (error instanceof TimeoutError) {
      this.modal.error({
        nzTitle: 'the request has timed out !',
        nzContent: ''
      });
    }
    let errMsg = '';
    if (status && status !== 200) {
      if (this.errorCode) {
        this.errorCode.close();
      }
      this.errorCode = this.modal.error({
        nzTitle:
          'There is an error in backend system, please wait and try again in a few minutes.  If you encounter this issue all the time, please contract support.',
        nzContent: ''
      });
    }
    return throwError({
      code: status,
      message: errMsg
    });

    // let errMsg = '';
    // if (status === 0) {
    //   errMsg = 'An unknown error occurred network, please check your network';
    // }
    // if (status >= 300 && status < 400) {
    //   errMsg = `The request is server redirect, a status code ${status}`;
    // }
    // if (status >= 400 && status < 500) {
    //   errMsg = `Client error, may be send a wrong data, a status code ${status}`;
    // }
    // if (status >= 500) {

    //   errMsg = `Server error occurs, a status code ${status}`;
    // }
    // return throwError({
    //   code: status,
    //   message: errMsg
    // });
  }

  private handleSuccess(event: any): HttpResponse<any> {
    const filterCode = [0, '0', 200, 304];
    const otherFilterCode = ['FXSP_20603'];
    if (event instanceof HttpResponse) {
      if (
        event.url !== undefined &&
        event.url !== null &&
        event.url.indexOf('.json') !== -1
      ) {
        return event;
      }
      if (event.status === 200 && event.body.hasOwnProperty('code')) {
        if (
          filterCode.includes(event.body.code) ||
          filterCode.includes(event.body.message)
        ) {
          return event;
        }
        if (
          event.body.code !== 'FXSP_ELEVEN_20420' &&
          event.body.message !== 'MSG_00_0005'
        ) {
          if (!this.firstCode) {
            if (event.body.code !== 1) {
              this.modal.error({
                nzTitle: this.translate.instant(`MSG_${event.body.code}`),
                nzContent: ''
              });
            }
          }
        } else {
          this.cancelPenddingRequest$.next();
          this.windowServe.clearStorage();
          this.windowServe.clearSessionStorage();
          this.loginOutService.loginOut().then((_) => {
            this.router.navigateByUrl('/login/login-modify');
            if (this.reLoginCode) {
              this.reLoginCode.close();
            }
            this.reLoginCode = this.modal.error({
              nzTitle: 'Login information expired, please log in again',
              nzContent: ''
            });
          });
        }
        if (
          event.body.code === 1 &&
          event.body.message.indexOf('MSG_') !== -1 &&
          event.body.message !== 'MSG_00_0005'
        ) {
          this.modal.error({
            nzTitle: this.translate.instant(`${event.body.message}`),
            nzContent: ''
          });
          return event;
        }
        if (
          event.body.code === -1 ||
          (event.body.code === 1 && event.body.message !== 'MSG_00_0005')
        ) {
          this.modal.error({
            nzTitle: 'System error, please try again later !',
            nzContent: ''
          });
          return event;
        }
        if (event.body.code === 50000) {
          this.modal.error({
            nzTitle:
              'Encounter an internal error, please contact VN admin with message code: 50000 !',
            nzContent: ''
          });
          return event;
        }
        if (otherFilterCode.includes(event.body.code)) {
          this.modal.error({
            nzTitle: this.translate.instant(`MSG_${event.body.code}`, {
              value: event.body.data
            }),
            nzContent: ''
          });
          return event;
        }
      }
    }
    return event;
  }
  private performRequest(req: HttpRequest<any>): HttpRequest<any> {
    const headers: HttpHeaders = req.headers;
    if (environment.production) {
      return req.clone({ url: `${environment.localUrl}${req.url}`, headers });
    } else {
      return req.clone({ url: `${req.url}`, headers });
    }
  }
}
