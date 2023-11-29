import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

type componentName = 'Search list (article)' | 'Search list (project)' | 'Search list (application)';


@Injectable({
  providedIn: 'root'
})
export class SearchListStoreService {
  private SearchListComponentStore = new Subject<componentName>();

  constructor() {}

  setCurrentSearchListComponentStore(componentName: componentName): void {
    this.SearchListComponentStore.next(componentName);
  }

  getCurrentSearchListComponentStore(): Observable<componentName> {
    return this.SearchListComponentStore.asObservable();
  }
}
