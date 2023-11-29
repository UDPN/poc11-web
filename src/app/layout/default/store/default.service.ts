/*
 * @Author: zhangxuefeng
 * @Date: 2023-10-27 13:20:17
 * @LastEditors: zhangxuefeng
 * @LastEditTime: 2023-10-27 13:22:23
 * @Description:
 */
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DefaultStoreService {
  public showChangePassWord$ = new BehaviorSubject<boolean>(false);
  constructor() {}
  setShowChangePassWordStore(data: boolean): void {
    this.showChangePassWord$.next(data);
  }
  getShowChangePassWordStore(): Observable<any> {
    return this.showChangePassWord$.asObservable();
  }
}
