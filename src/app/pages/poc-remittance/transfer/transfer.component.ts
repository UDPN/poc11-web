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
import { Route, Router } from '@angular/router';
import { aesKey, aesVi } from '@app/config/constant';
import { LoginService } from '@app/core/services/http/login/login.service';
import { PocCapitalPoolService } from '@app/core/services/http/poc-capital-pool/poc-capital-pool.service';
import { TransferService } from '@app/core/services/http/poc-remittance/transfer/transfer.service';
import { ThemeService } from '@app/core/services/store/common-store/theme.service';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { fnEncrypts } from '@app/utils/tools';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzModalService } from 'ng-zorro-antd/modal';
import { debounceTime, map } from 'rxjs';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.less']
})
export class TransferComponent implements OnInit, AfterViewInit {
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
  availableCurrecy: {
    value: string;
    label: string;
    bankName: string;
    cbdcCount: string;
  }[] = [];
  availableCurrecyModel = '';
  settlementStatus = false;
  beneficiaryCurrencyName: any = '';
  transferTitle: string = '';
  BeneficiaryArr: any[] = [];
  newAmountArr: any[] = [];
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
  ngAfterViewInit(): void {
    // console.log(fnEncrypts('123456', aesKey, aesVi));
    this.fromEventBeneficialWalletAddress();
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
    this.initData();
    this.validateForm = this.fb.group({
      newBeneficialBankName: [''],
      beneficialBankName: ['', [Validators.required]],
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
    if (!control.value) {
      return { error: true, required: true };
    } else if (!/^[0][x][0-9a-fA-F]{40}$/.test(control.value)) {
      return { regular: true, error: true };
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
    this.transferService
      .fetchAllOhter({ bankName: '', chainAccountAddress: '' })
      .subscribe((res: any) => {
        this.beneficialBankNameListAll = res;
        // set Beneficiary's Name
        console.log(res);
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
    this.transferService.fetchAllWalletList().subscribe((res: any) => {
      res.forEach((item: any, i: number) => {
        if (i === 0) {
          this.validateForm
            .get('remitterWalletAddress')
            ?.setValue(item.chainAccountAddress);
          this.availableCurrecy = [];
          item.walletExtendInfo.forEach((items: any, is: number) => {
            if (is === 0) {
              this.availableCurrecyModel = items.digitalCurrencyName;
              this.validateForm
                .get('remitterBankName')
                ?.setValue(items.bankName);
              this.validateForm
                .get('remitterBankId')
                ?.setValue(items.bankAccountId);
              this.validateForm
                .get('availableBalance')
                ?.setValue(items.cbdcCount);
            }

            this.availableCurrecy.push({
              label: items.digitalSymbol,
              value: items.digitalCurrencyName,
              bankName: items.bankName,
              cbdcCount: items.cbdcCount
            });
          });
        }
        this.remitterWalletAddressList.push({
          label: item.chainAccountAddress,
          value: item.chainAccountAddress,
          walletList: item.walletExtendInfo
        });
      });
    });
  }

  onRemitterWalletAddressChange(e: any) {
    const val = this.remitterWalletAddressList.filter(
      (item: any) => item.value === e
    );
    if (val.length === 0) {
      return;
    }
    this.availableCurrecy = [];
    val[0].walletList.forEach((items: any, is: number) => {
      if (is === 0) {
        this.availableCurrecyModel = items.digitalCurrencyName;
        this.validateForm.get('remitterBankName')?.setValue(items.bankName);
        this.validateForm.get('remitterBankId')?.setValue(items.bankAccountId);
        this.validateForm.get('availableBalance')?.setValue(items.cbdcCount);
      }

      this.availableCurrecy.push({
        label: items.digitalSymbol,
        value: items.digitalCurrencyName,
        bankName: items.bankName,
        cbdcCount: items.cbdcCount
      });
      if (
        this.beneficiaryCurrency &&
        this.beneficiaryCurrency !== this.availableCurrecyModel
      ) {
        this.getExchange();
      } else {
        this.settlementStatus = false;
      }
    });
  }
  // Check field
  getExchange() {
    // this.validateForm.controls['beneficialWalletAddress'].markAsDirty();
    // this.validateForm.controls[
    //   'beneficialWalletAddress'
    // ].updateValueAndValidity({ onlySelf: true });
    this.findExchange();
  }
  // Query exchange rate information
  findExchange() {
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
              ' : ' +
              item.rate +
              ' ' +
              item.to.replace('-UDPN', ''),
            rate: item.rate,
            com: String(
              item.smChargeModel === 0
                ? (this.validateForm.get('amount')?.value / item.rate) *
                    item.smValue >
                  item.smMaxFee
                  ? item.smMaxFee
                  : (this.validateForm.get('amount')?.value / item.rate) *
                    item.smValue
                : item.smValue
            ).replace(/^(.*\..{2}).*$/, '$1'),
            total: String(
              this.validateForm.get('amount')?.value / item.rate +
                (item.smChargeModel === 0
                  ? (this.validateForm.get('amount')?.value / item.rate) *
                      item.smValue >
                    item.smMaxFee
                    ? item.smMaxFee
                    : (this.validateForm.get('amount')?.value / item.rate) *
                      item.smValue
                  : item.smValue)
            ).replace(/^(.*\..{2}).*$/, '$1')
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
        if (
          this.beneficiaryCurrency &&
          this.beneficiaryCurrency !== this.availableCurrecyModel
        ) {
          this.findExchange();
        }
      });
  }
  // Monitor Currency & Interbank Settlement Amount input
  formEventCurrencyInterbankSettlementAmount() {
    this.validateForm
      .get('amount')
      ?.valueChanges.pipe(debounceTime(1000))
      .subscribe((res) => {
        if (
          this.beneficiaryCurrency !== '' &&
          this.beneficiaryCurrency !== this.availableCurrecyModel
        ) {
          this.findExchange();
        }
      });
  }
  onAvailableCurrecy(e: any) {
    const val = this.availableCurrecy.filter((item: any) => item.value === e);
    this.availableCurrecyModel = e;
    this.validateForm.get('availableBalance')?.setValue(val[0].cbdcCount);
    this.validateForm.get('remitterBankName')?.setValue(val[0].bankName);
    if (this.beneficiaryCurrency !== e) {
      this.getExchange();
    } else {
      this.settlementStatus = false;
    }
  }
  onBeneficialWalletAddressChange(e: number) {
    // 设置amount单位的数组
    this.newAmountArr = this.BeneficiaryArr[e]['beneficiaryWalletExtendeds'];
    this.beneficiaryCurrency =
      this.BeneficiaryArr[e]['beneficiaryWalletExtendeds'][0][
        'digitalCurrencyName'
      ];
    // 设置Beneficiary's Bank Name
    this.validateForm
      .get('newBeneficialBankName')
      ?.setValue(
        this.BeneficiaryArr[e]['beneficiaryWalletExtendeds'][0][
          'centralBankName'
        ]
      );
  }
  onBeneficiaryCurrency(e: any) {
    if (this.beneficiaryCurrency !== this.availableCurrecyModel) {
      this.getExchange();
    } else {
      this.settlementStatus = false;
    }
  }
  onBeneficialBankNameChange(e: number) {
    // 获取对应的Beneficiary's Wallet Address数组
    this.BeneficiaryArr =
      this.beneficialBankNameListAll[e]['beneficiaryWallets'];
    this.validateForm.get('beneficialWalletAddress')?.setValue(0);
    // 设置amount单位的数组
    this.newAmountArr =
      this.beneficialBankNameListAll[e]['beneficiaryWallets'][0][
        'beneficiaryWalletExtendeds'
      ];
    this.beneficiaryCurrency =
      this.beneficialBankNameListAll[e]['beneficiaryWallets'][0][
        'beneficiaryWalletExtendeds'
      ][0]['digitalCurrencyName'];
    // 设置Beneficiary's Bank Name
    this.validateForm
      .get('newBeneficialBankName')
      ?.setValue(
        this.beneficialBankNameListAll[e]['beneficiaryWallets'][0][
          'beneficiaryWalletExtendeds'
        ][0]['centralBankName']
      );
    this.cdr.markForCheck();
    return;

    const val = this.beneficialBankNameList.filter(
      (item: any) => item.value === e
    );
    this.validateForm.get('beneficialBankName')?.setValue(val[0].label);
    this.beneficiaryCurrency = val[0].currencyValue;
    this.beneficiaryCurrencyName = val[0].currencyName;
    if (this.availableCurrecyModel !== val[0].currencyValue) {
      this.getExchange();
    } else {
      this.settlementStatus = false;
    }
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
    this.isVisibleEnterPassword = false;
    this.isLoading = true;
    this.transferService
      .transfer({
        beneficiaryBankId: this.validateForm.get('beneficialBankId')?.value,
        beneficiaryWalletAddress: this.validateForm.get(
          'beneficialWalletAddress'
        )?.value,
        interbankSettlementAmount: this.validateForm.get('amount')?.value,
        remittanceInformation: this.validateForm.get('remittanceInformation')
          ?.value,
        remitterWalletId: this.validateForm.get('remitterBankId')?.value,
        rateId:
          this.checkedItemComment.length > 0
            ? this.checkedItemComment[0].rateId
            : ' ',
        passWord: fnEncrypts(this.passwordForm.getRawValue(), aesKey, aesVi),
        toCommercialBankId:0
      })
      .subscribe((res) => {
        if (res) {
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
        }
        this.isLoading = false;
        this.isVisible = false;
      });
  }
}
