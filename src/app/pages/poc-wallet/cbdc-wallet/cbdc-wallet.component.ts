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
import { CbdcWalletService } from '@app/core/services/http/poc-wallet/cbdc-wallet/cbdc-wallet.service';
import { ThemeService } from '@app/core/services/store/common-store/theme.service';
import { SearchCommonVO } from '@app/core/services/types';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { thousandthMark } from '@app/utils/tools';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { finalize } from 'rxjs';

interface SearchParam {
  chainAccountAddress: string;
  centralBankId: string;
  region: string;
  currency: string;
  createTime: any;
  state: string;
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
  @ViewChild('statusTpl', { static: true })
  statusTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('centralBankTpl', { static: true })
  centralBankTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('walletAddressTpl', { static: true })
  walletAddressTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('balanceTpl', { static: true })
  balanceTpl!: TemplateRef<NzSafeAny>;
  isVisibleTopUp: boolean = false;
  isVisibleWithdraw: boolean = false;
  isVisibleEnterPassword: boolean = false;
  isLoading: boolean = false;
  topUpForm!: FormGroup;
  withdrawForm!: FormGroup;
  passwordForm!: FormGroup;
  searchParam: Partial<SearchParam> = {
    centralBankId: '',
    currency: '',
    region: '',
    createTime: [],
    state: '',
  };
  tableQueryParams: NzTableQueryParams = {
    pageIndex: 1,
    pageSize: 10,
    sort: [],
    filter: []
  };
  tableConfig!: AntTableConfig;
  dataList: NzSafeAny[] = [];
  centralBankList: any[] = [];
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumb: [],
    extra: '',
    desc: '',
    footer: ''
  };
  currency: any;
  constructor(
    private cbdcWalletService: CbdcWalletService,
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
    this.getCentralBank();
    this.topUpForm = this.fb.group({
      chainAccountAddress: ['1111', [Validators.required]],
      amount: ['', [Validators.required]],
    });
    this.withdrawForm = this.fb.group({
      chainAccountAddress: ['222', [Validators.required]],
      amount: ['', [Validators.required]],
    });
    this.passwordForm = this.fb.group({
      password: ['', [Validators.required]],
    });
  }

  getCentralBank() {
    this.cbdcWalletService.getCentralBankQuery().subscribe((res) => {
      this.centralBankList = res;
    })
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
    this.searchParam.centralBankId = '';
    this.searchParam.currency = '';
    this.searchParam.region = '';
    this.searchParam.createTime = [];
    this.searchParam.state = '';
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
    this.cbdcWalletService
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
          tdTemplate: this.walletAddressTpl,
          width: 200
        },
        {
          title: 'Central Bank',
          thTemplate: this.centralBankTpl,
          field: 'centralBankName',
          width: 260
        },
        {
          title: 'Region',
          field: 'region',
          pipe: 'region',
          width: 150
        },
        {
          title: 'Currency',
          field: 'currency',
          width: 150
        },
        {
          title: 'Balance',
          tdTemplate: this.balanceTpl,
          width: 150
        },
        {
          title: 'Creation Time',
          field: 'createTime',
          pipe: 'timeStamp',
          width: 180
        },
        {
          title: 'state',
          tdTemplate: this.statusTpl,
          pipe: 'walletStatus',
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
