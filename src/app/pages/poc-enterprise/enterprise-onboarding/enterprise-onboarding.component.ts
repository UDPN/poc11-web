/*
 * @Author: chenyuting
 * @Date: 2025-01-15 13:34:21
 * @LastEditors: chenyuting
 * @LastEditTime: 2025-01-15 15:49:06
 * @Description:
 */
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { SearchCommonVO } from '@app/core/services/types';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

interface SearchParam {
  enterpriseName: any;
  enterpriseId: string;
  contactName: string | number;
  email: string;
  creationTime: any;
  status: string;
}

@Component({
  selector: 'app-enterprise-onboarding',
  templateUrl: './enterprise-onboarding.component.html',
  styleUrl: './enterprise-onboarding.component.less'
})
export class EnterpriseOnboardingComponent implements OnInit, AfterViewInit {
  @ViewChild('headerContent', { static: false })
  headerContent!: TemplateRef<NzSafeAny>;
  @ViewChild('headerExtra', { static: false })
  headerExtra!: TemplateRef<NzSafeAny>;
  dataList: NzSafeAny[] = [];
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumb: [],
    extra: '',
    desc: '',
    footer: ''
  };
  searchParam: Partial<SearchParam> = {
    enterpriseName: '',
    enterpriseId: '',
    contactName: '',
    email: '',
    status: '',
    creationTime: []
  };
  tableQueryParams: NzTableQueryParams = {
    pageIndex: 1,
    pageSize: 10,
    sort: [],
    filter: []
  };
  tableConfig!: AntTableConfig;

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: ``,
      breadcrumb: ['Enterprise Management', 'Enterprise Onboarding'],
      extra: this.headerExtra,
      desc: this.headerContent,
      footer: ''
    };
  }
  ngOnInit() {}

  tableChangeDectction(): void {
    this.dataList = [...this.dataList];
    this.cdr.detectChanges();
  }

  tableLoading(isLoading: boolean): void {
    this.tableConfig.loading = isLoading;
    this.tableChangeDectction();
  }

  resetForm(): void {
    this.searchParam = {
      enterpriseName: '',
      enterpriseId: '',
      contactName: '',
      email: '',
      status: '',
      creationTime: []
    };
    this.getDataList(this.tableQueryParams);
  }

  changePageSize(e: number): void {
    this.tableConfig.pageSize = e;
  }

  getDataList(e?: NzTableQueryParams): void {
    // this.tableConfig.loading = true;
    // const params: SearchCommonVO<any> = {
    //   pageSize: this.tableConfig.pageSize!,
    //   pageNum: e?.pageIndex || this.tableConfig.pageIndex!,
    //   filters: this.searchParam
    // };
    // this.transactionRecordService
    //   .getList(params.pageNum, params.pageSize, params.filters)
    //   .pipe(
    //     finalize(() => {
    //       this.tableLoading(false);
    //     })
    //   )
    //   .subscribe((_: any) => {
    //     this.dataList = _.data?.rows;
    //     this.tableConfig.total = _.data.page.total;
    //     this.tableConfig.pageIndex = params.pageNum;
    //     this.tableLoading(false);
    //     this.cdr.markForCheck();
    //   });
  }
}
