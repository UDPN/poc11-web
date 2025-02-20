/*
 * @Author: chenyuting
 * @Date: 2025-02-17 10:19:38
 * @LastEditors: chenyuting
 * @LastEditTime: 2025-02-20 17:23:30
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
import { LiquidityFxTransactionsService } from '@app/core/services/http/poc-liquidity/fx-transactions/fx-transactions.service';
import { SearchCommonVO } from '@app/core/services/types';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { finalize } from 'rxjs';

interface SearchParam {
  transactionNo: string;
  fromCapitalAddress: string;
  toCapitalAddress: string;
  fromWalletAddress: string;
  toWalletAddress: string;
  tokenPair: any;
  fromCurrency: string;
  toCurrency: string;
  fxType: string | number;
  createTime: any;
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

  tokenPairList: Array<any> = [];
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
    fromCapitalAddress: '',
    toCapitalAddress: '',
    fromWalletAddress: '',
    toWalletAddress: '',
    tokenPair: '',
    fromCurrency: '',
    toCurrency: '',
    fxType: '',
    createTime: [],
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
    private windowService: WindowService,
    private liquidityFxTransactionsService: LiquidityFxTransactionsService
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
    this.getTokenPairList();
  }

  getTokenPairList() {
    this.liquidityFxTransactionsService.getTokenPair().subscribe((res: any) => {
      this.tokenPairList = res.data;
    });
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
      fromCapitalAddress: '',
      toCapitalAddress: '',
      fromWalletAddress: '',
      toWalletAddress: '',
      tokenPair: '',
      fromCurrency: '',
      toCurrency: '',
      fxType: '',
      createTime: [],
      status: ''
    };
    this.getDataList(this.tableQueryParams);
  }

  getDataList(e?: NzTableQueryParams): void {
    if (this.searchParam.tokenPair) {
      this.searchParam.fromCurrency = this.searchParam.tokenPair.split('/')[0];
      this.searchParam.toCurrency = this.searchParam.tokenPair.split('/')[1];
    }
    this.tableConfig.loading = true;
    const params: SearchCommonVO<any> = {
      pageSize: this.tableConfig.pageSize!,
      pageNum: e?.pageIndex || this.tableConfig.pageIndex!,
      filters: this.searchParam
    };
    this.liquidityFxTransactionsService
      .getList(params.pageNum, params.pageSize, params.filters)
      .pipe(
        finalize(() => {
          this.tableLoading(false);
        })
      )
      .subscribe((_: any) => {
        this.dataList = _.data?.rows;
        this.tableConfig.total = _.data.page.total;
        this.tableConfig.pageIndex = params.pageNum;
        this.tableLoading(false);
        this.cdr.markForCheck();
      });
  }

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
