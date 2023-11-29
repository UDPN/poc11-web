/*
 * @Author: zhangxuefeng
 * @Date: 2023-10-24 09:52:51
 * @LastEditors: zhangxuefeng
 * @LastEditTime: 2023-10-30 11:28:12
 * @Description:
 */
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrencyStoreService {
  public tystatus$ = new BehaviorSubject<number>(3);
  public zeroShowStatus$ = new BehaviorSubject<boolean>(false);
  public showCapital$ = new BehaviorSubject<boolean>(false);
  public showExchange$ = new BehaviorSubject<boolean>(false);
  private currencyArray$ = new BehaviorSubject<any>('');

  public currencyCapitalDataOld$ = new BehaviorSubject<any[]>([]);
  public currencyCapitalDataExchangeOld$ = new BehaviorSubject<any[]>([]);
  public settlementList$ = new BehaviorSubject<any[]>([]);

  public outExchangeRate$ = new BehaviorSubject<any[]>([]);
  public outCapitalPool$ = new BehaviorSubject<any[]>([]);
  public newCapitalPool$ = new BehaviorSubject<any[]>([]);
  constructor() {}
  setZeroShowStatusStore(data: boolean): void {
    this.zeroShowStatus$.next(data);
  }
  getZeroShowStatusStore(): Observable<any> {
    return this.zeroShowStatus$.asObservable();
  }
  setNewCapitalPoolStore(data: any): void {
    this.newCapitalPool$.next(data);
  }
  getNewCapitalPoolStore(): Observable<any> {
    return this.newCapitalPool$.asObservable();
  }

  setOutCapitalPoolStore(data: any): void {
    this.outCapitalPool$.next(data);
  }
  getOutCapitalPoolStore(): Observable<any> {
    return this.outCapitalPool$.asObservable();
  }

  setOutExchangeRateStore(data: any): void {
    this.outExchangeRate$.next(data);
  }
  getOutExchangeRateStore(): Observable<any> {
    return this.outExchangeRate$.asObservable();
  }

  setTystatusStore(data: number): void {
    this.tystatus$.next(data);
  }
  getTystatusStore(): Observable<any> {
    return this.tystatus$.asObservable();
  }

  setSettlementListStore(data: any): void {
    this.settlementList$.next(data);
  }
  getSettlementListStore(): Observable<any> {
    return this.settlementList$.asObservable();
  }

  setShowCapitalStore(data: boolean): void {
    this.showCapital$.next(data);
  }

  setShowExchangeStore(data: boolean): void {
    this.showExchange$.next(data);
  }
  getShowCapitalStore(): Observable<any> {
    return this.showCapital$.asObservable();
  }
  getShowExchangeStore(): Observable<any> {
    return this.showExchange$.asObservable();
  }

  setCurrencyStore(currencyArray: any): void {
    this.currencyArray$.next(currencyArray);
  }

  getCurrencyStore(): Observable<any> {
    return this.currencyArray$.asObservable();
  }

  setCapitalDataOldStore(data: any): void {
    this.currencyCapitalDataOld$.next(data);
  }

  getCapitalDataOldStore(): Observable<any> {
    return this.currencyCapitalDataOld$.asObservable();
  }

  setCapitalDataExchangeOldStore(data: any): void {
    this.currencyCapitalDataExchangeOld$.next(data);
  }

  getCapitalDataExchangeOldStore(): Observable<any> {
    return this.currencyCapitalDataExchangeOld$.asObservable();
  }
}
