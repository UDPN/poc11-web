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
  @ViewChild('walletAdressTitleTpl', { static: true })
  walletAdressTitleTpl!: TemplateRef<NzSafeAny>;
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
  reserveBalance: any = '';
  reserveCurrency: any = '';
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
    this.topUpForm.get('amount')?.valueChanges.subscribe((item: number) => {
      this.topUpForm.get('fiatAmount')?.setValue(item);
    });
    this.withdrawForm.get('amount')?.valueChanges.subscribe((item: number) => {
      this.withdrawForm.get('fiatAmount')?.setValue(item);
    });
    this.pageHeaderInfo = {
      title: ``,
      breadcrumb: ['Wallet Management', 'Wallet Creation'],
      extra: this.headerExtra,
      desc: this.headerContent,
      footer: ''
    };
  }

  ngOnInit() {
    this.initTable();
    this.getCentralBank();
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

  // getFiatAmount(amount: number) {
  //   if (!amount) {
  //     setTimeout(() => {
  //       this.topUpForm.get('fiatAmount')?.setValue('');
  //       this.withdrawForm.get('fiatAmount')?.setValue('');
  //     }, 100);
  //   } else {
  //     this.cbdcWalletService.getFiatAmount({ amount }).subscribe((res) => {
  //       this.topUpForm.get('fiatAmount')?.setValue(res.cbdcAmount);
  //       this.withdrawForm.get('fiatAmount')?.setValue(res.cbdcAmount);
  //     });
  //   }
  // }

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
        {
          title: 'Wallet Address',
          thTemplate: this.walletAdressTitleTpl,
          tdTemplate: this.walletAddressTpl,
          notNeedEllipsis: true,
          width: 200
        },
        {
          title: 'Custodian Bank',
          thTemplate: this.centralBankTpl,
          field: 'centralBankName',
          notNeedEllipsis: true,
          width: 200
        },
        {
          title: 'Region',
          field: 'region',
          pipe: 'region',
          notNeedEllipsis: true,
          width: 120
        },
        {
          title: 'Wallet Type',
          field: 'walletType',
          pipe: 'walletType',
          notNeedEllipsis: true,
          width: 150
        },
        {
          title: 'Token Currency',
          field: 'currency',
          notNeedEllipsis: true,
          width: 150
        },
        {
          title: 'Balance',
          field: 'balance',
          pipe: 'toThousandthMark',
          notNeedEllipsis: true,
          width: 120
        },
        {
          title: 'Created on',
          field: 'createTime',
          pipe: 'timeStamp',
          notNeedEllipsis: true,
          width: 180
        },
        {
          title: 'Status',
          tdTemplate: this.statusTpl,
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
          width: 250
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
