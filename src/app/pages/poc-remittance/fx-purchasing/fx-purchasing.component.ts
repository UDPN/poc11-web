import { DatePipe } from '@angular/common';
import {
  Component,
  TemplateRef,
  ViewChild,
  AfterViewInit,
  OnInit,
  ChangeDetectorRef,
  OnDestroy
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { aesKey, aesVi } from '@app/config/constant';
import { LoginService } from '@app/core/services/http/login/login.service';
import { PocCapitalPoolService } from '@app/core/services/http/poc-capital-pool/poc-capital-pool.service';
import { FxPurchasingService } from '@app/core/services/http/poc-remittance/fx-purchasing/fxPurchasing.service';
import { ThemeService } from '@app/core/services/store/common-store/theme.service';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { fnEncrypts } from '@app/utils/tools';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Subscription, debounceTime, interval } from 'rxjs';

@Component({
  selector: 'app-fx-purchasing',
  templateUrl: './fx-purchasing.component.html',
  styleUrls: ['./fx-purchasing.component.less']
})
export class FxPurchasingComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('headerContent', { static: false })
  headerContent!: TemplateRef<NzSafeAny>;
  @ViewChild('headerExtra', { static: false })
  headerExtra!: TemplateRef<NzSafeAny>;
  @ViewChild('selectRadioTpl', { static: true })
  selectRadioTpl!: TemplateRef<NzSafeAny>;
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumb: [],
    extra: '',
    desc: '',
    footer: ''
  };
  validateForm!: FormGroup;
  nzLoading: boolean = false;
  isLoading: boolean = false;
  beneficialBankNameList: any[] = [];
  transactionWalletAddressList: any[] = [];
  tableConfig!: AntTableConfig;
  setOfCheckedId = new Set<string>();
  checkedItemComment: NzSafeAny[] = [];
  radioValue: any = 0;
  passwordForm!: FormGroup;
  dataList: NzSafeAny[] = [];
  isVisible: boolean = false;
  isVisibleEnterPassword: boolean = false;
  fxReceivingData: any[] = [];
  fxPurchaseData: any[] = [];
  purchCurrecy!: string;
  purchCurrecyList: any[] = [];
  reveingCurrecy!: string;
  showStatus = false;
  receivingWalletAddressList: any[] = [];
  purIndex: number = 0;
  transferTitle: string = '';
  receivingWalletAddressShow: string = '';
  timeString: any = '';
  timeSubscription!: Subscription;
  transactionWalletAddressArr: any[] = [];
  constructor(
    private pocCapitalPoolService: PocCapitalPoolService,
    private themesService: ThemeService,
    private dataService: LoginService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private fxPurchasingService: FxPurchasingService,
    private modal: NzModalService,
    private router: Router
  ) {}
  ngOnDestroy(): void {
    this.timeSubscription.unsubscribe();
  }
  ngAfterViewInit(): void {
    this.fromEventAmount();
    this.pageHeaderInfo = {
      title: ``,
      breadcrumb: ['Remittance Management', 'FX Purchasing'],
      extra: this.headerExtra,
      desc: this.headerContent,
      footer: ''
    };
  }

  ngOnInit() {
    let datePipe: DatePipe = new DatePipe('en-US');
    this.timeString = datePipe
      .transform(new Date().getTime() + 180000, 'MMMM d, y HH:mm:ss a zzzz')
      ?.replace('GMT', 'UTC');
    const interval$ = interval(180000);
    this.timeSubscription = interval$.subscribe((number) => {
      this.timeString = datePipe
        .transform(new Date().getTime() + 180000, 'MMMM d, y HH:mm:ss a zzzz')
        ?.replace('GMT', 'UTC');
      this.findExchange();
      this.cdr.markForCheck();
    });
    this.initData();
    this.validateForm = this.fb.group({
      receivingBankName: [null, [Validators.required]],
      receivingBankId: [null, [Validators.required]],
      receivingWalletAddress: [null, [Validators.required]],
      amount: [null, [Validators.required, this.amountValidator]],
      transactionWalletAddressId: [0, [Validators.required]],
      bankAccountId: ['', [Validators.required]],
      transactionWalletAddress: ['', [Validators.required]],
      availableBalance: [null, [Validators.required]],
      transactionBankName: [null, [Validators.required]]
    });
    this.passwordForm = this.fb.group({
      pwd: ['', [Validators.required]]
    });
  }

  amountValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (!/^(([1-9]{1}\d*)|(0{1}))(\.\d{0,2})?$/.test(control.value)) {
      return { regular: true, error: true };
    }
    return {};
  };

  initData() {
    this.fxPurchasingService.fetchFXPurchase().subscribe((res) => {
      this.fxPurchaseData = res;
      this.purchCurrecyList = this.fxPurchaseData;
      this.onPurchCurrecy(0);
      this.onPurchase(0);
    });
    this.fxPurchasingService.fetchFxReceiving().subscribe((res) => {
      this.fxReceivingData = [];
      res.forEach((item: any, i: number) => {
        this.fxReceivingData.push({
          bankId: item.bankId,
          bankName: item.bankName,
          currecy: item.digitalSymbol,
          currecySymbol: item.digitalCurrencyName,
          walletAddress: item.wallets
        });
      });
      this.onReceiving(0);
    });
  }
  onReceiving(e: any) {
    this.validateForm
      .get('receivingWalletAddress')
      ?.setValue(this.fxReceivingData[e]?.walletAddress[0]['bankAccountId']);
    this.validateForm
      .get('receivingBankName')
      ?.setValue(this.fxReceivingData[e]?.bankName);
    this.validateForm
      .get('receivingBankId')
      ?.setValue(this.fxReceivingData[e]?.bankId);
    this.reveingCurrecy = this.fxReceivingData[e]?.currecySymbol;
    this.receivingWalletAddressList = this.fxReceivingData[e]?.walletAddress;
    this.receivingWalletAddressShow = this.receivingWalletAddressList.filter(
      (item: any) =>
        item.bankAccountId === this.validateForm.value.receivingWalletAddress
    )[0]['chainAccountAddress'];

    if (this.reveingCurrecy === this.purchCurrecy) {
      this.setShowStatus(true);
    } else {
      this.findExchange();
      this.setShowStatus(false);
    }
  }
  onPurchase(e: any) {
    // const val = this.transactionWalletAddressArr.filter(
    //   (item: any) => item.bankAccountId === e
    // );

    this.validateForm
      .get('bankAccountId')
      ?.setValue(this.transactionWalletAddressArr[e]['bankAccountId']);
    this.validateForm
      .get('availableBalance')
      ?.setValue(this.transactionWalletAddressArr[e]['cbdcCount']);

    if (this.reveingCurrecy === this.purchCurrecy) {
      this.setShowStatus(true);
    } else {
      this.findExchange();
      this.setShowStatus(false);
    }
  }
  onReceivingWalletAddressChange(e: any) {
    if (this.reveingCurrecy === this.purchCurrecy) {
      this.setShowStatus(true);
    } else {
      this.findExchange();
      this.setShowStatus(false);
    }
  }
  onPurchCurrecy(e: number) {
    this.transactionWalletAddressArr =
      this.fxPurchaseData[e].remitterInformationExtendInfoList;
    this.purchCurrecy = this.fxPurchaseData[e].digitalCurrencyName;
    this.validateForm
      .get('transactionBankName')
      ?.setValue(this.fxPurchaseData[e].bankName);
    this.validateForm
      .get('availableBalance')
      ?.setValue(
        this.fxPurchaseData[e]['remitterInformationExtendInfoList'][0][
          'cbdcCount'
        ]
      );

    this.validateForm
      .get('transactionWalletAddress')
      ?.setValue(
        this.fxPurchaseData[e]['remitterInformationExtendInfoList'][0][
          'chainAccountAddress'
        ]
      );

    // this.validateForm
    //   .get('transactionWalletAddressId')
    //   ?.setValue(
    //     this.fxPurchaseData[e]['remitterInformationExtendInfoList'][0][
    //       'bankAccountId'
    //     ]
    //   );
    if (this.reveingCurrecy === this.purchCurrecy) {
      this.setShowStatus(true);
    } else {
      this.findExchange();
      this.setShowStatus(false);
    }
  }
  setShowStatus(status: boolean) {
    if (this.validateForm.get('amount')?.value === null) {
      this.showStatus = true;
      return;
    }
    this.showStatus = status;
    this.cdr.markForCheck();
  }
  findExchange() {
    if (
      this.reveingCurrecy !== this.purchCurrecy &&
      this.validateForm.get('amount')?.value !== null
    ) {
      this.setShowStatus(false);
      this.nzLoading = true;
      this.cdr.markForCheck();
      this.fxPurchasingService
        .fetchRateInfo({
          from: this.purchCurrecy,
          to: this.reveingCurrecy
        })
        .subscribe((res) => {
          let resultData: any[] = [];
          this.transferTitle =
            this.reveingCurrecy.replace('-UDPN', '') +
            '/' +
            this.purchCurrecy.replace('-UDPN', '') +
            ' Fx Rate';
          res.forEach((item: any) => {
            resultData.push({
              rateId: item.rateId,
              sp: item.provider,
              currency:
                '1 ' +
                item.from.replace('-UDPN', '') +
                '->' +
                item.to.replace('-UDPN', ''),
              currencyShow:
                '1 ' +
                item.from.replace('-UDPN', '') +
                '->' +
                item.rate +
                item.to.replace('-UDPN', ''),
              rate: item.rate,
              com: Number(
                item.smChargeModel === 0
                  ? (this.validateForm.get('amount')?.value / item.rate) *
                      item.smValue >
                    item.smMaxFee
                    ? item.smMaxFee
                    : (this.validateForm.get('amount')?.value / item.rate) *
                      item.smValue
                  : item.smValue
              ).toFixed(2),
              total: Number(
                this.validateForm.get('amount')?.value / item.rate +
                  (item.smChargeModel === 0
                    ? (this.validateForm.get('amount')?.value / item.rate) *
                        item.smValue >
                      item.smMaxFee
                      ? item.smMaxFee
                      : (this.validateForm.get('amount')?.value / item.rate) *
                        item.smValue
                    : item.smValue)
              ).toFixed(2)
            });
          });
          this.nzLoading = false;
          this.dataList = resultData.sort(this.compare('total'));
          this.checkedItemComment = [];
          this.dataList.forEach((item: any, index: number) => {
            if (this.radioValue === index) {
              this.checkedItemComment.push(item);
            }
          });
          this.cdr.markForCheck();
        });
    }
  }
  fromEventAmount() {
    this.validateForm
      .get('amount')
      ?.valueChanges.pipe(debounceTime(1000))
      .subscribe((_) => {
        this.findExchange();
      });
  }
  compare(p: string) {
    return function (m: any, n: any) {
      var a = m[p];
      var b = n[p];
      return a - b;
    };
  }
  onItemChecked(id: string, checked: boolean): void {
    this.updateCheckedSet(id, checked);
  }

  onChecked(): void {
    this.checkedItemComment = [];
    this.dataList.forEach((item: any, index: number) => {
      if (this.radioValue === index) {
        this.checkedItemComment.push(item);
      }
    });
  }

  updateCheckedSet(id: string, checked: boolean): void {
    this.setOfCheckedId.clear();
    this.dataList.forEach((item: any, index: number) => {
      if (checked) {
        this.setOfCheckedId.add(id);
        if (index.toString() === id) {
          this.checkedItemComment = [];
          this.checkedItemComment.push(item);
        }
      } else {
        this.setOfCheckedId.delete(id);
      }
    });
  }

  onSubmit() {
    console.log(this.validateForm.value);
    if (this.validateForm.valid) {
      this.isVisible = true;
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  cancelView() {
    this.isVisible = false;
  }

  confirmView() {
    // this.isVisible = false;
    this.isVisibleEnterPassword = true;
  }

  cancelEnterPassword() {
    this.isVisibleEnterPassword = false;
  }
  confirmEnterPassword() {
    this.isVisibleEnterPassword = false;
    this.isLoading = true;
    this.fxPurchasingService
      .transfer({
        fxPurchaseAmount: this.validateForm.get('amount')?.value,
        fxPurchasingInformation: '',
        fxReceivingWalletId: this.validateForm.get('receivingWalletAddress')
          ?.value,
        passWord: fnEncrypts(this.passwordForm.getRawValue(), aesKey, aesVi),
        rateId: this.checkedItemComment[0].rateId,
        transactionWalletId: this.validateForm.get('bankAccountId')?.value
      })
      .subscribe((res) => {
        if (res.code === 0) {
          this.modal
            .success({
              nzTitle: 'Success',
              nzContent: 'Transfer successful!'
            })
            .afterClose.subscribe((_) => {
              // this.initData();
              this.validateForm.reset();
              this.passwordForm.reset();
              this.router.navigateByUrl(
                '/poc/poc-remittance/transaction-record'
              );
            });
          this.isLoading = false;
          this.isVisible = false;
        } else {
          this.passwordForm.reset();
          this.isVisibleEnterPassword = true;
          this.isLoading = false;
        }
        this.cdr.markForCheck();
      });
  }
}
