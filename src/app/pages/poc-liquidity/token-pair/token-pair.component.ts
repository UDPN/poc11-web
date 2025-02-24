/*
 * @Author: chenyuting
 * @Date: 2025-02-17 09:54:05
 * @LastEditors: chenyuting
 * @LastEditTime: 2025-02-17 10:28:57
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
import { TokenPairService } from '@app/core/services/http/poc-liquidity/token-pair/token-pair.service';
import { SearchCommonVO } from '@app/core/services/types';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { finalize } from 'rxjs';

interface SearchParam {
  tokenPair: string;
  updatedTime: any[];
  status: number;
}

interface TokenPairResponse {
  code: number;
  data: {
    page: {
      isFirstPage: boolean;
      isLastPage: boolean;
      pageNum: number;
      pageSize: number;
      pages: number;
      total: number;
    };
    rows: Array<{
      createTime: number;
      createUser: string;
      exchangeRate: number;
      fromCurrency: string;
      rateId: number;
      state: number;
      toCurrency: string;
      updateTime: number;
    }>;
  };
  message: string;
}

@Component({
  selector: 'app-token-pair',
  templateUrl: './token-pair.component.html',
  styleUrls: ['./token-pair.component.less']
})
export class TokenPairComponent implements OnInit, AfterViewInit {
  @ViewChild('headerContent', { static: false })
  headerContent!: TemplateRef<NzSafeAny>;
  @ViewChild('headerExtra', { static: false })
  headerExtra!: TemplateRef<NzSafeAny>;
  @ViewChild('operationTpl', { static: true })
  operationTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('statusTpl', { static: true })
  statusTpl!: TemplateRef<NzSafeAny>;

  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumb: [],
    extra: '',
    desc: '',
    footer: ''
  };
  searchParam: Partial<SearchParam> = {
    tokenPair: '',
    updatedTime: [],
    status: 0
  };
  tableQueryParams: NzTableQueryParams = {
    pageIndex: 1,
    pageSize: 10,
    sort: [],
    filter: []
  };
  tableConfig!: AntTableConfig;
  dataList: NzSafeAny[] = [];
  tokenPairList: Array<{ key: string; value: string }> = [];
  selectedTabIndex = Number(localStorage.getItem('tokenPairTabIndex')) || 0;
  selectedTab = localStorage.getItem('tokenPairTab') || 'local';

  constructor(
    private tokenPairService: TokenPairService,
    private cdr: ChangeDetectorRef,
    private message: NzMessageService,
    private modal: NzModalService
  ) {}

  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: ``,
      breadcrumb: ['Liquidity Management', 'Token Pair Management'],
      extra: this.headerExtra,
      desc: this.headerContent,
      footer: ''
    };
  }

  ngOnInit() {
    this.initTable();
    this.getTokenPairList();
    this.getDataList();
  }

  getTokenPairList(): void {
    if (this.selectedTab === 'network') {
      this.tokenPairService.getNetRates().subscribe({
        next: (res: any) => {
          this.tokenPairList = res;
        }
      });
    } else {
      this.tokenPairService.getLocalRates().subscribe({
        next: (res: any) => {
          this.tokenPairList = res;
        }
      });
    }
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
      tokenPair: '',
      updatedTime: [],
      status: 0
    };
    this.getDataList(this.tableQueryParams);
  }
  changePageSize(e: number): void {
    this.tableConfig.pageSize = e;
  }

  onTabChange(index: number): void {
    this.selectedTabIndex = index;
    this.selectedTab = index === 0 ? 'local' : 'network';
    
    // 保存到 localStorage
    localStorage.setItem('tokenPairTabIndex', index.toString());
    localStorage.setItem('tokenPairTab', this.selectedTab);

    // 重置搜索条件和分页
    this.searchParam = {};
    this.tableConfig.pageIndex = 1;
    
    if (this.selectedTab === 'local') {
      this.getDataList();
    } else {
      this.getNetworkDataList();
    }
  }

  getDataList(e?: NzTableQueryParams): void {
    this.tableConfig.loading = true;
    const params = {
      pageSize: this.tableConfig.pageSize!,
      pageNum: e?.pageIndex || this.tableConfig.pageIndex!,
      filters: this.searchParam
    };

    this.tokenPairService.fetchList(params.pageNum, params.pageSize, params.filters)
      .pipe(
        finalize(() => {
          this.tableLoading(false);
        })
      )
      .subscribe({
        next: (res: TokenPairResponse) => {
          if (res.code === 0) {
            this.dataList = res.data.rows.map((item: { createTime: number; createUser: string; exchangeRate: number; fromCurrency: string; rateId: number; state: number; toCurrency: string; updateTime: number; }) => ({
              tokenPair: `${item.fromCurrency}/${item.toCurrency}`,
              fxRate: item.exchangeRate.toString(),
              updatedTime: item.updateTime,
              status: item.state,
              rateId: item.rateId
            }));
            this.tableConfig.total = res.data.page.total;
            this.tableConfig.pageIndex = params.pageNum;
            this.tableLoading(false);
            this.cdr.markForCheck();
          } else {
            this.message.error(res.message || 'Failed to fetch token pair list');
          }
        },
        error: () => {
          this.message.error('Failed to fetch token pair list');
        }
      });
  }

  getNetworkDataList(e?: NzTableQueryParams): void {
    this.tableConfig.loading = true;
    const params = {
      pageSize: this.tableConfig.pageSize!,
      pageNum: e?.pageIndex || this.tableConfig.pageIndex!,
      filters: this.searchParam
    };

    this.tokenPairService.fetchNetworkList(params.pageNum, params.pageSize, params.filters)
      .pipe(
        finalize(() => {
          this.tableLoading(false);
        })
      )
      .subscribe({
        next: (res: any) => {
          if (res.code === 0) {
            this.dataList = res.data.rows.map((item: { createTime: number; createUser: string; exchangeRate: number; fromCurrency: string; rateId: number; state: number; toCurrency: string; updateTime: number; }) => ({
              tokenPair: `${item.fromCurrency}/${item.toCurrency}`,
              fxRate: item.exchangeRate.toString(),
              updatedTime: item.updateTime,
              status: item.state,
              rateId: item.rateId
            }));
            this.tableConfig.total = res.data.page.total;
            this.tableConfig.pageIndex = params.pageNum;
            this.tableLoading(false);
            this.cdr.markForCheck();
          } else {
            this.message.error(res.message );
          }
        },
        error: () => {
          this.message.error('error');
        }
      });
  }

  private initTable(): void {
    this.tableConfig = {
      headers: [
        {
          title: 'Token Pair',
          field: 'tokenPair',
          width: 150
        },
        {
          title: 'FX Rate',
          field: 'fxRate',
          width: 150
        },
        {
          title: 'Updated on',
          field: 'updatedTime',
          pipe: 'timeStamp',
          width: 200
        },
        {
          title: 'Status',
          field: 'status',
          tdTemplate: this.statusTpl,
          width: 100
        },
        {
          title: 'Actions',
          tdTemplate: this.operationTpl,
          fixed: true,
          fixedDir: 'right',
          showAction: false,
          width: 150,
          field: 'rateId'
        }
      ],
      total: 0,
      loading: false,
      pageSize: 10,
      pageIndex: 1
    };
  }

  getStatusColor(status: number): string {
    switch (status) {
      case 1:
        return 'success';
      case 0:
        return 'processing';
      case 2:
        return 'error';
      default:
        return 'default';
    }
  }

  getStatusText(status: number): string {
    switch (status) {
      case 1:
        return 'Active';
      case 0:
        return 'Processing';
      case 2:
        return 'Inactive';
      default:
        return 'Unknown';
    }
  }
}
