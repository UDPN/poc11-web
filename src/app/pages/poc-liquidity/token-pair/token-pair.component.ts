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
  status: number | string;
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
    status: '',
    updatedTime: []
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
  selectedTabIndex = 0;
  selectedTab = 'local';

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
  }

  getTokenPairList(): void {
    this.tokenPairService.getTokenPairList().subscribe({
      next: (res) => {
        if (res.code === 0) {
          this.tokenPairList = res.data;
        }
      }
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

  resetForm(): void {
    this.searchParam = {
      tokenPair: '',
      status: '',
      updatedTime: []
    };
    this.getDataList(this.tableQueryParams);
  }

  changePageSize(e: number): void {
    this.tableConfig.pageSize = e;
  }

  onTabChange(index: number): void {
    this.selectedTabIndex = index;
    this.selectedTab = index === 0 ? 'local' : 'network';
    this.getDataList(this.tableQueryParams);
  }

  getDataList(e?: NzTableQueryParams): void {
    this.tableConfig.loading = true;
    const params: SearchCommonVO<any> = {
      pageSize: this.tableConfig.pageSize!,
      pageNum: e?.pageIndex || this.tableConfig.pageIndex!,
      filters: this.searchParam
    };

    const request$ = this.selectedTab === 'local' 
      ? this.tokenPairService.fetchList(params.pageNum, params.pageSize, params.filters)
      : this.tokenPairService.fetchNetworkList(params.pageNum, params.pageSize, params.filters);

    request$
      .pipe(
        finalize(() => {
          this.tableLoading(false);
        })
      )
      .subscribe({
        next: (res: any) => {
          if (res.code === 0) {
            this.dataList = res.data?.rows || [];
            this.tableConfig.total = res.data?.page?.total || 0;
            this.tableConfig.pageIndex = params.pageNum;
            this.tableLoading(false);
            this.cdr.markForCheck();
          } else {
            this.message.error(res.message || 'Failed to fetch token pair list');
          }
        },
        error: () => {
          this.message.error('Failed to fetch token pair list');
          this.tableLoading(false);
        }
      });
  }

  private initTable(): void {
    this.tableConfig = {
      headers: [
        {
          title: 'No.',
          field: 'id',
          width: 80
        },
        {
          title: 'Token Pair',
          field: 'tokenPair',
          width: 120
        },
        {
          title: 'FX Rate',
          field: 'fxRate',
          width: 100
        },
        {
          title: 'FX Rate Updated on',
          field: 'updatedTime',
          pipe: 'date:MMM d, y, HH:mm:ss',
          width: 180
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
          width: 120
        }
      ],
      total: 0,
      showCheckbox: false,
      loading: false,
      pageSize: 10,
      pageIndex: 1
    };
  }

  getStatusColor(status: number): string {
    switch (status) {
      case 0:
        return 'processing';
      case 1:
        return 'success';
      case 2:
        return 'default';
      default:
        return 'default';
    }
  }

  getStatusText(status: number): string {
    switch (status) {
      case 0:
        return 'Processing';
      case 1:
        return 'Active';
      case 2:
        return 'Inactive';
      default:
        return 'Unknown';
    }
  }
}
