/*
 * @Author: chenyuting
 * @Date: 2025-02-17 10:19:38
 * @LastEditors: chenyuting
 * @LastEditTime: 2025-02-17 15:02:35
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
import { ThemeOptionsKey } from '@app/config/constant';
import { WindowService } from '@app/core/services/common/window.service';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

interface SearchParam {
  transactionNo: string;
  sourceLiquidityPoolAddress: string;
  targetLiquidityPoolAddress: string;
  senderWalletAddress: string;
  receiverWalletAddress: string;
  tokenPair: string | number;
  fxType: string | number;
  creation: any;
  status: any;
}
@Component({
  selector: 'app-fx-transactions',
  templateUrl: './fx-transactions.component.html',
  styleUrl: './fx-transactions.component.less'
})
export class FxTransactionsComponent implements OnInit, AfterViewInit {
  @ViewChild('headerContent', { static: false })
  headerContent!: TemplateRef<NzSafeAny>;
  @ViewChild('headerExtra', { static: false })
  headerExtra!: TemplateRef<NzSafeAny>;
  @ViewChild('transactionNoTpl', { static: true })
  transactionNoTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('sourceTokenTpl', { static: true })
  sourceTokenTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('targetTokenTpl', { static: true })
  targetTokenTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('fxTypeTpl', { static: true })
  fxTypeTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('tokenPairTpl', { static: true })
  tokenPairTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('transactionAmountTpl', { static: true })
  transactionAmountTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('statusTpl', { static: true })
  statusTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('operationTpl', { static: true })
  operationTpl!: TemplateRef<NzSafeAny>;

  currencyList: Array<any> = [];
  dataList: NzSafeAny[] = [];
  tableConfig!: AntTableConfig;
  color: string = '';
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumb: [],
    extra: '',
    desc: '',
    footer: ''
  };
  searchParam: Partial<SearchParam> = {
    transactionNo: '',
    sourceLiquidityPoolAddress: '',
    targetLiquidityPoolAddress: '',
    senderWalletAddress: '',
    receiverWalletAddress: '',
    tokenPair: '',
    fxType: '',
    creation: [],
    status: ''
  };
  tableQueryParams: NzTableQueryParams = {
    pageIndex: 1,
    pageSize: 10,
    sort: [],
    filter: []
  };

  constructor(
    private cdr: ChangeDetectorRef,
    private windowService: WindowService
  ) {}
  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: ``,
      breadcrumb: ['Liquidity Management', 'FX Transactions'],
      extra: this.headerExtra,
      desc: this.headerContent,
      footer: ''
    };
  }
  ngOnInit(): void {
    const themeOptionsKey: any = this.windowService.getStorage(ThemeOptionsKey);
    this.color = JSON.parse(themeOptionsKey).color;
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

  changePageSize(e: number): void {
    this.tableConfig.pageSize = e;
  }

  resetForm(): void {
    this.searchParam = {
      transactionNo: '',
      sourceLiquidityPoolAddress: '',
      targetLiquidityPoolAddress: '',
      senderWalletAddress: '',
      receiverWalletAddress: '',
      tokenPair: '',
      fxType: '',
      creation: [],
      status: ''
    };
    this.getDataList(this.tableQueryParams);
  }

  getDataList(e?: NzTableQueryParams): void {}

  private initTable(): void {
    this.tableConfig = {
      headers: [
        {
          title: 'Transaction No.',
          tdTemplate: this.transactionNoTpl,
          notNeedEllipsis: true,
          width: 140
        },
        {
          title: 'Source Token',
          tdTemplate: this.sourceTokenTpl,
          notNeedEllipsis: true,
          width: 280
        },
        {
          title: 'Target Token',
          tdTemplate: this.targetTokenTpl,
          notNeedEllipsis: true,
          width: 280
        },
        {
          title: 'Transaction Amount',
          tdTemplate: this.transactionAmountTpl,
          notNeedEllipsis: true,
          width: 180
        },
        {
          title: 'Token Pair',
          tdTemplate: this.tokenPairTpl,
          notNeedEllipsis: true,
          width: 150
        },
        {
          title: 'FX Type',
          tdTemplate: this.fxTypeTpl,
          notNeedEllipsis: true,
          width: 150
        },
        {
          title: 'Created on',
          field: 'transactionDate',
          pipe: 'timeStamp',
          notNeedEllipsis: true,
          width: 180
        },
        {
          title: 'Status',
          tdTemplate: this.statusTpl,
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
