/*
 * @Author: chenyuting
 * @Date: 2025-02-17 09:54:05
 * @LastEditors: chenyuting
 * @LastEditTime: 2025-02-26 12:13:19
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
import { OperateModalComponent } from './operate-modal/operate-modal.component';

interface SearchParam {
  tokenPair: string;
  updatedTime: any[];
  status: number|string;
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
    status: ''
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
    console.log(this.selectedTab);

    this.getDataList();

    this.getTokenPairList();
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
      status: ''
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

    this.getDataList();
    this.getTokenPairList();
  }

  getDataList(e?: NzTableQueryParams): void {

    this.tableConfig.loading = true;
    const params = {
      pageSize: this.tableConfig.pageSize!,
      pageNum: e?.pageIndex || this.tableConfig.pageIndex!,
      filters: this.searchParam
    };
    console.log(params);

    this.tokenPairService
      .fetchList(params.pageNum, params.pageSize, params.filters)
      .pipe(
        finalize(() => {
          this.tableLoading(false);
        })
      )
      .subscribe({
        next: (res: TokenPairResponse) => {
          if (res.code === 0) {
            this.dataList = res.data.rows.map(
              (item: {
                createTime: number;
                createUser: string;
                exchangeRate: number;
                fromCurrency: string;
                rateId: number;
                state: number;
                toCurrency: string;
                updateTime: number;
              }) => ({
                tokenPair: `${item.fromCurrency}/${item.toCurrency}`,
                fxRate: item.exchangeRate.toString(),
                updatedTime: item.updateTime,
                status: item.state,
                rateId: item.rateId
              })
            );
            this.tableConfig.total = res.data.page.total;
            this.tableConfig.pageIndex = params.pageNum;
            this.tableLoading(false);
            // this.cdr.markForCheck();
          } 
        },
        error: () => {
          console.error('Failed to fetch token pair list');
        }
      });
  }



  private initTable(): void {
    this.tableConfig = {
      headers: [
        {
          title: 'Token Pair',
          field: 'tokenPair',
          notNeedEllipsis: true,
          width: 150
        },
        {
          title: 'FX Rate',
          field: 'fxRate',
          notNeedEllipsis: true,
          width: 150
        },
        {
          title: 'Status',
          field: 'status',
          width: 100,
          notNeedEllipsis: true,
          tdTemplate: this.statusTpl
        },
        {
          title: 'Updated Time',
          field: 'updatedTime',
          width: 180,
          pipe: 'timeStamp',
          notNeedEllipsis: true
        },
        {
          title: 'Operation',
          width: 150,
          fixed: true,
          notNeedEllipsis: true,
          tdTemplate: this.operationTpl
        }
      ],
      total: 0,
      loading: false,
      pageSize: 10,
      pageIndex: 1
    };
  }

  getStatusText(state: number): string {
    switch (state) {
      case 0:
        return 'Processing';
      case 1:
        return 'Active';
      case 2:
        return 'Failed';
      case 3:
        return 'Inactive';
      default:
        return 'Unknown';
    }
  }

  getStatusColor(state: number): string {
    switch (state) {
      case 0:
        return 'processing';
      case 1:
        return 'success';
      case 2:
        return 'error';
      case 3:
        return 'default';
      default:
        return 'default';
    }
  }

  openOperateModal(
    rateId: number,
    tokenPair: string,
    isActivate: boolean
  ): void {
    const modal = this.modal.create({
      nzTitle: isActivate ? 'Activate Token Pair' : 'Deactivate Token Pair',
      nzContent: OperateModalComponent,
      nzClosable: false,
      nzMaskClosable: false,
      nzData: {
        rateId: rateId,
        tokenPair: tokenPair,
        isActivate
      },
      nzFooter: null,
      nzWidth: 520
    });

    modal.afterClose.subscribe((result) => {
      if (result) {
        this.loadTokenPairList();
      }
    });
  }

  loadTokenPairList(): void {
    this.getDataList(this.tableQueryParams);
  }
}
