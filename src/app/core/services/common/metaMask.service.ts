/*
 * @Author: zhangxuefeng
 * @Date: 2024-01-15 14:09:16
 * @LastEditors: zhangxuefeng
 * @LastEditTime: 2024-01-16 10:57:48
 * @Description:
 */
import { Injectable } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Params,
  Router,
  UrlSegment
} from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

import _ from 'lodash';
import Web3 from 'web3';
import { NzModalService } from 'ng-zorro-antd/modal';

@Injectable({
  providedIn: 'root'
})
export class MetaMaskService {
  public MetaArray$ = new BehaviorSubject<string[]>([]);
  private metaArray: string[] = [];
  web3: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private modal: NzModalService
  ) {
    this.web3 = new Web3((window as any).ethereum);
  }
  async checkMeataMask(): Promise<string[]> {
    if (!this.web3) {
      this.modal.warning({
        nzTitle: 'Warning',
        nzContent: 'Please install and unlock Metamask first!'
      });
      return new Promise(_).then(() => []);
    }
    const permissions = await this.web3.currentProvider.request({
      method: 'wallet_requestPermissions',
      params: [{ eth_accounts: {} }]
    });
    try {
      return this.web3.eth
        .requestAccounts()
        .then(async () => {
          this.getAccount();
          return await this.web3.eth.getAccounts();
        })
        .catch(console.error);
    } catch (e) {
      return new Promise(_).then(() => []);
    }
  }
  async getAccount() {
    let accounts = await this.web3.eth.getAccounts();
    this.setMetaArray$(accounts);
  }
  getMetaArray$(): Observable<string[]> {
    return this.MetaArray$.asObservable();
  }

  setMetaArray$(tabArray: string[]): void {
    this.MetaArray$.next(tabArray);
  }
  clearMetaArray$(): void {
    this.MetaArray$.next([]);
  }
}
