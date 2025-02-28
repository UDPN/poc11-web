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
  UntypedFormControl,
  Validators
} from '@angular/forms';
import { aesKey, aesVi } from '@app/config/constant';
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

interface SearchParam {
  nodeName: string;
  nodeCode: string;
  status: string;
  key: string;
  bizSN: string;
  nodeType: string;
  nodeTitle: string;
  remark: string;
  creation: any;
  fromVn: string;
}

@Component({
  selector: 'app-capital-pool',
  templateUrl: './capital-pool.component.html',
  styleUrls: ['./capital-pool.component.less']
})
export class CapitalPoolComponent implements OnInit, AfterViewInit {
  @ViewChild('headerContent', { static: false })
  headerContent!: TemplateRef<NzSafeAny>;
  @ViewChild('headerExtra', { static: false })
  headerExtra!: TemplateRef<NzSafeAny>;
  @ViewChild('operationTpl', { static: true })
  operationTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('capitalTpl', { static: true })
  capitalTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('balanceTpl', { static: true })
  balanceTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('authorizedTpl', { static: true })
  authorizedTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('authorTpl', { static: true })
  authorTpl!: TemplateRef<NzSafeAny>;
  searchParam: Partial<SearchParam> = {
    creation: [],
    status: ''
  };
  tableQueryParams: NzTableQueryParams = {
    pageIndex: 1,
    pageSize: 10,
    sort: [],
    filter: []
  };
  tabIndex: number = 0;
  capitalPoolTabs = ['Capital Pool Information', 'Application Information'];
  isVisible: boolean = false;
  isLoading: boolean = false;
  editValidateForm!: FormGroup;
  editInfo: any = {};
  reg: string = '';
  isVisibleTopUp: boolean = false;
  isVisibleWithdraw: boolean = false;
  isVisibleEnterPassword: boolean = false;
  topUpForm!: FormGroup;
  withdrawForm!: FormGroup;
  passwordForm!: FormGroup;
  currency: any;
  txType: number = 0;
  balance: any = '';
  reserveCurrency: any = '';
  reserveBalance: any = '';
  isOkLoading: boolean = false;
  constructor(
    private pocCapitalPoolService: PocCapitalPoolService,
    private themesService: ThemeService,
    private cbdcWalletService: CbdcWalletService,
    private dataService: LoginService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    public message: NzMessageService
  ) {}
  tableConfig!: AntTableConfig;
  dataList: NzSafeAny[] = [];
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumb: [],
    extra: '',
    desc: '',
    footer: ''
  };

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
    (this.searchParam.creation = ''), (this.searchParam.status = '');
    this.getDataList(this.tableQueryParams);
  }

  ngAfterViewInit(): void {
    this.topUpForm.get('amount')?.valueChanges.subscribe((item: number) => {
      this.topUpForm.get('fiatAmount')?.setValue(item);
      // this.getFiatAmount(item);
    });
    this.withdrawForm.get('amount')?.valueChanges.subscribe((item: number) => {
      this.withdrawForm.get('fiatAmount')?.setValue(item);
      // this.getFiatAmount(item);
    });
    this.pageHeaderInfo = {
      title: ``,
      breadcrumb: ['Capital Pool Management'],
      extra: this.headerExtra,
      desc: this.headerContent,
      footer: ''
    };
  }

  ngOnInit() {
    this.initTable();
    if (sessionStorage.getItem('tabNumber') === '1') {
      this.tabIndex = 1;
      sessionStorage.removeItem('tabNumber');
    } else {
      this.tabIndex = 0;
    }
    this.editValidateForm = this.fb.group({
      status: [true, [Validators.required]],
      amount: ['', [Validators.required, this.amountValidator]]
    });
    this.topUpForm = this.fb.group({
      commercialBank: [null, [Validators.required]],
      chainAccountAddress: [null, [Validators.required]],
      reserveAccount: [
        null,
        [Validators.required, this.reserveAccountValidator]
      ],
      amount: [null, [Validators.required, this.topUpAmountValidator]],
      fiatAmount: [null, [Validators.required]]
    });
    this.withdrawForm = this.fb.group({
      commercialBank: [null, [Validators.required]],
      chainAccountAddress: [null, [Validators.required]],
      reserveAccount: [
        null,
        [Validators.required, this.reserveAccountValidator]
      ],
      amount: [null, [Validators.required, this.withdrawAmountValidator]],
      fiatAmount: [null, [Validators.required]]
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
    } else if (control.value > Number(this.reserveBalance)) {
      return { regular1: true, error: true };
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

  transactionReferenceNoValidator = (
    control: FormControl
  ): { [s: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (!/^([a-zA-Z0-9\s-._#!@￥%&*?/]{1,100})$/.test(control.value)) {
      return { regular: true, error: true };
    } else if (control.value.length > 50) {
      return { regular1: true, error: true };
    }
    return {};
  };

  reserveAccountValidator = (
    control: FormControl
  ): { [s: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (!/^(([0-9]\d*))?$/.test(control.value)) {
      return { regular: true, error: true };
    } else if (control.value.length > 30) {
      return { regular1: true, error: true };
    }
    return {};
  };

  amountValidator = (control: FormControl): { [s: string]: boolean } => {
    this.reg =
      this.editInfo.currencyPrecision > 0
        ? `^[+]?\\d+(?:\\.\\d{1,` + this.editInfo.currencyPrecision + `})?$`
        : '';
    if (!control.value) {
      return { error: true, required: true };
    } else if (Validators.pattern(this.reg)(control)) {
      return { regular: true, error: true };
    }
    return {};
  };

  // getFiatAmount(amount: any) {
  //   if (!amount) {
  //     setTimeout(() => {
  //       this.topUpForm.get('fiatAmount')?.setValue('');
  //       this.withdrawForm.get('fiatAmount')?.setValue('');
  //     }, 100);
  //   } else {
  //     this.pocCapitalPoolService.getFiatAmount({ amount }).subscribe((res) => {
  //       this.topUpForm.get('fiatAmount')?.setValue(res.cbdcAmount);
  //       this.withdrawForm.get('fiatAmount')?.setValue(res.cbdcAmount);
  //     });
  //   }
  // }

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
    this.pocCapitalPoolService
      .fetchList()
      .pipe(
        finalize(() => {
          this.tableLoading(false);
        })
      )
      .subscribe((_: any) => {
        this.dataList = _.data;
        this.dataList.forEach((item: any, i: any) => {
          Object.assign(item, { key: (params.pageNum - 1) * 10 + i + 1 });
        });
        this.tableConfig.total = _?.resultPageInfo?.total;
        this.tableConfig.pageIndex = params.pageNum;
        this.tableLoading(false);
        this.cdr.markForCheck();
      });
  }

  onChangeTab(event: any) {
    if (event === 1) {
      sessionStorage.setItem('tabNumber', '1');
    } else {
      sessionStorage.removeItem('tabNumber');
    }
  }

  getEdit(
    capitalPoolCurrency: string,
    capitalPoolAddress: string,
    currencyPrecision: number
  ) {
    this.isVisible = true;
    this.editInfo = {
      capitalPool: capitalPoolCurrency,
      capitalPoolAddress,
      currencyPrecision
    };
  }

  cancelEdit() {
    this.isVisible = false;
    this.editValidateForm.get('amount')?.reset();
  }

  edit() {
    this.isLoading = true;
    const params = {
      amount: this.editValidateForm.get('amount')?.value,
      chainAccountAddress: this.editInfo.capitalPoolAddress,
      currency: this.editInfo.capitalPool
    };
    this.pocCapitalPoolService
      .edit(params)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (res) => {
          this.isVisible = false;
          this.editValidateForm.get('amount')?.reset();
          if (res) {
            this.message
              .success('Edit completed', { nzDuration: 1000 })
              .onClose.subscribe(() => {
                this.getDataList();
              });
          }
          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.isLoading = false;
          this.cdr.markForCheck();
        }
      });
  }

  getTopUp(
    reserveCurrency: string,
    chainAccountAddress: string,
    reserveAccount: any,
    reserveBalance: any,
    currency: any
  ) {
    this.reserveCurrency = reserveCurrency;
    this.reserveBalance = reserveBalance;
    this.currency = currency;
    this.topUpForm.get('chainAccountAddress')?.setValue(chainAccountAddress);
    this.topUpForm
      .get('commercialBank')
      ?.setValue(sessionStorage.getItem('systemName'));
    this.topUpForm.get('reserveAccount')?.setValue(reserveAccount);
    this.isVisibleTopUp = true;
  }

  getWithdraw(
    currency: string,
    chainAccountAddress: string,
    balance: any,
    reserveAccount: any,
    reserveCurrency: any
  ) {
    this.reserveCurrency = reserveCurrency;
    this.currency = currency;
    this.balance = balance;
    this.withdrawForm.get('chainAccountAddress')?.setValue(chainAccountAddress);
    this.withdrawForm
      .get('commercialBank')
      ?.setValue(sessionStorage.getItem('systemName'));
    this.withdrawForm.get('reserveAccount')?.setValue(reserveAccount);
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
    const params: any = {
      // currency: this.currency,
      amount:
        this.txType === 1
          ? this.topUpForm.get('amount')?.value
          : this.withdrawForm.get('amount')?.value,
      fiatAmount:
        this.txType === 1
          ? this.topUpForm.get('fiatAmount')?.value
          : this.withdrawForm.get('fiatAmount')?.value,
      password: code,
      txType: this.txType === 1 ? 1 : 2,
      reserveAccount:
        this.txType === 1
          ? this.topUpForm.get('reserveAccount')?.value
          : this.withdrawForm.get('reserveAccount')?.value,
      walletAddress:
        this.txType === 1
          ? this.topUpForm.get('chainAccountAddress')?.value
          : this.withdrawForm.get('chainAccountAddress')?.value
    };
    if (this.txType === 1) {
      params['transactionReferenceNo'] = this.topUpForm.get(
        'transactionReferenceNo'
      )?.value;
    }
    const amount =
      thousandthMark(params.amount) +
      ' ' +
      (this.txType === 1 ? this.currency : this.reserveCurrency);
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
        // {
        //   title: 'Application No.',
        //   field: '',
        //   width: 200
        // },
        {
          title: 'Capital Pool',
          tdTemplate: this.capitalTpl,
          notNeedEllipsis: true,
          width: 200
        },
        {
          title: 'Account/Wallet',
          field: 'capitalPoolAddress',
          notNeedEllipsis: true,
          width: 300
        },
        {
          title: 'Balance',
          tdTemplate: this.balanceTpl,
          notNeedEllipsis: true,
          width: 200
        },
        {
          title: 'Authorized',
          tdTemplate: this.authorTpl,
          notNeedEllipsis: true,
          width: 200
        },
        {
          title: 'Onboarded On',
          field: 'createDate',
          pipe: 'timeStamp',
          notNeedEllipsis: true,
          width: 180
        },
        {
          title: 'Pre-authorized Debit',
          tdTemplate: this.authorizedTpl,
          notNeedEllipsis: true,
          width: 180
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
}
