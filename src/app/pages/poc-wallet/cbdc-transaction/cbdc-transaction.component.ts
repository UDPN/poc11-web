import {
  Component,
  TemplateRef,
  ViewChild,
  AfterViewInit,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '@app/core/services/http/login/login.service';
import { PocCapitalPoolService } from '@app/core/services/http/poc-capital-pool/poc-capital-pool.service';
import { ThemeService } from '@app/core/services/store/common-store/theme.service';
import { SearchCommonVO } from '@app/core/services/types';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { finalize } from 'rxjs';

interface SearchParam {
  transactionNo: string;
  from: string;
  to: string;
  type: string;
  currency: string;
  creationTime: any;
  status: string;
}

@Component({
  selector: 'app-cbdc-transaction',
  templateUrl: './cbdc-transaction.component.html',
  styleUrls: ['./cbdc-transaction.component.less']
})
export class CbdcTransactionComponent implements OnInit, AfterViewInit {
  @ViewChild('headerContent', { static: false })
  headerContent!: TemplateRef<NzSafeAny>;
  @ViewChild('headerExtra', { static: false })
  headerExtra!: TemplateRef<NzSafeAny>;
  @ViewChild('transactionNoTpl', { static: true })
  transactionNoTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('fromTpl', { static: true })
  fromTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('toTpl', { static: true })
  toTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('transactionHashTpl', { static: true })
  transactionHashTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('operationTpl', { static: true })
  operationTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('statusTpl', { static: true })
  statusTpl!: TemplateRef<NzSafeAny>;
  searchParam: Partial<SearchParam> = {
    creationTime: [],
    status: '',
    type: '',
    currency: ''
  };
  tableQueryParams: NzTableQueryParams = {
    pageIndex: 1,
    pageSize: 10,
    sort: [],
    filter: []
  };
  isVisible: boolean = false;
  isLoading: boolean = false;
  tableConfig!: AntTableConfig;
  dataList: NzSafeAny[] = [
    {
      transactionNo: 'F9160189-E5D5-4E64-1EEB-7DAAF4EF9999',
      from: '0x00000000000000',
      to: '0x11c0E25E62C1dB',
      type: 1,
      amount: '10000000',
      currency: 'w-CNY',
      creationTime: 1702952079,
      status: 1
    },
    {
      transactionNo: 'F9160188-E5D5-4E64-1EEB-7DAAF4EF8888',
      from: '0x33e0E25E62C1dBD32E505446062B26AECB00EU33',
      to: '0x9110c9FCE1C71B6CCF18Cb89E4A9e03Ac51c7777',
      type: 3,
      amount: '1000000',
      currency: 'w-EUR',
      creationTime: 1702952079,
      status: 2
    },
    {
      transactionNo: 'F9160187-E5D5-4E64-1EEB-7DAAF4EF7777',
      from: '0x11c0E25E62C1dBD32E505446062B26AECB00CN00',
      to: '0x77f0c9FCE1C71B6CCF18Cb89E4A9e03Ac59e1234',
      type: 3,
      amount: '716500',
      currency: 'w-CNY',
      creationTime: 1702952079,
      status: 2
    },
    {
      transactionNo: 'F9160186-E5D5-4E64-1EEB-7DAAF4EF6666',
      from: '0x11c0E25E62C1dBD32E505446062B26AECB00CN00',
      to: '0x77f0c9FCE1C71B6CCF18Cb89E4A9e03Ac59e1234',
      type: 4,
      amount: '1000000',
      currency: 'w-HKD',
      creationTime: 1702952079,
      status: 3
    },
    {
      transactionNo: 'F9160187-E5D5-4E64-1EEB-7DAAF4EF7777',
      from: '0x11c0E25E62C1dBD32E505446062B26AECB00CN00',
      to: '0x77f0c9FCE1C71B6CCF18Cb89E4A9e03Ac59e1234',
      type: 4,
      amount: '911779',
      currency: 'w-CNY',
      creationTime: 1702952079,
      status: 3
    },
  ];
  typeList: any[] = [];
  currencyList: any[] = [];
  statusList: any[] = [];
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumb: [],
    extra: '',
    desc: '',
    footer: ''
  };
  constructor(
    private pocCapitalPoolService: PocCapitalPoolService,
    private themesService: ThemeService,
    private dataService: LoginService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
  ) { }
  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: ``,
      breadcrumb: ['Wallet Management', 'CBDC Transaction'],
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
    this.searchParam = {};
    this.searchParam.creationTime = '';
    this.searchParam.status = '';
    this.getDataList(this.tableQueryParams);
  }



  changePageSize(e: number): void {
    this.tableConfig.pageSize = e;
  }

  getDataList(e?: NzTableQueryParams): void {
    // this.tableConfig.loading = true;
    // const params: SearchCommonVO<any> = {
    //   pageSize: this.tableConfig.pageSize!,
    //   pageNum: e?.pageIndex || this.tableConfig.pageIndex!,
    //   filters: this.searchParam
    // };
    // this.pocCapitalPoolService
    //   .fetchList()
    //   .pipe(
    //     finalize(() => {
    //       this.tableLoading(false);
    //     })
    //   )
    //   .subscribe((_: any) => {
    //     this.dataList = _.data;
    //     this.dataList.forEach((item: any, i: any) => {
    //       Object.assign(item, { key: (params.pageNum - 1) * 10 + i + 1 });
    //     });
    //     this.tableConfig.total = _?.resultPageInfo?.total;
    //     this.tableConfig.pageIndex = params.pageNum;
    //     this.tableLoading(false);
    //     this.cdr.markForCheck();
    //   });
  }

  private initTable(): void {
    this.tableConfig = {
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
          pipe: 'walletTransactionsType',
          width: 100
        },
        {
          title: 'Amount',
          field: 'amount',
          width: 100
        },
        {
          title: 'Currency',
          field: 'currency',
          width: 100
        },
        {
          title: 'Creation Time',
          field: 'creationTime',
          pipe: 'timeStamp',
          width: 150
        },
        {
          title: 'Status',
          tdTemplate: this.statusTpl,
          width: 150
        },
        {
          title: 'Action',
          tdTemplate: this.operationTpl,
          fixed: true,
          fixedDir: 'right',
          showAction: false,
          width: 150
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
