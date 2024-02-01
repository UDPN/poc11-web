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
  availableCurrecy: any[] = [];
  availableCurrecyModel = '';
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
      amount: [null, [Validators.required, this.amountValidator]],
      remitterWalletAddress: [null, [Validators.required]],
      availableBalance: [null, [Validators.required]],
      remitterBankName: [null, [Validators.required]],
      remitterBankId: ['', [Validators.required]],
      remittanceInformation: [null, [Validators.required]]
    });

    this.passwordForm = this.fb.group({
      pwd: ['', [Validators.required]]
    });
  }
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
    this.transferService.bankRemitter().subscribe((res: any) => {
      // 1 Set currency array
      this.availableCurrecy = [];
      let remCurrencyArr: {
        bankName: string;
        centralBankId: number;
        digitalCurrencyName: string;
        digitalSymbol: string;
        legalCurrencyName: string;
        remitterInformationExtendInfoList: any;
      }[] = [];
      res.forEach((item: any) => {
        remCurrencyArr.push({
          bankName: item.bankName,
          centralBankId: item.centralBankId,
          digitalCurrencyName: item.digitalCurrencyName,
          digitalSymbol: item.digitalSymbol,
          legalCurrencyName: item.legalCurrencyName,
          remitterInformationExtendInfoList:
            item.remitterInformationExtendInfoList
        });
      });
      this.availableCurrecy = remCurrencyArr;
      this.setRemAddressArr(res[0]['remitterInformationExtendInfoList']);
      this.setRemDefaultValue(res);
    });
  }

  onRemitterWalletAddressChange(e: any) {
    const val = this.remitterWalletAddressList.filter(
      (item: any) => item.bankAccountId === e
    );

    this.validateForm
      .get('availableBalance')
      ?.setValue(thousandthMark(val[0]['cbdcCount']));
    this.newRemitterWalletAddress = val[0]['chainAccountAddress'];
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
  // Check field
  getExchange() {
    this.validateForm.get('amount')?.markAsDirty();
    this.validateForm
      .get('amount')
      ?.updateValueAndValidity({ emitEvent: false });
    this.cdr.markForCheck();
    // 检查Currency & Interbank Settlement Amount是否存在
    if (this.beneficiaryCurrency !== this.availableCurrecyModel) {
      if (
        this.validateForm.get('amount')?.value === null ||
        this.validateForm.get('amount')?.value === ''
      ) {
        this.settlementStatus = false;
        return;
      } else {
        this.checkedItemComment = [];
        this.settlementStatus = true;
        this.findExchange();
      }
    } else {
      this.checkedItemComment = [];
      this.settlementStatus = false;
    }
  }
  // Query exchange rate information
  findExchange() {
    if (this.validateForm.get('amount')?.value === null) {
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
        this.validateForm.get('amount')?.markAsDirty();
        this.validateForm
          .get('amount')
          ?.updateValueAndValidity({ emitEvent: false });
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
              '->' +
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
            // total: 1
          });
        });
        this.dataList = resultData.sort(this.compare('total'));
        this.checkedItemComment = [];
        // this.radioValue = 0;
        this.dataList.forEach((item: any, index: number) => {
          if (this.radioValue === index) {
            this.checkedItemComment.push(item);
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
        this.getExchange();
      });
  }
  onAvailableCurrecy(e: any) {
    this.availableCurrecyModel = e;

    const val = this.availableCurrecy.filter(
      (item: any) => item.digitalCurrencyName === e
    );
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
    this.getExchange();
  }
  onBeneficialWalletAddressChange(e: number) {
    setTimeout(() => {
      const val = this.BeneficiaryArr.filter(
        (item: any) => item.bankWalletId === e
      );
      this.newBeneficialWalletAddress = val[0]['chainAccountAddress'];
      this.getExchange();
    }, 500);
  }
  onBeneficiaryCurrency(e: any) {
    const val = this.newAmountArr.filter(
      (item: any) => item.digitalCurrencyName === e
    );
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
    this.getExchange();
  }
  onBeneficialBankNameChange(e: number) {
    // set ID
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
    this.validateForm
      .get('newBeneficialBankName')
      ?.setValue(
        this.beneficialBankNameListAll[e]['beneficiaryCurrencyRespVOs'][0][
          'centralBankName'
        ]
      );

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
        toCommercialBankId: this.newBeneficialBankId
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
