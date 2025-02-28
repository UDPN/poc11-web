/*
 * @Author: chenyuting
 * @Date: 2024-12-23 13:53:26
 * @LastEditors: chenyuting
 * @LastEditTime: 2024-12-26 10:57:04
 * @Description:
 */
import { HttpClient } from '@angular/common/http';
import { BaseHttpService } from '../base-http.service';
import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

export interface Gdata {
  chatMsgId: number | string;
  msgType: number;
}

export interface Adata {
  content: string;
  title: number;
  toClientCode: string | number;
  toClientType: string | number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  constructor(
    public http: BaseHttpService,
    private https: HttpClient,
    private date: DatePipe
  ) {}

  public getList(
    pageIndex: number,
    pageSize: number,
    filters: any
  ): Observable<any> {
    const param: any = {
      data: {
        msgType: filters.msgType || ''
      },
      page: {
        pageSize: pageSize,
        pageNum: pageIndex
      }
    };
    return this.https.post('/v1/msg/noticeList', param).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  public getInfo(params: Gdata): Observable<any> {
    return this.http.post(`/v1/msg/noticeDetails`, params);
  }

  public getNoticeDelete(params: Gdata): Observable<any> {
    return this.http.post(`/v1/msg/noticeDelete`, params);
  }

  public getCommercialBankList(): Observable<any> {
    return this.http.post(`/v1/common/bankList`, {});
  }

  public getCentralBankList(): Observable<any> {
    return this.http.post(`/v1/common/centralBankList`, {});
  }

  public addChat(params: Adata): Observable<any> {
    return this.http.post(`/v1/msg/save`, params);
  }

  public getChatList(
    pageIndex: number,
    pageSize: number,
    filters: any
  ): Observable<any> {
    const param: any = {
      data: {
        sendType: filters.sendType || ''
      },
      page: {
        pageSize: pageSize,
        pageNum: pageIndex
      }
    };
    return this.https.post('/v1/msg/chatList', param).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  public getChatInfo(
    pageIndex: number,
    pageSize: number,
    filters: any
  ): Observable<any> {
    const param: any = {
      data: {
        chatMsgId: filters.chatMsgId || '',
        msgCode: filters.msgCode || ''
      },
      page: {
        pageSize: pageSize,
        pageNum: pageIndex
      }
    };
    return this.https.post('/v1/msg/chatDetails', param).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  public getUnReadCount(): Observable<any> {
    return this.http.post(`/v1/msg/unReadCount`, {});
  }
}
