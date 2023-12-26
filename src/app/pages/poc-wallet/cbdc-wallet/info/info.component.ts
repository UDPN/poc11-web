import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '@app/core/services/http/common/common.service';
import { PocCapitalPoolService } from '@app/core/services/http/poc-capital-pool/poc-capital-pool.service';
import { CbdcWalletService } from '@app/core/services/http/poc-wallet/cbdc-wallet/cbdc-wallet.service';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';

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
  transactionList: NzSafeAny[] = [
    {
      transactionNo: 'F9160189-E5F9160189',
      from: '0x000000000000',
      to: '0x000000000000',
      type: 'Top-up',
      amount: '100,000.00',
      transactionHash: '0x0b219221ef20d9',
      transactionTime: 1654231412,
      status: 'Success'
    }
  ];
  list: any[] = [
    {
      amount: '200000000',
      currency: 'w-CNY',
      maxAmount: '500000000',
    },
    {
      amount: '200000000',
      currency: 'w-CNY',
      maxAmount: '100000000',
    }
  ];
  // detailsTabs = ['Basic Information', 'Transaction', 'Operation Record'];
  detailsTabs = ['Basic Information', 'Transaction'];
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
    this.recordTableConfig.pageSize = e;
  }

  private initTable(): void {
    this.recordTableConfig = {
      headers: [
        {
          title: 'Operation Type',
          field: '',
          width: 150
        },
        {
          title: 'Transaction Hash',
          field: '',
          width: 200
        },
        {
          title: 'Transaction Time',
          field: '',
          width: 150
        },
        {
          title: 'Status',
          field: '',
          width: 100
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
          width: 100
        },
        {
          title: 'Amount',
          field: 'amount',
          width: 100
        },
        {
          title: 'Transaction Hash',
          tdTemplate: this.transactionHashTpl,
          width: 100
        },
        {
          title: 'Transaction Time',
          field: 'transactionTime',
          pipe: 'timeStamp',
          width: 100
        },
        {
          title: 'Status',
          field: 'status',
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
