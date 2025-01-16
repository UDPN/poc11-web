/*
 * @Author: chenyuting
 * @Date: 2025-01-15 14:09:17
 * @LastEditors: chenyuting
 * @LastEditTime: 2025-01-16 16:04:16
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
import { CommonModule } from '@angular/common';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
interface SearchParam {
  applicationId: string;
  walletAddress: any;
  enterpriseName: string;
  currency: string | number;
  creationTime: any;
  status: string;
  transactionType: string | number;
}
@Component({
  selector: 'app-top-up-withdraw',
  templateUrl: './top-up-withdraw.component.html',
  styleUrl: './top-up-withdraw.component.less'
})
export class TopUpWithdrawComponent implements OnInit, AfterViewInit {
  @ViewChild('headerContent', { static: false })
  headerContent!: TemplateRef<NzSafeAny>;
  @ViewChild('headerExtra', { static: false })
  headerExtra!: TemplateRef<NzSafeAny>;
  @ViewChild('transactionNoTpl', { static: true })
  transactionNoTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('amountTpl', { static: true })
  amountTpl!: TemplateRef<NzSafeAny>;
  dataList: NzSafeAny[] = [];
  tableConfig!: AntTableConfig;
  tableQueryParams: NzTableQueryParams = {
    pageIndex: 1,
    pageSize: 10,
    sort: [],
    filter: []
  };
  searchParam: Partial<SearchParam> = {
    applicationId: '',
    walletAddress: '',
    enterpriseName: '',
    currency: '',
    status: '',
    transactionType: '',
    creationTime: []
  };
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumb: [],
    extra: '',
    desc: '',
    footer: ''
  };
  constructor(private cdr: ChangeDetectorRef) {}
  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: ``,
      breadcrumb: ['Enterprise Management', 'Top-up & Withdraw Management'],
      extra: this.headerExtra,
      desc: this.headerContent,
      footer: ''
    };
  }
  ngOnInit() {
    this.initTable();
  }

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
      applicationId: '',
      enterpriseName: '',
      walletAddress: '',
      currency: '',
      status: '',
      transactionType: '',
      creationTime: []
    };
    this.getDataList(this.tableQueryParams);
  }

  changePageSize(e: number): void {
    this.tableConfig.pageSize = e;
  }

  getDataList(e?: NzTableQueryParams): void {}

  private initTable(): void {
    this.tableConfig = {
      headers: [
        {
          title: 'Appllication No.',
          tdTemplate: this.transactionNoTpl,
          notNeedEllipsis: true,
          width: 150
        },
        {
          title: 'Enterprise Name',
          field: 'enterpriseName',
          notNeedEllipsis: true,
          width: 150
        },
        {
          title: 'Currency',
          field: 'currency',
          notNeedEllipsis: true,
          width: 100
        },
        {
          title: 'Wallet Address',
          field: 'walletAddress',
          notNeedEllipsis: true,
          width: 150
        },
        {
          title: 'Transaction Type',
          field: 'transactionType',
          notNeedEllipsis: true,
          width: 150
        },
        {
          title: 'Amount',
          tdTemplate: this.amountTpl,
          notNeedEllipsis: true,
          width: 150
        },
        {
          title: 'Applied On',
          field: 'createTime',
          pipe: 'timeStamp',
          notNeedEllipsis: true,
          width: 150
        },
        {
          title: 'Status',
          // tdTemplate: this.statusTpl,
          notNeedEllipsis: true,
          width: 120
        },
        {
          title: 'Actions',
          // tdTemplate: this.operationTpl,
          fixed: true,
          fixedDir: 'right',
          showAction: false,
          width: 100
        }
      ],
      total: 0,
      showCheckbox: false,
      loading: false,
      pageSize: 10,
      pageIndex: 1
    };
  }
}
