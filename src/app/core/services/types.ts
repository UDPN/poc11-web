import { Type } from '@angular/core';

import { NzSafeAny } from 'ng-zorro-antd/core/types';


export class DynamicComponent {
  constructor(public component: Type<NzSafeAny>, public data: NzSafeAny) {}
}


export interface OptionsInterface {
  value: number | string;
  label: string;
}


export interface SearchCommonVO<T> {
  pageNum: number;
  pageSize: number;
  filters?: T;
}


export interface PageInfo<T> {
  pageNum: number;
  pageSize: number;
  size?: number;
  orderBy?: string;
  startRow?: number;
  endRow?: number;
  total: number;
  pages?: number;
  list: T[];
  firstPage?: number;
  prePage?: number;
  nextPage?: number;
  lastPage?: number;
  isFirstPage?: boolean;
  isLastPage?: boolean;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
  navigatePages?: number;
  navigatepageNums?: number[];
}


export interface AdComponent {
  data: NzSafeAny;
}


export interface CascaderOption {
  value: number | string;
  label: string;
  children?: CascaderOption[];
  isLeaf?: boolean;
}

export interface Menu {
  id?: number | string;
  fatherId?: number | string;
  path?: string;
  menuName?: string;
  menuType: 'C' | 'F'; 
  icon?: string; 
  alIcon?: string; 
  open?: boolean;
  selected?: boolean; 
  children?: Menu[];
  code?: string; 
  newLinkFlag?: 0 | 1; 
  disabled?: boolean; 
  menuGroup?: boolean;
  groupName?: string;
  groupCollapseName?: string;
}
