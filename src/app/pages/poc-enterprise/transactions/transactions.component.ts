/*
 * @Author: chenyuting
 * @Date: 2025-01-15 14:14:24
 * @LastEditors: chenyuting
 * @LastEditTime: 2025-01-16 16:17:52
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
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
interface SearchParam {
  enterpriseName: string;
  sendingCurrency: string | number;
  from: string;
  to: string;
  receivingCurrency: string | number;
  transactionTime: any;
  transactionHash: string;
  transactionType: string | number;
}
@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.less'
})
export class TransactionsComponent implements OnInit, AfterViewInit {
  @ViewChild('headerContent', { static: false })
  headerContent!: TemplateRef<NzSafeAny>;
  @ViewChild('headerExtra', { static: false })
  headerExtra!: TemplateRef<NzSafeAny>;
  @ViewChild('fromTpl', { static: true })
  fromTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('toTpl', { static: true })
  toTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('sendingAmountTpl', { static: true })
  sendingAmountTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('transactionHashTpl', { static: true })
  transactionHashTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('receivingAmountTpl', { static: true })
  receivingAmountTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('operationTpl', { static: true })
  operationTpl!: TemplateRef<NzSafeAny>;
  dataList: NzSafeAny[] = [];
  tableConfig!: AntTableConfig;
  tableQueryParams: NzTableQueryParams = {
    pageIndex: 1,
    pageSize: 10,
    sort: [],
    filter: []
  };
  searchParam: Partial<SearchParam> = {
    enterpriseName: '',
    sendingCurrency: '',
    from: '',
    to: '',
    receivingCurrency: '',
    transactionTime: [],
    transactionHash: '',
    transactionType: ''
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
      breadcrumb: ['Enterprise Management', 'Transactions'],
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
      enterpriseName: '',
      sendingCurrency: '',
      from: '',
      to: '',
      receivingCurrency: '',
      transactionTime: [],
      transactionHash: '',
      transactionType: ''
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
          title: 'Enterprise Name',
          field: 'enterprise Name',
          width: 100
        },
        {
          title: 'From',
          tdTemplate: this.fromTpl,
          width: 100
        },
        {
          title: 'Sending Amount',
          tdTemplate: this.sendingAmountTpl,
          width: 100
        },
        {
          title: 'To',
          tdTemplate: this.toTpl,
          width: 100
        },
        {
          title: 'Receiving Amount',
          tdTemplate: this.receivingAmountTpl,
          width: 100
        },
        {
          title: 'Type',
          field: 'type',
          pipe: 'walletInfoType',
          width: 100
        },
        {
          title: 'Transaction Hash',
          tdTemplate: this.transactionHashTpl,
          width: 100
        },
        {
          title: 'Transaction Time',
          field: 'txTime',
          pipe: 'timeStamp',
          notNeedEllipsis: true,
          width: 100
        },
        {
          title: 'Actions',
          tdTemplate: this.operationTpl,
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
