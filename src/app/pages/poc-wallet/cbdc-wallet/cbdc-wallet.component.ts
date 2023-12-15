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
  walletAddress: string;
  centralBank: string;
  region: string;
  currency: string;
  creationTime: any;
  status: string;
}

@Component({
  selector: 'app-cbdc-wallet',
  templateUrl: './cbdc-wallet.component.html',
  styleUrls: ['./cbdc-wallet.component.less']
})
export class CbdcWalletComponent implements OnInit, AfterViewInit {
  @ViewChild('headerContent', { static: false })
  headerContent!: TemplateRef<NzSafeAny>;
  @ViewChild('headerExtra', { static: false })
  headerExtra!: TemplateRef<NzSafeAny>;
  @ViewChild('operationTpl', { static: true })
  operationTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('centralBankTpl', { static: true })
  centralBankTpl!: TemplateRef<NzSafeAny>;
  isVisibleTopUp: boolean = false;
  isVisibleWithdraw: boolean = false;
  isVisibleEnterPassword: boolean = false;
  isLoading: boolean = false;
  topUpForm!: FormGroup;
  withdrawForm!: FormGroup;
  passwordForm!: FormGroup;
  searchParam: Partial<SearchParam> = {
    creationTime: [],
    status: ''
  };
  tableQueryParams: NzTableQueryParams = {
    pageIndex: 1,
    pageSize: 10,
    sort: [],
    filter: []
  };
  tableConfig!: AntTableConfig;
  dataList: NzSafeAny[] = [
    {
      walletAddress: '0x1234567890',
      centralBank: 'Central Bank of China',
      region: 'China',
      currency: 'w-EUR',
      creationTime: '1654123212',
      balance: '10000000',
      status: 'Pending Approval',
    }
  ];
  centralBankList: any[] = [];
  regionList: any[] = [];
  currencyList: any[] = [];
  statusList: any[] = [];
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumb: [],
    extra: '',
    desc: '',
    footer: ''
  };
  currency: any;
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
      breadcrumb: ['Wallet Management', 'CBDC Wallet Management'],
      extra: this.headerExtra,
      desc: this.headerContent,
      footer: ''
    };
  }

  ngOnInit() {
    this.initTable();
    this.topUpForm = this.fb.group({
      walletAddress: ['1111', [Validators.required]],
      amount: ['', [Validators.required]],
    });
    this.withdrawForm = this.fb.group({
      walletAddress: ['222', [Validators.required]],
      amount: ['', [Validators.required]],
    });
    this.passwordForm = this.fb.group({
      password: ['', [Validators.required]],
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

  getTopUp(currency: string) {
    this.currency = currency;
    this.isVisibleTopUp = true;
  }

  getWithdraw(currency: string) {
    this.currency = currency;
    this.isVisibleWithdraw = true;
  }

  cancelTopUp() {
    this.isVisibleTopUp = false;
    this.topUpForm.reset();
  }

  cancelWithdraw() {
    this.isVisibleWithdraw = false;
    this.withdrawForm.reset();
  }

  cancelEnterPassword() {
    this.isVisibleEnterPassword = false;
    this.passwordForm.reset();
  }

  topUp() {
    this.isVisibleTopUp = false;
    this.isVisibleEnterPassword = true;
    this.topUpForm.reset();
  }

  withdraw() {
    this.isVisibleWithdraw = false;
    this.isVisibleEnterPassword = true;
    this.withdrawForm.reset();
  }

  confirmEnterPassword() {}
  
  private initTable(): void {
    this.tableConfig = {
      headers: [
        {
          title: 'Wallet Address',
          field: 'walletAddress',
          width: 200
        },
        {
          title: 'Central Bank',
          thTemplate: this.centralBankTpl,
          field: 'centralBank',
          width: 200
        },
        {
          title: 'Region',
          field: 'region',
          width: 300
        },
        {
          title: 'Currency',
          field: 'currency',
          width: 200
        },
        {
          title: 'Balance',
          field: 'balance',
          width: 180
        },
        {
          title: 'Creation Time',
          field: 'creationTime',
          pipe: 'timeStamp',
          width: 180
        },
        {
          title: 'Status',
          field: 'status',
          width: 180
        },
        {
          title: 'Action',
          tdTemplate: this.operationTpl,
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
}
