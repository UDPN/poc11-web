import {
  Component,
  TemplateRef,
  ViewChild,
  AfterViewInit,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { LoginService } from '@app/core/services/http/login/login.service';
import { PocCapitalPoolService } from '@app/core/services/http/poc-capital-pool/poc-capital-pool.service';
import { CbdcWalletService } from '@app/core/services/http/poc-wallet/cbdc-wallet/cbdc-wallet.service';
import { ThemeService } from '@app/core/services/store/common-store/theme.service';
import { SearchCommonVO } from '@app/core/services/types';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { fnEncrypts, thousandthMark } from '@app/utils/tools';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { finalize } from 'rxjs';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { aesKey, aesVi } from '@app/config/constant';

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
  isVisibleTopUp: boolean = false;
  isVisibleWithdraw: boolean = false;
  isVisibleEnterPassword: boolean = false;
  isLoading: boolean = false;
  isOkLoading: boolean = false;
  topUpForm!: FormGroup;
  withdrawForm!: FormGroup;
  passwordForm!: FormGroup;
  searchParam: Partial<SearchParam> = {
    centralBankId: '',
    currency: '',
    region: '',
    createTime: [],
    state: ''
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
  txType: number = 0;
  balance: any = '';
  constructor(
    private cbdcWalletService: CbdcWalletService,
    private themesService: ThemeService,
    private dataService: LoginService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private message: NzMessageService,
    private location: Location,
    private router: Router
  ) {}
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
      chainAccountAddress: [null, [Validators.required]],
      amount: [null, [Validators.required, this.topUpAmountValidator]]
    });
    this.withdrawForm = this.fb.group({
      chainAccountAddress: [null, [Validators.required]],
      amount: [null, [Validators.required, this.withdrawAmountValidator]]
    });
    this.passwordForm = this.fb.group({
      pwd: [null, [Validators.required]]
    });
  }

  topUpAmountValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (!/^(([1-9]{1}\d*)|(0{1}))(\.\d{0,2})?$/.test(control.value)) {
      return { regular: true, error: true };
    }
    return {};
  };

  withdrawAmountValidator = (
    control: FormControl
  ): { [s: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (!/^(([1-9]{1}\d*)|(0{1}))(\.\d{0,2})?$/.test(control.value)) {
      return { regular: true, error: true };
    } else if (control.value > Number(this.balance)) {
      return { regular1: true, error: true };
    }
    return {};
  };

  getCentralBank() {
    this.cbdcWalletService.getCentralBankQuery().subscribe((res) => {
      this.centralBankList = res;
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

  getTopUp(currency: string, chainAccountAddress: string, balance: any) {
    this.currency = currency;
    this.balance = balance;
    this.topUpForm.get('chainAccountAddress')?.setValue(chainAccountAddress);
    this.isVisibleTopUp = true;
  }

  getWithdraw(currency: string, chainAccountAddress: string, balance: any) {
    this.currency = currency;
    this.balance = balance;
    this.withdrawForm.get('chainAccountAddress')?.setValue(chainAccountAddress);
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
    this.topUpForm.reset();
    this.withdrawForm.reset();
  }

  topUp() {
    this.isVisibleTopUp = false;
    this.isVisibleEnterPassword = true;
    this.txType = 1;
  }

  withdraw() {
    this.isVisibleWithdraw = false;
    this.isVisibleEnterPassword = true;
    this.txType = 2;
  }

  confirmEnterPassword() {
    this.isOkLoading = true;
    const code = fnEncrypts(this.passwordForm.getRawValue(), aesKey, aesVi);
    const params = {
      amount:
        this.txType === 1
          ? this.topUpForm.get('amount')?.value
          : this.withdrawForm.get('amount')?.value,
      password: code,
      txType: this.txType === 1 ? 1 : 2,
      walletAddress:
        this.txType === 1
          ? this.topUpForm.get('chainAccountAddress')?.value
          : this.withdrawForm.get('chainAccountAddress')?.value
    };
    const amount = thousandthMark(params.amount) + ' ' + this.currency;
    this.cbdcWalletService
      .topUpOrWithdraw(params)
      .pipe(finalize(() => (this.isOkLoading = false)))
      .subscribe({
        next: (res) => {
          if (res) {
            this.isVisibleEnterPassword = false;
            this.message
              .success(
                this.txType === 1
                  ? `Top-up ${amount} successful`
                  : `withdraw ${amount} successful`,
                { nzDuration: 1000 }
              )
              .onClose.subscribe(() => {
                this.getDataList();
              });
            if (this.txType === 1) {
              this.topUpForm.reset();
            } else {
              this.withdrawForm.reset();
            }
          }
          this.passwordForm.reset();
          this.isOkLoading = false;
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.isOkLoading = false;
          this.cdr.markForCheck();
        }
      });
  }

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
          title: 'Wallet Type',
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
          field: 'balance',
          pipe: 'toThousandthMark',
          width: 150
        },
        {
          title: 'Created On',
          field: 'createTime',
          pipe: 'timeStamp',
          notNeedEllipsis: true,
          width: 180
        },
        {
          title: 'Status',
          tdTemplate: this.statusTpl,
          width: 180
        },
        {
          title: 'Actions',
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
