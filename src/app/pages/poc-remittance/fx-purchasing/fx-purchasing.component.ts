import { DatePipe } from '@angular/common';
import {
  Component,
  TemplateRef,
  ViewChild,
  AfterViewInit,
  OnInit,
  ChangeDetectorRef,
  OnDestroy,
  HostListener
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { ThemeOptionsKey, aesKey, aesVi } from '@app/config/constant';
import { WindowService } from '@app/core/services/common/window.service';
import { LoginService } from '@app/core/services/http/login/login.service';
import { PocCapitalPoolService } from '@app/core/services/http/poc-capital-pool/poc-capital-pool.service';
import { FxPurchasingService } from '@app/core/services/http/poc-remittance/fx-purchasing/fxPurchasing.service';
import { ThemeService } from '@app/core/services/store/common-store/theme.service';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { fnEncrypts, thousandthMark } from '@app/utils/tools';
import { TranslateService } from '@ngx-translate/core';
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
  availableBalance = 0;
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
  fxReceivingDataWallets: any[] = [];
  fxPurchaseData: any[] = [];
  purchCurrecy!: string;
  purchCurrecyCount!: string;
  purchCurrecyList: any[] = [];
  purchCurrecyModelShow = '';
  purchCurrecyModelCount = '';
  purchCurrecyModelShowIcon = '';
  rateType: any = 0;
  reveingCurrecy!: string;
  reveingCurrecyModelShow = '';
  reveingCurrecyModelCount = '';
  reveingCurrecyModelShowIcon = '';
  showStatus = false;
  receivingWalletAddressList: any[] = [];
  purIndex: number = 0;
  transferTitle: string = '';
  receivingWalletAddressShow: string = '';
  timeString: any = '';
  timeSubscription!: Subscription;
  transactionWalletAddressArr: any[] = [];
  inputType = 0;
  sendName = '';
  color: string = '';
  beneficiaryName = '';
  remiInfo: {
    rate: any;
    com: any;
    total: any;
    reve: any;
    fromCapitalPoolAddress: any;
    toCapitalPoolAddress: any;
  } = {
    rate: '',
    com: '',
    total: '',
    reve: '',
    fromCapitalPoolAddress: '',
    toCapitalPoolAddress: ''
  };
  amountValue: any;
  reniSendAmountValue: any;
  constructor(
    private pocCapitalPoolService: PocCapitalPoolService,
    private themesService: ThemeService,
    private dataService: LoginService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private fxPurchasingService: FxPurchasingService,
    private modal: NzModalService,
    private router: Router,
    private translate: TranslateService,
    private windowService: WindowService
  ) {}
  ngOnDestroy(): void {
    this.timeSubscription.unsubscribe();
  }
  ngAfterViewInit(): void {
    this.fromEventAmount();
    this.fromEventSendAmount();
    this.pageHeaderInfo = {
      title: ``,
      breadcrumb: ['Remittance Management', 'FX Purchasing'],
      extra: this.headerExtra,
      desc: this.headerContent,
      footer: ''
    };
  }

  ngOnInit() {
    const themeOptionsKey: any = this.windowService.getStorage(ThemeOptionsKey);
    this.color = JSON.parse(themeOptionsKey).color;
    let datePipe: DatePipe = new DatePipe('en-US');
    this.timeString = datePipe
      .transform(new Date().getTime() + 180000, 'MMMM d, y HH:mm:ss a zzzz')
      ?.replace('GMT', 'UTC');
    const interval$ = interval(180000);
    this.timeSubscription = interval$.subscribe((number) => {
      this.timeString = datePipe
        .transform(new Date().getTime() + 180000, 'MMMM d, y HH:mm:ss a zzzz')
        ?.replace('GMT', 'UTC');
      this.findExchange(5);
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
      availableBalance: [
        null,
        [Validators.required, this.amountAvailableBalance]
      ],
      transactionBankName: [null, [Validators.required]],
      send_currency: ['', [Validators.required]], // new_4.24
      reni_sendAmount: ['', [Validators.required, this.sendAmountValidator]],
      reci_currency: ['', [Validators.required]]
    });
    this.passwordForm = this.fb.group({
      pwd: ['', [Validators.required]]
    });
  }
  sendAmountValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (control.value > this.purchCurrecyCount) {
      return { regular: true, error: true };
    } else if (!/^([1-9]\d*|0)(\.\d{0,2})?$/.test(control.value)) {
      return { regular1: true, error: true };
    }
    return {};
  };
  amountAvailableBalance = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (control.value <= 0) {
      return { regular: true, error: true };
    }
    return {};
  };

  amountValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (!/^([1-9]\d*|0)(\.\d{0,2})?$/.test(control.value)) {
      return { regular: true, error: true };
    }
    return {};
  };

  // 刷新sending information信息
  private refreshSendingInfo(centralBankId: any) {
    this.fxPurchasingService
      .fetchFXPurchase({ centralBankId })
      .subscribe((res) => {
        this.fxPurchaseData = res;
        this.purchCurrecyList = this.fxPurchaseData;
        this.validateForm.get('send_currency')?.setValue(0);
        this.onPurchCurrecy(0);
        this.onPurchase(0);
      });
  }
  // 刷新receiving information信息
  private refreshReceivingInfo(centralBankId: any) {
    this.fxPurchasingService
      .fetchFxReceiving({ centralBankId })
      .subscribe((res) => {
        this.fxReceivingData = [];
        res.forEach((item: any, i: number) => {
          this.fxReceivingData.push({
            bankId: item.bankId,
            bankName: item.bankName,
            currecy: item.digitalSymbol,
            currecySymbol: item.digitalCurrencyName,
            walletAddress: item.wallets,
            legalCurrencySymbol: item.legalCurrencySymbol,
            digitalSymbol: item.digitalSymbol
          });
        });
        this.onReceiving(0);
        this.validateForm.get('reci_currency')?.setValue(0);
      });
  }
  initData() {
    this.refreshSendingInfo('');
    this.refreshReceivingInfo('');
    // this.fxPurchasingService
    //   .fetchFXPurchase({ centralBankId: '' })
    //   .subscribe((res) => {
    //     this.fxPurchaseData = res;
    //     this.purchCurrecyList = this.fxPurchaseData;
    //     this.onPurchCurrecy(0);
    //     this.validateForm.get('send_currency')?.setValue(0);
    //     this.onPurchase(0);
    //   });
    // this.fxPurchasingService
    //   .fetchFxReceiving({ centralBankId: '' })
    //   .subscribe((res) => {
    //     this.fxReceivingData = [];
    //     res.forEach((item: any, i: number) => {
    //       this.fxReceivingData.push({
    //         bankId: item.bankId,
    //         bankName: item.bankName,
    //         currecy: item.digitalSymbol,
    //         currecySymbol: item.digitalCurrencyName,
    //         walletAddress: item.wallets,
    //         legalCurrencySymbol: item.legalCurrencySymbol
    //       });
    //     });
    //     this.onReceiving(0);
    //     this.validateForm.get('reci_currency')?.setValue(0);
    //   });
  }
  onReceiving(e: any) {
    //
    // this.refreshSendingInfo(this.validateForm.get('reci_currency')?.value);
    // todo
    this.remiInfo = {
      rate: '',
      com: '',
      total: '',
      reve: '',
      fromCapitalPoolAddress: '',
      toCapitalPoolAddress: ''
    };
    this.beneficiaryName = this.fxReceivingData[e]?.currecy;
    this.reveingCurrecy = this.fxReceivingData[e]?.currecySymbol;
    this.reveingCurrecyModelShowIcon =
      this.fxReceivingData[e].digitalSymbol === null
        ? ''
        : this.fxReceivingData[e].digitalSymbol;
    this.reveingCurrecyModelShow = 'Available Balance: ';
    this.reveingCurrecyModelCount = thousandthMark(
      this.fxReceivingData[e]['walletAddress'][0]['cbdcCount']
    );
    this.availableBalance =
      this.fxReceivingData[e]['walletAddress'][0]['cbdcCount'];

    this.fxReceivingDataWallets = this.fxReceivingData[e]['walletAddress'];
    this.validateForm
      .get('receivingWalletAddress')
      ?.setValue(this.fxReceivingData[e]?.walletAddress[0]['bankAccountId']);
    this.validateForm
      .get('receivingBankName')
      ?.setValue(this.fxReceivingData[e]?.bankName);
    this.validateForm
      .get('receivingBankId')
      ?.setValue(this.fxReceivingData[e]?.bankId);

    this.receivingWalletAddressList = this.fxReceivingData[e]?.walletAddress;
    this.receivingWalletAddressShow = this.receivingWalletAddressList.filter(
      (item: any) =>
        item.bankAccountId === this.validateForm.value.receivingWalletAddress
    )[0]['chainAccountAddress'];
    this.setSendAndAmount();
    if (this.reveingCurrecy === this.purchCurrecy) {
    } else {
      this.findExchange(4);
    }
  }

  private setSendAndAmount(): void {
    this.validateForm.get('amount')?.setValue('', { emitEvent: false });
    this.validateForm
      .get('reni_sendAmount')
      ?.setValue('', { emitEvent: false });
    this.validateForm.get('reni_sendAmount')?.markAsDirty();
    this.validateForm.get('amount')?.markAsDirty();
  }

  @HostListener('focus') onFocusSendAmount() {
    if (this.reveingCurrecy !== this.purchCurrecy) {
      this.validateForm.get('amount')?.setValue('', { emitEvent: false });
      this.inputType = 1;
    }
  }
  @HostListener('focus') onFocusAmount() {
    if (this.reveingCurrecy !== this.purchCurrecy) {
      this.validateForm
        .get('reni_sendAmount')
        ?.setValue('', { emitEvent: false });
      this.inputType = 2;
    }
  }
  @HostListener('blur') onBlurSendAmount() {
    if (this.reveingCurrecy !== this.purchCurrecy) {
      this.findExchange(1);
    }
  }
  @HostListener('blur') onBlurAmount() {
    if (this.reveingCurrecy !== this.purchCurrecy) {
      this.findExchange(1);
    }
  }
  onPurchase(e: any) {
    // const val = this.transactionWalletAddressArr.filter(
    //   (item: any) => item.bankAccountId === e
    // );
    // this.validateForm.get('transactionWalletAddressId')?.setValue(e);
    this.purchCurrecyModelShow = 'Available Balance: ';
    this.purchCurrecyModelCount = thousandthMark(
      this.transactionWalletAddressArr[e]['cbdcCount']
    );
    this.availableBalance = this.transactionWalletAddressArr[e]['cbdcCount'];

    this.purchCurrecyCount = this.transactionWalletAddressArr[e]['cbdcCount'];
    this.validateForm
      .get('bankAccountId')
      ?.setValue(this.transactionWalletAddressArr[e]['bankAccountId']);
    this.validateForm
      .get('availableBalance')
      ?.setValue(
        thousandthMark(this.transactionWalletAddressArr[e]['cbdcCount'])
      );

    if (this.reveingCurrecy === this.purchCurrecy) {
    } else {
      this.findExchange(4);
    }
  }
  onReceivingWalletAddressChange(e: any) {
    const val = this.fxReceivingDataWallets.filter(
      (item: any) => item.bankAccountId === e
    );
    this.reveingCurrecyModelShow = 'Available Balance: ';
    this.reveingCurrecyModelCount = thousandthMark(val[0]['cbdcCount']);
    this.availableBalance = val[0]['cbdcCount'];
    if (this.reveingCurrecy === this.purchCurrecy) {
    } else {
      this.findExchange(4);
    }
  }
  onPurchCurrecy(e: number) {
    // // 加载receiving currency
    this.refreshReceivingInfo(this.fxPurchaseData[e].centralBankId);
    this.sendName = this.fxPurchaseData[e].digitalSymbol;
    this.purchCurrecy = this.fxPurchaseData[e].digitalCurrencyName;
    this.purchCurrecyModelShowIcon =
      this.fxPurchaseData[e].digitalSymbol === null
        ? ''
        : this.fxPurchaseData[e].digitalSymbol;
    this.purchCurrecyModelShow = 'Available Balance: ';
    this.purchCurrecyModelCount = thousandthMark(
      this.fxPurchaseData[e]['remitterInformationExtendInfoList'][0][
        'cbdcCount'
      ]
    );
    this.availableBalance =
      this.fxPurchaseData[e]['remitterInformationExtendInfoList'][0][
        'cbdcCount'
      ];

    this.purchCurrecyCount =
      this.fxPurchaseData[e]['remitterInformationExtendInfoList'][0][
        'cbdcCount'
      ];
    this.transactionWalletAddressArr =
      this.fxPurchaseData[e].remitterInformationExtendInfoList;

    this.validateForm
      .get('transactionBankName')
      ?.setValue(this.fxPurchaseData[e].bankName);
    this.validateForm
      .get('availableBalance')
      ?.setValue(
        thousandthMark(
          this.fxPurchaseData[e]['remitterInformationExtendInfoList'][0][
            'cbdcCount'
          ]
        )
      );

    this.validateForm
      .get('transactionWalletAddress')
      ?.setValue(
        this.fxPurchaseData[e]['remitterInformationExtendInfoList'][0][
          'chainAccountAddress'
        ]
      );
    this.validateForm.get('transactionWalletAddressId')?.setValue(0);
    this.setSendAndAmount();
    this.setShowStatus(false);
    if (this.reveingCurrecy === this.purchCurrecy) {
    } else {
      this.findExchange(4);
    }
  }
  setShowStatus(status: boolean) {
    // if (this.validateForm.get('amount')?.value === null) {
    //   this.showStatus = true;
    //   return;
    // }
    this.showStatus = status;
    this.cdr.markForCheck();
  }
  private getValCom(item: any): any {
    if (this.inputType === 2) {
      return (
        Number(
          item.smChargeModel === 0
            ? (this.validateForm.get('amount')?.value / item.rate) *
                item.smValue >
              item.smMaxFee
              ? item.smMaxFee
              : (this.validateForm.get('amount')?.value / item.rate) *
                item.smValue
            : item.smValue
        ).toFixed(2) +
        ' ' +
        item.from.replace('-UDPN', '')
      );
    } else {
      return (
        Number(
          item.smChargeModel === 0
            ? this.validateForm.get('reni_sendAmount')?.value * item.smValue >
              item.smMaxFee
              ? item.smMaxFee
              : this.validateForm.get('reni_sendAmount')?.value * item.smValue
            : item.smValue
        ).toFixed(2) +
        ' ' +
        item.from.replace('-UDPN', '')
      );
    }
  }

  private getValTotal(item: any): any {
    if (this.inputType === 2) {
      return (
        Number(
          this.validateForm.get('amount')?.value / item.rate +
            (item.smChargeModel === 0
              ? (this.validateForm.get('amount')?.value / item.rate) *
                  item.smValue >
                item.smMaxFee
                ? item.smMaxFee
                : (this.validateForm.get('amount')?.value / item.rate) *
                  item.smValue
              : item.smValue)
        ).toFixed(2) +
        ' ' +
        item.from.replace('-UDPN', '')
      );
    } else {
      let reniData = Number(this.validateForm.get('reni_sendAmount')?.value);
      return (
        Number(
          reniData +
            (item.smChargeModel === 0
              ? reniData * item.smValue > item.smMaxFee
                ? item.smMaxFee
                : reniData * item.smValue
              : item.smValue)
        ).toFixed(2) +
        ' ' +
        item.from.replace('-UDPN', '')
      );
    }
  }
  private getValReve(item: any): any {
    if (this.inputType === 2) {
      return Number(this.validateForm.get('amount')?.value).toFixed(2) + ' ';
    } else {
      return Number(
        this.validateForm.get('reni_sendAmount')?.value * item.rate
      ).toFixed(2);
    }
  }
  private setValues(info: any): void {
    if (this.inputType === 1) {
      this.validateForm
        .get('amount')
        ?.setValue(Number(info.reve.split(' ')[0]).toFixed(2));
    } else {
      this.validateForm
        .get('reni_sendAmount')
        ?.setValue(
          Number(info.total.split(' ')[0] - info.com.split(' ')[0]).toFixed(2)
        );
    }
  }
  findExchange(index: number) {
    this.amountValue = this.validateForm.get('amount')?.value;
    this.reniSendAmountValue = this.validateForm.get('reni_sendAmount')?.value;
    if (this.reveingCurrecy !== this.purchCurrecy) {
      if (
        (this.validateForm.get('amount')?.value !== '' &&
          this.validateForm.get('amount')?.value !== null) ||
        (this.validateForm.get('reni_sendAmount')?.value !== '' &&
          this.validateForm.get('reni_sendAmount')?.value !== null)
      ) {
        this.checkedItemComment = [];
        this.setShowStatus(true);
        this.nzLoading = true;
        this.cdr.markForCheck();
        this.fxPurchasingService
          .fetchRateInfo({
            from: this.purchCurrecy,
            to: this.reveingCurrecy
          })
          .subscribe((res) => {
            let resultData: any[] = [];
            this.rateType = res[0].rateType;
            this.transferTitle =
              this.reveingCurrecy.replace('-UDPN', '') +
              '/' +
              this.purchCurrecy.replace('-UDPN', '') +
              ' FX Rate';
            res.forEach((item: any) => {
              resultData.push({
                rateId: item.rateId,
                sp: item.provider,
                fromCapitalPoolAddress: item.fromCapitalPoolAddress,
                toCapitalPoolAddress: item.toCapitalPoolAddress,
                currency:
                  item.from.replace('-UDPN', '') +
                  '/' +
                  item.to.replace('-UDPN', '') +
                  ' = ' +
                  item.rate.toFixed(2),
                currencyShow:
                  item.from.replace('-UDPN', '') +
                  '/' +
                  item.to.replace('-UDPN', '') +
                  ' = ' +
                  item.rate.toFixed(2),
                rate: item.rate,
                com: this.getValCom(item),
                total: this.getValTotal(item),
                info: {
                  rate:
                    '1 ' +
                    item.from.replace('-UDPN', '') +
                    ' = ' +
                    item.rate +
                    ' ' +
                    item.to.replace('-UDPN', ''),
                  com: this.getValCom(item),
                  fromCapitalPoolAddress: item.fromCapitalPoolAddress,
                  toCapitalPoolAddress: item.toCapitalPoolAddress,
                  total: this.getValTotal(item),
                  reve:
                    this.getValReve(item) + ' ' + item.to.replace('-UDPN', '')
                }
              });
            });
            this.nzLoading = false;
            this.dataList = resultData.sort(this.compare('total'));
            this.checkedItemComment = [];
            this.dataList.forEach((item: any, index: number) => {
              if (this.radioValue === index) {
                this.checkedItemComment.push(item);
                this.remiInfo = item.info;
                this.setValues(item.info);
              }
            });
            this.cdr.markForCheck();
          });
      } else {
        this.setShowStatus(false);
        return;
      }
    } else {
      this.checkedItemComment = [];
      this.setShowStatus(false);
    }
  }
  fromEventAmount() {
    this.validateForm
      .get('amount')
      ?.valueChanges.pipe(debounceTime(1000))
      .subscribe((res) => {
        if (res !== this.amountValue) {
          this.findExchange(6);
        }
      });
  }
  fromEventSendAmount() {
    this.validateForm
      .get('reni_sendAmount')
      ?.valueChanges.pipe(debounceTime(1000))
      .subscribe((res) => {
        if (res !== this.reniSendAmountValue) {
          this.findExchange(6);
        }
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
        this.remiInfo = item.info;
        this.setValues(item.info);
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
    this.validateForm
      .get('availableBalance')
      ?.setValue(this.validateForm.get('reni_sendAmount')?.value);
    if (this.validateForm.valid) {
      if (Number(this.remiInfo.total) > Number(this.availableBalance)) {
        this.modal.error({
          nzTitle: 'Error',
          nzContent:
            'Total Payment Amount cannot be greater than Available Balance !'
        });
        return;
      }
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
        receivingWalletId: this.validateForm.get('receivingWalletAddress')
          ?.value,
        passWord: fnEncrypts(this.passwordForm.getRawValue(), aesKey, aesVi),
        rateId: this.checkedItemComment[0].rateId,
        transactionWalletId: this.validateForm.get('bankAccountId')?.value,
        receivingAmount:
          this.inputType === 1 ? null : this.validateForm.get('amount')?.value,
        sendingAmount:
          this.inputType === 2
            ? null
            : this.validateForm.get('reni_sendAmount')?.value,
        sendingWalletId: this.validateForm.get('bankAccountId')?.value
      })
      .subscribe((res) => {
        if (res.code === 0 || res.code === '0') {
          this.modal
            .success({
              nzTitle: 'FX purchase completed',
              nzContent: ''
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
          this.isLoading = false;
        }
        this.cdr.markForCheck();
      });
  }
}
