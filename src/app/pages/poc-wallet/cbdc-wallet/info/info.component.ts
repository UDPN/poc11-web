import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '@app/core/services/http/common/common.service';
import { PocCapitalPoolService } from '@app/core/services/http/poc-capital-pool/poc-capital-pool.service';
import { CbdcWalletService } from '@app/core/services/http/poc-wallet/cbdc-wallet/cbdc-wallet.service';
import { SearchCommonVO } from '@app/core/services/types';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.less']
})
export class InfoComponent implements OnInit {
  @ViewChild('transactionNoTpl', { static: true })
  transactionNoTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('transactionHashTpl', { static: true })
  transactionHashTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('fromTpl', { static: true })
  fromTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('toTpl', { static: true })
  toTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('statusTpl', { static: true })
  statusTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('amountTpl', { static: true })
  amountTpl!: TemplateRef<NzSafeAny>;
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumbs: [],
    extra: '',
    desc: '',
    footer: ''
  };
  info: any = {};
  agreementUrl: any = '';
  recordTableConfig!: AntTableConfig;
  transactionTableConfig!: AntTableConfig;
  recordList: NzSafeAny[] = [];
  transactionList: NzSafeAny[] = [];
  detailsTabs = ['Basic Information', 'Transactions', 'Operation Records'];
  summaryCurrency: string = '';
  summaryInfo: any = {};
  summaryRegion: any = 0;
  constructor(
    public routeInfo: ActivatedRoute,
    private commonService: CommonService,
    private cdr: ChangeDetectorRef,
    private cbdcWalletService: CbdcWalletService
  ) { }

  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: `Details`,
      breadcrumbs: [
        {
          name: 'Wallet Management'
        },
        {
          name: 'CBDC Wallet Management',
          url: '/poc/poc-wallet/cbdc-wallet'
        },
        { name: 'Details' }
      ],
      extra: '',
      desc: '',
      footer: ''
    };
  }

  ngOnInit() {
    this.initTable();
    this.getBasicInfo();
  }

  tabIndexChange(event: any) {
    if (event === 0) {
      this.getBasicInfo();
    } else if (event === 1) {
      this.getTransactionSummary();
      this.getTransactionList();
    } else {
      this.getRecordList();
    }
  }

  getBasicInfo() {
    this.routeInfo.queryParams.subscribe(params => {
      this.cbdcWalletService.getBasicInfo({ bankAccountId: params['bankAccountId'] }).subscribe(res => {
        this.info = res;
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      });
    });
  }

  getTransactionSummary() {
    this.routeInfo.queryParams.subscribe(params => {
      this.summaryCurrency = params['currency'];
      this.summaryRegion = params['region'];
      this.cbdcWalletService.getTransactionSummary({ bankAccountId: params['bankAccountId'] }).subscribe(res => {
        this.summaryInfo = res;
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      });
    });
  }

  changePageSize(e: number): void {
    this.transactionTableConfig.pageSize = e;
  }

  recordChangePageSize(e: number): void {
    this.recordTableConfig.pageSize = e;
  }
  
  recordTableChangeDectction(): void {
    this.recordList = [...this.recordList];
    this.cdr.detectChanges();
  }

  recordTableLoading(isLoading: boolean): void {
    this.recordTableConfig.loading = isLoading;
    this.recordTableChangeDectction();
  }

  tableChangeDectction(): void {
    this.transactionList = [...this.transactionList];
    this.cdr.detectChanges();
  }

  tableLoading(isLoading: boolean): void {
    this.transactionTableConfig.loading = isLoading;
    this.tableChangeDectction();
  }

  getTransactionList(e?: NzTableQueryParams): void {
    this.transactionTableConfig.loading = true;
    this.routeInfo.queryParams.subscribe(param => {
      const params: SearchCommonVO<any> = {
        pageSize: this.transactionTableConfig.pageSize!,
        pageNum: e?.pageIndex || this.transactionTableConfig.pageIndex!,
        filters: {
          bankAccountId: param['bankAccountId']
        }
      };
      this.cbdcWalletService
        .getTransactionList(params.pageNum, params.pageSize, params.filters)
        .pipe(
          finalize(() => {
            this.tableLoading(false);
          })
        )
        .subscribe((_: any) => {
          this.transactionList = _.data?.rows;
          this.transactionList.forEach(item => {
            Object.assign(item, { chainAccountAddress: param['chainAccountAddress'] });
          })
          this.transactionTableConfig.total = _.data.page.total;
          this.transactionTableConfig.pageIndex = params.pageNum;
          this.tableLoading(false);
          this.cdr.markForCheck();
        });
    });
  }

  getRecordList(e?: NzTableQueryParams): void {
    this.recordTableConfig.loading = true;
    this.routeInfo.queryParams.subscribe(param => {
      const params: SearchCommonVO<any> = {
        pageSize: this.recordTableConfig.pageSize!,
        pageNum: e?.pageIndex || this.recordTableConfig.pageIndex!,
        filters: {
          bankAccountId: param['bankAccountId']
        }
      };
      this.cbdcWalletService
        .getRecordList(params.pageNum, params.pageSize, params.filters)
        .pipe(
          finalize(() => {
            this.recordTableLoading(false);
          })
        )
        .subscribe((_: any) => {
          this.recordList = _.data?.rows;
          this.recordTableConfig.total = _.data.page.total;
          this.recordTableConfig.pageIndex = params.pageNum;
          this.recordTableLoading(false);
          this.cdr.markForCheck();
        });
    });
  }


  private initTable(): void {
    this.recordTableConfig = {
      headers: [
        {
          title: 'Operation Type',
          field: 'type',
          pipe: 'operationType',
          width: 100
        },
        {
          title: 'Transaction Hash',
          field: 'txHash',
          pipe: 'nullValue',
          width: 280
        },
        {
          title: 'Transaction Time',
          field: 'txTime',
          pipe: 'timeStamp',
          width: 150
        },
        {
          title: 'Status',
          field: 'state',
          pipe: 'operationStatus',
          width: 150
        }
      ],
      total: 0,
      showCheckbox: false,
      loading: false,
      pageSize: 10,
      pageIndex: 1
    };

    this.transactionTableConfig = {
      headers: [
        {
          title: 'Transaction No.',
          tdTemplate: this.transactionNoTpl,
          width: 100
        },
        {
          title: 'From',
          tdTemplate: this.fromTpl,
          width: 100
        },
        {
          title: 'To',
          tdTemplate: this.toTpl,
          width: 100
        },
        {
          title: 'Type',
          field: 'type',
          pipe: 'walletInfoType',
          width: 100
        },
        {
          title: 'Amount',
          tdTemplate: this.amountTpl,
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
          title: 'Status',
          tdTemplate: this.statusTpl,
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
