import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { aesKey, aesVi } from '@app/config/constant';
import { PocBankAccountService } from '@app/core/services/http/poc-bank-account/poc-bank-account.service';
import { CbdcWalletService } from '@app/core/services/http/poc-wallet/cbdc-wallet/cbdc-wallet.service';
import { SearchCommonVO } from '@app/core/services/types';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { fnEncrypts, thousandthMark } from '@app/utils/tools';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-bank-account',
  templateUrl: './bank-account.component.html',
  styleUrl: './bank-account.component.less'
})
export class BankAccountComponent implements OnInit, AfterViewInit {
  @ViewChild('headerContent', { static: false })
  headerContent!: TemplateRef<NzSafeAny>;
  @ViewChild('headerExtra', { static: false })
  headerExtra!: TemplateRef<NzSafeAny>;
  @ViewChild('transactionIdTpl', { static: true })
  transactionIdTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('transactionAmountTpl', { static: true })
  transactionAmountTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('balanceTpl', { static: true })
  balanceTpl!: TemplateRef<NzSafeAny>;
  tableConfig!: AntTableConfig;
  dataList: NzSafeAny[] = [];
  currency: string = '';
  walletCurrency: string = '';
  topUpForm!: FormGroup;
  withdrawForm!: FormGroup;
  passwordForm!: FormGroup;
  info: any = [];
  walletInfo: any = [];
  walletBalanceList: any = [];
  walletAddress: any = '';
  balance: string = '';
  walletBalance: string = '';
  isVisibleTopUp: boolean = false;
  isVisibleWithdraw: boolean = false;
  isOkLoading: boolean = false;
  txType: number = 0;
  isLoading: boolean = false;
  centralBankId: any = '';
  isVisibleEnterPassword: boolean = false;
  tableQueryParams: NzTableQueryParams = {
    pageIndex: 1,
    pageSize: 10,
    sort: [],
    filter: []
  };
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumb: [],
    extra: '',
    desc: '',
    footer: ''
  };
  constructor(
    private cdr: ChangeDetectorRef,
    private pocBankAccountService: PocBankAccountService,
    private fb: FormBuilder,
    private cbdcWalletService: CbdcWalletService,
    private message: NzMessageService
  ) {}
  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: ``,
      breadcrumb: ['Fiat Money Account Query'],
      extra: this.headerExtra,
      desc: this.headerContent,
      footer: ''
    };
    this.topUpForm.get('amount')?.valueChanges.subscribe((item: number) => {
      this.topUpForm.get('fiatAmount')?.setValue(item);
    });
    this.withdrawForm.get('amount')?.valueChanges.subscribe((item: number) => {
      this.withdrawForm.get('fiatAmount')?.setValue(item);
    });
  }
  ngOnInit(): void {
    this.initTable();
    this.getOverviewInfo();
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
    } else if (control.value > Number(this.balance)) {
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
    } else if (control.value > Number(this.walletBalance)) {
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

  tableChangeDectction(): void {
    this.dataList = [...this.dataList];
    this.cdr.detectChanges();
  }

  tableLoading(isLoading: boolean): void {
    this.tableConfig.loading = isLoading;
    this.tableChangeDectction();
  }

  changePageSize(e: number): void {
    this.tableConfig.pageSize = e;
  }

  getOverviewInfo() {
    this.pocBankAccountService.getOverview().subscribe((res) => {
      if (res?.length > 0) {
        this.info = res[0];
        this.getWalletInfo(this.info?.currency);
        this.centralBankId = this.info?.centralBankId;
        if (this.info?.centralBankId) {
          this.getChange(this.tableQueryParams, this.info?.centralBankId);
        }
        this.cdr.markForCheck();
        return;
      }
    });
  }

  getWalletInfo(currency: string) {
    this.pocBankAccountService.getWalletInfo({ currency }).subscribe((res) => {
      this.walletInfo = res;
      this.cdr.markForCheck();
      return;
    });
  }

  getChange(value: any, centralBankId: any) {
    this.getDataList(value, centralBankId);
  }

  getDataList(e?: NzTableQueryParams, centralBankId?: any): void {
    this.tableConfig.loading = true;
    const params: SearchCommonVO<any> = {
      pageSize: this.tableConfig.pageSize!,
      pageNum: e?.pageIndex || this.tableConfig.pageIndex!,
      filters: {
        centralBankId
      }
    };
    this.pocBankAccountService
      .fetchList(params.pageNum, params.pageSize, params.filters)
      .pipe(
        finalize(() => {
          this.tableLoading(false);
        })
      )
      .subscribe((_: any) => {
        this.dataList = _.data.rows;
        this.tableConfig.total = _.data.page.total;
        this.tableConfig.pageIndex = params.pageNum;
        this.tableLoading(false);
        this.cdr.markForCheck();
      });
  }

  getTopUp() {
    this.currency = this.info.currency;
    this.balance = this.info.accountBalance;
    this.topUpForm
      .get('chainAccountAddress')
      ?.setValue(this.walletInfo?.walletAddress);
    this.topUpForm.get('commercialBank')?.setValue(this.info?.bankName);
    this.topUpForm.get('reserveAccount')?.setValue(this.info?.bankAccountNo);
    this.isVisibleTopUp = true;
  }

  getWithdraw() {
    this.walletCurrency = this.walletInfo?.currency;
    this.walletBalance = this.walletInfo?.balance;
    this.withdrawForm
      .get('chainAccountAddress')
      ?.setValue(this.walletInfo?.walletAddress);
    this.withdrawForm.get('commercialBank')?.setValue(this.info?.bankName);

    this.withdrawForm.get('reserveAccount')?.setValue(this.info?.bankAccountNo);
    this.isVisibleWithdraw = true;
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
      (this.txType === 1 ? this.walletInfo?.currency : this.info?.currency);
    this.cbdcWalletService
      .topUpOrWithdraw(params)
      .pipe(finalize(() => (this.isOkLoading = false)))
      .subscribe({
        next: (res) => {
          if (res) {
            this.isVisibleEnterPassword = false;
            this.message.success(
              this.txType === 1
                ? `Top-up ${amount} successful`
                : `withdraw ${amount} successful`,
              { nzDuration: 1000 }
            );
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
          title: 'Transaction ID',
          tdTemplate: this.transactionIdTpl,
          width: 150
        },
        {
          title: 'Transaction Time',
          field: 'transactionTime',
          pipe: 'timeStamp',
          notNeedEllipsis: true,
          width: 150
        },
        {
          title: 'Transaction Direction',
          field: 'txType',
          pipe: 'transactionDirection',
          width: 120
        },
        {
          title: 'Transaction Amount',
          tdTemplate: this.transactionAmountTpl,
          width: 150
        },
        {
          title: 'Bank Account Balance',
          tdTemplate: this.balanceTpl,
          width: 150
        },
        {
          title: 'Created On',
          field: 'createTime',
          notNeedEllipsis: true,
          pipe: 'timeStamp',
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
