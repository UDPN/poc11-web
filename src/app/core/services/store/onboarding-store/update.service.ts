import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class UpdateStoreService {
  private dataObj$ = new BehaviorSubject<any>({});

  constructor() {}

  setDataUpdateStore(obj: any): void {
    this.dataObj$.next(obj);
  }

  getDataUpdateStore(): Observable<any> {
    return this.dataObj$.asObservable();
  }
}
