import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Params, Router, UrlSegment } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

import { getDeepReuseStrategyKeyFn, fnGetPathWithoutParam } from '@utils/tools';
import _ from 'lodash';

import { SimpleReuseStrategy } from './reuse-strategy';

export interface TabModel {
  title: string;
  path: string;
  snapshotArray: ActivatedRouteSnapshot[];
}

@Injectable({
  providedIn: 'root'
})
export class TabService {
  private tabArray$ = new BehaviorSubject<TabModel[]>([]);
  private tabArray: TabModel[] = [];
  private currSelectedIndexTab = 0;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  getTabArray$(): Observable<TabModel[]> {
    return this.tabArray$.asObservable();
  }

  setTabArray$(tabArray: TabModel[]): void {
    this.tabArray$.next(tabArray);
  }

  setTabsSourceData(): void {
    this.setTabArray$(this.tabArray);
  }

  clearTabs(): void {
    this.tabArray = [];
    this.setTabsSourceData();
  }

  addTab(param: TabModel, isNewTabDetailPage = false): void {
    this.tabArray.forEach(tab => {
      
      
      if (tab.title === param.title && !isNewTabDetailPage) {
        
        tab.snapshotArray = _.uniqBy([...tab.snapshotArray, ...param.snapshotArray], item => {
          // @ts-ignore
          return item['_routerState'].url;
        });
        
        tab.path = param.path;
      }
    });
    if (!this.tabArray.find(value => value.path === param.path)) {
      this.tabArray.push(param);
    }
    this.setTabsSourceData();
  }

  getTabArray(): TabModel[] {
    return this.tabArray;
  }

  changeTabTitle(title: string): void {
    this.tabArray[this.getCurrentTabIndex()].title = title;
    this.setTabArray$(this.tabArray);
  }

  
  delReuseStrategy(snapshotArray: ActivatedRouteSnapshot[]): void {
    const beDeleteKeysArray = this.getSnapshotArrayKey(snapshotArray);
    
    beDeleteKeysArray.forEach(item => {
      SimpleReuseStrategy.deleteRouteSnapshot(item);
    });
  }

  
  getSnapshotArrayKey(activatedArray: ActivatedRouteSnapshot[]): string[] {
    const temp: string[] = [];
    activatedArray.forEach(item => {
      const key = getDeepReuseStrategyKeyFn(item);
      temp.push(key);
    });
    return temp;
  }

  
  delRightTab(tabPath: string, index: number): void {
    
    const beDelTabArray = this.tabArray.filter((item, tabindex) => {
      return tabindex > index;
    });
    
    this.tabArray.length = index + 1;
    beDelTabArray.forEach(({ snapshotArray }) => {
      this.delReuseStrategy(snapshotArray);
    });
    
    if (index < this.currSelectedIndexTab) {
      SimpleReuseStrategy.waitDelete = getDeepReuseStrategyKeyFn(this.activatedRoute.snapshot);
      this.router.navigateByUrl(this.tabArray[index].path);
    }
    this.setTabsSourceData();
  }

  delLeftTab(tabPath: string, index: number): void {
    
    const beDelTabArray = this.tabArray.filter((item, tabindex) => {
      return tabindex < index;
    });

    
    if (this.currSelectedIndexTab === index) {
      this.currSelectedIndexTab = 0;
    } else if (this.currSelectedIndexTab < index) {
      
      SimpleReuseStrategy.waitDelete = getDeepReuseStrategyKeyFn(this.activatedRoute.snapshot);
      this.currSelectedIndexTab = 0;
    } else if (this.currSelectedIndexTab > index) {
      this.currSelectedIndexTab = this.currSelectedIndexTab - beDelTabArray.length;
    }
    
    this.tabArray = this.tabArray.splice(beDelTabArray.length);
    beDelTabArray.forEach(({ snapshotArray }) => {
      this.delReuseStrategy(snapshotArray);
    });
    this.setTabsSourceData();
    this.router.navigateByUrl(this.tabArray[this.currSelectedIndexTab].path);
  }

  
  delOtherTab(path: string, index: number): void {
    
    const beDelTabArray = this.tabArray.filter((item, tabindex) => {
      return tabindex !== index;
    });

    
    this.tabArray = [this.tabArray[index]];
    
    beDelTabArray.forEach(({ snapshotArray }) => {
      this.delReuseStrategy(snapshotArray);
    });

    
    if (index !== this.currSelectedIndexTab) {
      SimpleReuseStrategy.waitDelete = getDeepReuseStrategyKeyFn(this.activatedRoute.snapshot);
    }
    this.router.navigateByUrl(path);
    this.setTabsSourceData();
  }

  
  delTab(tab: TabModel, index: number): void {
    
    if (index === this.currSelectedIndexTab) {
      const seletedTabKey = getDeepReuseStrategyKeyFn(this.activatedRoute.snapshot);
      this.tabArray.splice(index, 1);
      
      this.currSelectedIndexTab = index - 1 < 0 ? 0 : index - 1;
      
      this.router.navigateByUrl(this.tabArray[this.currSelectedIndexTab].path);
      
      SimpleReuseStrategy.waitDelete = seletedTabKey;
    } else if (index < this.currSelectedIndexTab) {
      
      this.tabArray.splice(index, 1);
      this.currSelectedIndexTab = this.currSelectedIndexTab - 1;
    } else if (index > this.currSelectedIndexTab) {
      
      this.tabArray.splice(index, 1);
    }
    
    
    
    this.delReuseStrategy(tab.snapshotArray);
    this.setTabsSourceData();
  }

  findIndex(path: string): number {
    const current = this.tabArray.findIndex(tabItem => {
      return path === tabItem.path;
    });
    this.currSelectedIndexTab = current;
    return current;
  }

  getCurrentPathWithoutParam(urlSegmentArray: UrlSegment[], queryParam: { [key: string]: any }): string {
    const temp: string[] = [];
    
    const queryParamValuesArray = Object.values(queryParam);
    urlSegmentArray.forEach(urlSeqment => {
      
      if (!queryParamValuesArray.includes(urlSeqment.path)) {
        temp.push(urlSeqment.path);
      }
    });
    return `${temp.join('/')}`;
  }

  
  refresh(): void {
    
    let snapshot = this.activatedRoute.snapshot;
    const key = getDeepReuseStrategyKeyFn(snapshot);
    while (snapshot.firstChild) {
      snapshot = snapshot.firstChild;
    }
    let params: Params;
    let urlWithOutParam = ''; 
    
    if (Object.keys(snapshot.params).length > 0) {
      params = snapshot.params;
      // @ts-ignore
      urlWithOutParam = this.getCurrentPathWithoutParam(snapshot['_urlSegment'].segments, params);
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        SimpleReuseStrategy.deleteRouteSnapshot(key);
        this.router.navigate([urlWithOutParam, ...Object.values(params)]);
      });
    } else {
      
      params = snapshot.queryParams;
      const sourceUrl = this.router.url;
      const currentRoute = fnGetPathWithoutParam(sourceUrl);
      
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        SimpleReuseStrategy.deleteRouteSnapshot(key);
        this.router.navigate([currentRoute], { queryParams: params });
      });
    }
  }

  getCurrentTabIndex(): number {
    return this.currSelectedIndexTab;
  }
}
