import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { LiquidityPoolService } from '@app/core/services/http/poc-liquidity/liquidity-pool/liquidity-pool.service';
import { SearchCommonVO } from '@app/core/services/types';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { finalize } from 'rxjs';
import { ActivateModalComponent } from './activate-modal/activate-modal.component';
import { ReauthorizeModalComponent } from './reauthorize-modal/reauthorize-modal.component';

interface SearchParam {
  liquidityPoolAddress: string;
  token: string;
  createdTime: any[];
  status: number | string;
  minBalanceReq: string;
}

@Component({
  selector: 'app-liquidity-pool',
  templateUrl: './liquidity-pool.component.html',
  styleUrls: ['./liquidity-pool.component.less']
})
export class LiquidityPoolComponent implements OnInit, AfterViewInit {
  @ViewChild('headerContent', { static: false })
  headerContent!: TemplateRef<NzSafeAny>;
  @ViewChild('headerExtra', { static: false })
  headerExtra!: TemplateRef<NzSafeAny>;
  @ViewChild('operationTpl', { static: true })
  operationTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('statusTpl', { static: true })
  statusTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('addressTpl', { static: true })
  addressTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('minBalanceTpl', { static: true })
  minBalanceTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('minBalanceHeaderTpl', { static: true })
  minBalanceHeaderTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('walletBalanceTpl', { static: true })
  walletBalanceTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('authorizedAmountTpl', { static: true })
  authorizedAmountTpl!: TemplateRef<NzSafeAny>;

  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumb: [],
    extra: '',
    desc: '',
    footer: ''
  };
  searchParam: Partial<SearchParam> = {
    liquidityPoolAddress: '',
    token: '',
    status: '',
    createdTime: [],
    minBalanceReq: ''
  };
  tableQueryParams: NzTableQueryParams = {
    pageIndex: 1,
    pageSize: 10,
    sort: [],
    filter: []
  };
  tableConfig!: AntTableConfig;
  dataList: NzSafeAny[] = [];

  tokenList: Array<{ tokenId: number; tokenName: string; minBalance: string }> = [];
  comments: string = '';

  constructor(
    private liquidityPoolService: LiquidityPoolService,
    private cdr: ChangeDetectorRef,
    private message: NzMessageService,
    private modal: NzModalService,
    private modalService: NzModalService
  ) {}

  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: ``,
      breadcrumb: ['Liquidity Management', 'Liquidity Pool Management'],
      extra: this.headerExtra,
      desc: this.headerContent,
      footer: ''
    };
  }

  ngOnInit() {
    this.initTable();
    this.getTokenList();
  }

  getTokenList(): void {
    this.liquidityPoolService.getTokenList().subscribe({
      next: (res) => {
        if (res.code === 0) {
          this.tokenList = res.data;
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
      liquidityPoolAddress: '',
      token: '',
      status: '',
      createdTime: [],
      minBalanceReq: ''
    };
    this.getDataList(this.tableQueryParams);
  }

  changePageSize(e: number): void {
    this.tableConfig.pageSize = e;
  }

  getDataList(e?: NzTableQueryParams): void {
    this.tableConfig.loading = true;
    const params: SearchCommonVO<any> = {
      pageSize: this.tableConfig.pageSize!,
      pageNum: e?.pageIndex || this.tableConfig.pageIndex!,
      filters: this.searchParam
    };
    this.liquidityPoolService
      .fetchList(params.pageNum, params.pageSize, params.filters)
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
            this.message.error(
              res.message || 'Failed to fetch liquidity pool list'
            );
          }
        },
        error: () => {
          this.message.error('Failed to fetch liquidity pool list');
          this.tableLoading(false);
        }
      });
  }

  private initTable(): void {
    this.tableConfig = {
      headers: [
        {
          title: 'Liquidity Pool Address',
          field: 'liquidityPollAddress',
          tdTemplate: this.addressTpl,
          notNeedEllipsis: true,
          width: 180
        },
        {
          title: 'Token',
          field: 'token',
          notNeedEllipsis: true,
          width: 100
        },
        {
          title: 'Wallet Balance',
          field: 'walletBalance',
          tdTemplate: this.walletBalanceTpl,
          notNeedEllipsis: true,
          width: 120
        },
        {
          title: 'Authorized Amount',
          field: 'authorizedAmount',
          tdTemplate: this.authorizedAmountTpl,
          notNeedEllipsis: true,
          width: 120
        },
        {
          title: 'Min Balance Req.',
          thTemplate: this.minBalanceHeaderTpl,
          field: 'minBalance',
          tdTemplate: this.minBalanceTpl,
          notNeedEllipsis: true,
          width: 150
        },
        {
          title: 'Created on',
          field: 'createdTime',
          pipe: 'timeStamp',
          notNeedEllipsis: true,
          width: 260
        },
        {
          title: 'Status',
          field: 'status',
          tdTemplate: this.statusTpl,
          notNeedEllipsis: true,
          width: 100
        },
        {
          title: 'Actions',
          tdTemplate: this.operationTpl,
          notNeedEllipsis: true,
          fixed: true,
          fixedDir: 'right',
          showAction: false,
          width: 180
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
        return 'error';
      case 3:
        return 'default';
      default:
        return 'default';
    }
  }

  getStatusText(status: number): string {
    switch (status) {
      case 0:
        return 'Progress';
      case 1:
        return 'Successful';
      case 2:
        return 'Failed';
      case 3:
        return 'Disabled';
      default:
        return 'Unknown';
    }
  }

  showActivateModal(
    liquidityPoolAddress: string,
    token: string,
    liquidityPoolId: number,
    status: number
  ): void {
    if(status === 1){
      this.liquidityPoolService.rateCheck({liquidityPoolId:liquidityPoolId}).subscribe({
        next: (res) => {
          if(!res.data){
            this.modalService.warning({
              nzTitle: 'Warning ',
              nzContent: 'The Liquidity Pool Address  cannot be deactivated due to existing associated token pairs.Please deactivate them before proceeding.'
            });
          }else{
            const modal = this.modal.create<ActivateModalComponent>({
              nzTitle:
                status === 1 ? 'Deactivate Liquidity Pool' : 'Activate Liquidity Pool',
              nzContent: ActivateModalComponent,
              nzWidth: 600,
              nzData: {
                liquidityPoolAddress,
                token,
                liquidityPoolId,
                status
              }
            });
        
            modal.afterClose.subscribe((comments: string) => {
              if (comments) {
                this.message.success(
                  `Liquidity Pool ${
                    status === 1 ? 'deactivated' : 'activated'
                  } successfully`
                );
                this.getDataList(this.tableQueryParams);
              }
            });

          }
        }
      });
      return;
    }
    const modal = this.modal.create<ActivateModalComponent>({
      nzTitle:
        status === 1 ? 'Deactivate Liquidity Pool' : 'Activate Liquidity Pool',
      nzContent: ActivateModalComponent,
      nzWidth: 600,
      nzData: {
        liquidityPoolAddress,
        token,
        liquidityPoolId,
        status
      }
    });

    modal.afterClose.subscribe((comments: string) => {
      if (comments) {
        this.message.success(
          `Liquidity Pool ${
            status === 1 ? 'deactivated' : 'activated'
          } successfully`
        );
        this.getDataList(this.tableQueryParams);
      }
    });
  }

  showReauthorizeModal(
    liquidityPoolAddress: string,
    token: string,
    liquidityPoolId: number,
    balance: string,
    minBalanceReq: string,
    authorizedAmount: string
  ): void {
    console.log(
      liquidityPoolAddress,
      token,
      liquidityPoolId,
      balance,
      minBalanceReq,
      authorizedAmount
    );
    const modal = this.modal.create<ReauthorizeModalComponent>({
      nzTitle: undefined,
      nzContent: ReauthorizeModalComponent,
      nzWidth: 520,
      nzFooter: null,
      nzClassName: 'reauthorize-modal',
      nzData: {
        liquidityPoolAddress,
        token,
        liquidityPoolId,
        balance,
        minBalanceReq,
        authorizedAmount
      }
    });

    modal.afterClose.subscribe((result) => {
      if (result) {
        this.message.success('Reauthorize successfully');
        this.getDataList(this.tableQueryParams);
      }
    });
  }
}
