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
import { Route, Router } from '@angular/router';
import { aesKey, aesVi } from '@app/config/constant';
import { LoginService } from '@app/core/services/http/login/login.service';
import { PocCapitalPoolService } from '@app/core/services/http/poc-capital-pool/poc-capital-pool.service';
import { TransferService } from '@app/core/services/http/poc-remittance/transfer/transfer.service';
import { ThemeService } from '@app/core/services/store/common-store/theme.service';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { fnEncrypts, thousandthMark } from '@app/utils/tools';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Subscription, debounceTime, interval, map } from 'rxjs';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.less']
})
export class TransferComponent implements OnInit, AfterViewInit, OnDestroy {
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
  beneficialBankNameListAll: any[] = [];
  remitterWalletAddressList: any[] = [];
  tableConfig!: AntTableConfig;
  setOfCheckedId = new Set<string>();
  checkedItemComment: NzSafeAny[] = [];
  radioValue: any = 0;
  passwordForm!: FormGroup;
  dataList: NzSafeAny[] = [];
  isVisible: boolean = false;
  isVisibleEnterPassword: boolean = false;
  beneficiaryCurrency = '';
  beneficiaryCurrencyIcon = '';
  availableCurrecy: any[] = [];
  availableCurrecyModel = '';
  availableCurrecyModelCount = '';
  availableCurrecyModelShow = '';
  availableCurrecyModelShowIcon = '';
  settlementStatus = false;
  beneficiaryCurrencyName: any = '';
  transferTitle: string = '';
  BeneficiaryArr: any[] = [];
  newAmountArr: any[] = [];
  newBeneficialBankId = 0;
  newBeneficialWalletAddress: string = '';
  newToCommercialBankId = 0;
  remitterBankName = '';
  timeString: any = '';
  timeSubscription!: Subscription;
  newRemitterWalletAddress: string = '';
  oldAmount: any = '';
  remiInfo: {
    rate: any;
    com: any;
    total: any;
    reve: any;
  } = {
    rate: '',
    com: '',
    total: '',
    reve: ''
  };
  inputType = 0;
  bankNames = '';
  constructor(
    private pocCapitalPoolService: PocCapitalPoolService,
    private themesService: ThemeService,
    private dataService: LoginService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private transferService: TransferService,
    private modal: NzModalService,
    private router: Router
  ) {}
  ngOnDestroy(): void {
    this.timeSubscription.unsubscribe();
  }
  ngAfterViewInit(): void {
    // this.fromEventBeneficialWalletAddress();
    this.formEventCurrencyInterbankSettlementAmount();
    this.formEventCurrencyInterbankSettlementSendAmount();
    this.pageHeaderInfo = {
      title: ``,
      breadcrumb: ['Remittance Management', 'Transfer'],
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
      this.getExchange();
      this.cdr.markForCheck();
    });
    this.initData();
    this.validateForm = this.fb.group({
      newBeneficialBankName: [''],
      beneficialBankName: [''],
      beneficialBankId: ['', [Validators.required]],
      beneficialWalletAddress: [
        null,
        [Validators.required, this.beneficialWalletAddressValidator]
      ],
      amount: ['', [Validators.required, this.amountValidator]],
      remitterWalletAddress: [null, [Validators.required]],
      availableBalance: [null, [Validators.required]],
      remitterBankName: [null, [Validators.required]],
      remitterBankId: ['', [Validators.required]],
      remittanceInformation: [null, [Validators.required]],
      remi_currency: ['', [Validators.required]], // new_4.24
      reni_sendAmount: ['', [Validators.required, this.sendAmountValidator]], // new_4.24
      bene_currency: ['', [Validators.required]] // new_4.24:
    });

    this.passwordForm = this.fb.group({
      pwd: ['', [Validators.required]]
    });
  }
  sendAmountValidator = (control: FormControl): { [s: string]: boolean } => {
    if (control.value === '') {
      return { error: true, required: true };
    } else if (control.value > this.availableCurrecyModelCount) {
      return { regular: true, error: true };
    }
    return {};
  };
  beneficialWalletAddressValidator = (
    control: FormControl
  ): { [s: string]: boolean } => {
    if (control.value === '') {
      return { error: true, required: true };
    }
    return {};
  };
  amountValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (
      control.value >
        Number(this.validateForm.get('availableBalance')?.value) &&
      this.availableCurrecyModel === this.beneficiaryCurrency
    ) {
      return { regular: true, error: true };
    } else if (!/^(([1-9]{1}\d*)|(0{1}))(\.\d{0,2})?$/.test(control.value)) {
      return { regular1: true, error: true };
    }
    return {};
  };

  initData() {
    this.beneficialBankNameList = [];
    this.beneficialBankNameListAll = [];
    this.transferService.bankInformation().subscribe((res) => {
      this.remitterBankName = res.bankName;
    });

    this.transferService
      .fetchAllOhter({ bankName: '', chainAccountAddress: '' })
      .subscribe((res: any) => {
        this.beneficialBankNameListAll = res;
        this.validateForm.get('beneficialBankId')?.setValue(0);
        this.newBeneficialBankId = this.beneficialBankNameListAll[0]['bankId'];
        this.newAmountArr = res[0]['beneficiaryCurrencyRespVOs'];
        this.BeneficiaryArr =
          res[0]['beneficiaryCurrencyRespVOs'][0][
            'beneficiaryWalletExtendedRespVOs'
          ];

        this.beneficiaryCurrency =
          res[0]['beneficiaryCurrencyRespVOs'][0]['digitalCurrencyName'];
        this.validateForm
          .get('bene_currency')
          ?.setValue(this.beneficiaryCurrency);
        this.validateForm
          .get('newBeneficialBankName')
          ?.setValue(
            res[0]['beneficiaryCurrencyRespVOs'][0]['centralBankName']
          );

        this.validateForm
          .get('beneficialWalletAddress')
          ?.setValue(
            res[0]['beneficiaryCurrencyRespVOs'][0][
              'beneficiaryWalletExtendedRespVOs'
            ][0]['bankWalletId']
          );
        this.newBeneficialWalletAddress =
          res[0]['beneficiaryCurrencyRespVOs'][0][
            'beneficiaryWalletExtendedRespVOs'
          ][0]['chainAccountAddress'];
        // centralBankId
        this.newToCommercialBankId =
          res[0]['beneficiaryCurrencyRespVOs'][0]['centralBankId'];
      });
    this.transferService.fetchBankList().subscribe((res: any) => {
      res.forEach((item: any) => {
        this.beneficialBankNameList.push({
          label: item.bankName,
          value: item.centralBankId,
          currencyName: item.digitalSymbol,
          currencyValue: item.digitalCurrencyName
        });
      });
    });
    this.transferService
      .bankRemitter({ centralBankId: '' })
      .subscribe((res: any) => {
        // 1 Set currency array
        this.availableCurrecy = [];
        let remCurrencyArr: {
          bankName: string;
          centralBankId: number;
          digitalCurrencyName: string;
          digitalSymbol: string;
          legalCurrencyName: string;
          legalCurrencySymbol: string;
          remitterInformationExtendInfoList: any;
        }[] = [];
        res.forEach((item: any) => {
          remCurrencyArr.push({
            bankName: item.bankName,
            centralBankId: item.centralBankId,
            digitalCurrencyName: item.digitalCurrencyName,
            digitalSymbol: item.digitalSymbol,
            legalCurrencyName: item.legalCurrencyName,
            legalCurrencySymbol: item.legalCurrencySymbol,
            remitterInformationExtendInfoList:
              item.remitterInformationExtendInfoList
          });
        });
        this.availableCurrecy = remCurrencyArr;
        // 设置默认选中第一个,自动触发onRemiCurrencyChange事件
        this.validateForm
          .get('remi_currency')
          ?.setValue(remCurrencyArr[0].digitalCurrencyName);

        this.setRemAddressArr(res[0]['remitterInformationExtendInfoList']);
        this.setRemDefaultValue(res);
      });
  }

  onRemitterWalletAddressChange(e: any) {
    const val = this.remitterWalletAddressList.filter(
      (item: any) => item.bankAccountId === e
    );
    this.availableCurrecyModelShow =
      this.availableCurrecyModel.replace('-UDPN', '') +
      ' Available Balance: ' +
      this.availableCurrecyModelShowIcon +
      ' ' +
      thousandthMark(val[0].cbdcCount);
    this.validateForm
      .get('availableBalance')
      ?.setValue(thousandthMark(val[0]['cbdcCount']));
    this.availableCurrecyModelCount = val[0]['cbdcCount'];
    this.newRemitterWalletAddress = val[0]['chainAccountAddress'];
    this.setSendAndAmount();
    this.getExchange();
  }

  setRemDefaultValue(data: any) {
    this.onAvailableCurrecy(data[0]['digitalCurrencyName']);
    this.onRemitterWalletAddressChange(
      data[0]['remitterInformationExtendInfoList'][0]['bankAccountId']
    );

    this.validateForm.get('remitterBankName')?.setValue(data[0]['bankName']);
    this.validateForm
      .get('remitterWalletAddress')
      ?.setValue(
        data[0]['remitterInformationExtendInfoList'][0]['bankAccountId']
      );
  }
  setRemAddressArr(
    arr: {
      bankAccountId: number;
      cbdcCount: number;
      chainAccountAddress: string;
    }[]
  ) {
    let remAddressArr: {
      bankAccountId: number;
      cbdcCount: number;
      chainAccountAddress: string;
    }[] = [];
    arr.forEach((item: any) => {
      remAddressArr.push({
        bankAccountId: item.bankAccountId,
        cbdcCount: item.cbdcCount,
        chainAccountAddress: item.chainAccountAddress
      });
    });
    this.remitterWalletAddressList = remAddressArr;
  }
  private setSendAndAmount(): void {
    this.validateForm.get('amount')?.setValue('', { emitEvent: false });
    this.validateForm
      .get('reni_sendAmount')
      ?.setValue('', { emitEvent: false });
    this.validateForm.get('reni_sendAmount')?.markAsDirty();
    this.validateForm.get('amount')?.markAsDirty();
  }
  // Check field
  getExchange() {
    if (this.beneficiaryCurrency !== this.availableCurrecyModel) {
      if (
        (this.validateForm.get('amount')?.value !== '' &&
          this.validateForm.get('amount')?.value !== null) ||
        (this.validateForm.get('reni_sendAmount')?.value !== '' &&
          this.validateForm.get('reni_sendAmount')?.value !== null)
      ) {
        this.checkedItemComment = [];
        this.findExchange();
      } else {
        this.settlementStatus = false;
        return;
      }
    } else {
      this.checkedItemComment = [];
      this.settlementStatus = false;
    }
    return;
    // this.validateForm.get('amount')?.markAsDirty();

    // this.validateForm
    //   .get('amount')
    //   ?.updateValueAndValidity({ emitEvent: false });
    // this.cdr.markForCheck();
    // 检查Currency & Interbank Settlement Amount是否存在
  }
  // get val
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
        ?.setValue(Number(info.reve.split(' ')[0]).toFixed(2), {
          emitEvent: false
        });
    } else {
      this.validateForm
        .get('reni_sendAmount')
        ?.setValue(
          Number(info.total.split(' ')[0] - info.com.split(' ')[0]).toFixed(2),
          {
            emitEvent: false
          }
        );
      // this.validateForm.get('reni_sendAmount')?.markAsDirty();
      // this.validateForm
      //   .get('reni_sendAmount')
      //   ?.updateValueAndValidity({ onlySelf: true });
      // this.validateForm
      //   .get('reni_sendAmount')
      //   ?.updateValueAndValidity({ emitEvent: false });
    }
  }
  // Query exchange rate information
  findExchange() {
    if (this.validateForm.get('amount')?.value === null) {
      return;
    }
    if (this.validateForm.get('reni_sendAmount')?.value === null) {
      return;
    }

    this.settlementStatus = true;
    this.nzLoading = true;
    this.cdr.markForCheck();
    this.transferService
      .exchange({
        from: this.availableCurrecyModel,
        to: this.beneficiaryCurrency
      })
      .subscribe((res) => {
        let resultData: any[] = [];
        this.transferTitle =
          this.availableCurrecyModel.replace('-UDPN', '') +
          '/' +
          this.beneficiaryCurrency.replace('-UDPN', '') +
          ' Fx Rate';
        res.forEach((item: any) => {
          resultData.push({
            rateId: item.rateId,
            sp: item.provider,
            currency:
              '1 ' +
              item.from.replace('-UDPN', '') +
              ' = ' +
              item.rate +
              ' ' +
              item.to.replace('-UDPN', ''),
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
              total: this.getValTotal(item),
              reve: this.getValReve(item) + ' ' + item.to.replace('-UDPN', '')
            }
            // total: 1
          });
        });
        this.dataList = resultData.sort(this.compare('total'));
        this.checkedItemComment = [];
        // this.radioValue = 0;
        this.dataList.forEach((item: any, index: number) => {
          if (this.radioValue === index) {
            this.checkedItemComment.push(item);
            this.remiInfo = item.info;
            this.setValues(item.info);
          }
        });
        this.nzLoading = false;
        this.cdr.markForCheck();
      });
  }
  compare(p: string) {
    return function (m: any, n: any) {
      var a = m[p];
      var b = n[p];
      return a - b;
    };
  }
  // Monitor Currency & Interbank Settlement Amount input
  fromEventBeneficialWalletAddress() {
    this.validateForm
      .get('beneficialWalletAddress')
      ?.valueChanges.pipe(debounceTime(1000))
      .subscribe((res) => {
        this.getExchange();
      });
  }
  // Monitor Currency & Interbank Settlement Amount input
  formEventCurrencyInterbankSettlementAmount() {
    this.validateForm
      .get('amount')
      ?.valueChanges.pipe(debounceTime(1000))
      .subscribe((res) => {
        if (this.beneficiaryCurrency === this.availableCurrecyModel) {
          this.validateForm.get('reni_sendAmount')?.setValue(Number(res), {
            emitEvent: false
          });
        } else {
          this.getExchange();
        }
      });
  }
  formEventCurrencyInterbankSettlementSendAmount() {
    this.validateForm
      .get('reni_sendAmount')
      ?.valueChanges.pipe(debounceTime(1000))
      .subscribe((res) => {
        if (this.beneficiaryCurrency === this.availableCurrecyModel) {
          this.validateForm.get('amount')?.setValue(Number(res), {
            emitEvent: false
          });
        } else {
          this.getExchange();
        }
      });
  }
  onAvailableCurrecy(e: any) {
    this.availableCurrecyModel = e;

    const val = this.availableCurrecy.filter(
      (item: any) => item.digitalCurrencyName === e
    );
    this.availableCurrecyModelShowIcon =
      val[0].legalCurrencySymbol === null ? '' : val[0].legalCurrencySymbol;
    this.availableCurrecyModelShow =
      this.availableCurrecyModel.replace('-UDPN', '') +
      ' Available Balance: ' +
      this.availableCurrecyModelShowIcon +
      ' ' +
      thousandthMark(val[0].remitterInformationExtendInfoList[0].cbdcCount);
    this.availableCurrecyModelCount =
      val[0].remitterInformationExtendInfoList[0].cbdcCount;
    this.validateForm
      .get('availableBalance')
      ?.setValue(
        thousandthMark(
          val[0]['remitterInformationExtendInfoList'][0]['cbdcCount']
        )
      );
    this.remitterWalletAddressList =
      val[0]['remitterInformationExtendInfoList'];
    this.validateForm
      .get('remitterWalletAddress')
      ?.setValue(
        val[0]['remitterInformationExtendInfoList'][0]['bankAccountId']
      );
    this.validateForm.get('remitterBankName')?.setValue(val[0]['bankName']);
    this.validateForm.get('remitterBankId')?.setValue(val[0]['centralBankId']);
    this.setSendAndAmount();
    this.getExchange();
  }
  onBeneficialWalletAddressChange(e: number) {
    setTimeout(() => {
      const val = this.BeneficiaryArr.filter(
        (item: any) => item.bankWalletId === e
      );
      this.newBeneficialWalletAddress = val[0]['chainAccountAddress'];
      this.setSendAndAmount();
      this.getExchange();
    }, 500);
  }

  @HostListener('focus') onFocusSendAmount() {
    if (this.beneficiaryCurrency !== this.availableCurrecyModel) {
      this.validateForm.get('amount')?.setValue('', { emitEvent: false });
      this.inputType = 1;
    }
  }
  @HostListener('blur') onBlurSendAmount() {
    if (this.beneficiaryCurrency !== this.availableCurrecyModel) {
      this.getExchange();
    }
  }
  @HostListener('blur') onBlurAmount() {
    if (this.beneficiaryCurrency !== this.availableCurrecyModel) {
      this.getExchange();
    }
  }
  @HostListener('focus') onFocusAmount() {
    if (this.beneficiaryCurrency !== this.availableCurrecyModel) {
      this.validateForm
        .get('reni_sendAmount')
        ?.setValue('', { emitEvent: false });
      this.inputType = 2;
    }
  }

  onBeneficiaryCurrency(e: any) {
    const val = this.newAmountArr.filter(
      (item: any) => item.digitalCurrencyName === e
    );
    this.beneficiaryCurrencyIcon = val[0]['legalCurrencySymbol'];
    // centralBankId
    this.newToCommercialBankId = val[0]['centralBankId'];
    this.BeneficiaryArr = val[0]['beneficiaryWalletExtendedRespVOs'];
    this.beneficiaryCurrency = e;
    this.validateForm
      .get('newBeneficialBankName')
      ?.setValue(val[0]['centralBankName']);
    this.validateForm
      .get('beneficialWalletAddress')
      ?.setValue(val[0]['beneficiaryWalletExtendedRespVOs'][0]['bankWalletId']);
    this.setSendAndAmount();
    this.getExchange();
  }
  onBeneficialBankNameChange(e: number) {
    // set ID

    this.bankNames = this.beneficialBankNameListAll[e]['bankName'];
    this.newBeneficialBankId = this.beneficialBankNameListAll[e]['bankId'];
    // centralBankId
    this.newToCommercialBankId =
      this.beneficialBankNameListAll[e]['beneficiaryCurrencyRespVOs'][0][
        'centralBankId'
      ];
    this.newAmountArr =
      this.beneficialBankNameListAll[e]['beneficiaryCurrencyRespVOs'];

    this.validateForm
      .get('beneficialWalletAddress')
      ?.setValue(
        this.beneficialBankNameListAll[e]['beneficiaryCurrencyRespVOs'][0][
          'beneficiaryWalletExtendedRespVOs'
        ][0]['bankWalletId']
      );
    this.BeneficiaryArr =
      this.beneficialBankNameListAll[e]['beneficiaryCurrencyRespVOs'][0][
        'beneficiaryWalletExtendedRespVOs'
      ];
    this.beneficiaryCurrency =
      this.beneficialBankNameListAll[e]['beneficiaryCurrencyRespVOs'][0][
        'digitalCurrencyName'
      ];
    this.validateForm.get('bene_currency')?.setValue(this.beneficiaryCurrency);
    this.validateForm
      .get('newBeneficialBankName')
      ?.setValue(
        this.beneficialBankNameListAll[e]['beneficiaryCurrencyRespVOs'][0][
          'centralBankName'
        ]
      );
    this.setSendAndAmount();
    this.cdr.markForCheck();
    this.getExchange();
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
    console.log(this.validateForm.value);
    if (this.validateForm.valid) {
      if (this.beneficiaryCurrency !== this.availableCurrecyModel) {
        if (this.checkedItemComment.length === 0) {
          this.modal.error({
            nzTitle: 'Error',
            nzContent: 'Please select an exchange rate !'
          });
          return;
        }
      }
      if (
        Number(this.checkedItemComment[0]?.total.toString()) >
        Number(this.validateForm.controls['availableBalance'].value.toString())
      ) {
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
    this.isLoading = true;
    this.transferService
      .transfer({
        beneficiaryBankId: this.newToCommercialBankId,
        beneficiaryWalletAddress: this.newBeneficialWalletAddress,
        interbankSettlementAmount: this.validateForm.get('amount')?.value,
        remittanceInformation: this.validateForm.get('remittanceInformation')
          ?.value,
        remitterWalletId: this.validateForm.get('remitterWalletAddress')?.value,
        rateId:
          this.checkedItemComment.length > 0
            ? this.checkedItemComment[0].rateId
            : ' ',
        passWord: fnEncrypts(this.passwordForm.getRawValue(), aesKey, aesVi),
        toCommercialBankId: this.newBeneficialBankId,
        sendingAmount:
          this.inputType === 2
            ? null
            : this.validateForm.get('reni_sendAmount')?.value,
        receivingAmount:
          this.inputType === 1 ? null : this.validateForm.get('amount')?.value
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
              this.isVisibleEnterPassword = false;
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
