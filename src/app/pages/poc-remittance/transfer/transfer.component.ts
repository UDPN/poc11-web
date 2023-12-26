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
import { TransferService } from '@app/core/services/http/poc-remittance/transfer/transfer.service';
import { ThemeService } from '@app/core/services/store/common-store/theme.service';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
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
  remitterWalletAddressList: any[] = [];
  tableConfig!: AntTableConfig;
  setOfCheckedId = new Set<string>();
  checkedItemComment: NzSafeAny[] = [];
  radioValue: any = '';
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
  constructor(
    private pocCapitalPoolService: PocCapitalPoolService,
    private themesService: ThemeService,
    private dataService: LoginService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private transferService: TransferService,
    private modal: NzModalService
  ) {}
  ngAfterViewInit(): void {
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
      beneficialBankName: ['', [Validators.required]],
      beneficialBankId: ['', [Validators.required]],
      beneficialWalletAddress: [null, [Validators.required]],
      amount: [null, [Validators.required]],
      remitterWalletAddress: [null, [Validators.required]],
      availableBalance: [null, [Validators.required]],
      remitterBankName: [null, [Validators.required]],
      remittanceInformation: [null, [Validators.required]]
    });

    this.passwordForm = this.fb.group({
      password: ['', [Validators.required]]
    });
  }
  initData() {
    this.transferService.fetchBankList().subscribe((res: any) => {
      res.forEach((item: any) => {
        this.beneficialBankNameList.push({
          label: item.bank_name,
          value: item.central_bank_id,
          currencyName: item.digital_currency_name
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
                .get('availableBalance')
                ?.setValue(items.cbdcCount);
            }

            this.availableCurrecy.push({
              label: items.digitalCurrencyName,
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
      }

      this.availableCurrecy.push({
        label: items.digitalCurrencyName,
        value: items.digitalCurrencyName,
        bankName: items.bankName,
        cbdcCount: items.cbdcCount
      });
      if (this.beneficiaryCurrency !== this.availableCurrecyModel) {
        this.getExchange();
      } else {
        this.settlementStatus = false;
      }
    });
  }
  // 校验字段
  getExchange() {
    this.validateForm.controls['beneficialWalletAddress'].markAsDirty();
    this.validateForm.controls[
      'beneficialWalletAddress'
    ].updateValueAndValidity({ onlySelf: true });
    this.findExchange();
  }
  // 查询汇率信息
  findExchange() {
    this.settlementStatus = true;
    this.nzLoading = true;
    if (this.validateForm.get('beneficialWalletAddress')?.valid) {
      this.transferService
        .exchange({
          from: this.validateForm.get('beneficialWalletAddress')?.value,
          to: this.validateForm.get('remitterWalletAddress')?.value
        })
        .subscribe((res) => {
          console.log(res);
          let resultData: any[] = [];
          res.forEach((item: any) => {
            resultData.push({
              rateId: item.rateId,
              sp: item.provider,
              currency: '1 ' + item.from + '->' + item.to,
              rate: item.rate,
              com:
                item.smChargeModel === 0
                  ? item.smValue > item.smMaxFee
                    ? item.smMaxFee
                    : item.smValue
                  : item.smValue,
              total: String(
                this.validateForm.get('amount')?.value * item.rate +
                  (item.smChargeModel === 0
                    ? item.smValue > item.smMaxFee
                      ? item.smMaxFee
                      : item.smValue
                    : item.smValue)
              ).replace(/^(.*\..{4}).*$/, '$1')
            });
          });
          this.nzLoading = false;
          this.dataList = resultData.sort(this.compare('total'));
          this.cdr.markForCheck();
        });
    }
  }
  compare(p: string) {
    return function (m: any, n: any) {
      var a = m[p];
      var b = n[p];
      return a - b;
    };
  }
  // 监听beneficialWalletAddress输入
  fromEventBeneficialWalletAddress() {
    this.validateForm
      .get('beneficialWalletAddress')
      ?.valueChanges.pipe(debounceTime(1000))
      .subscribe((res) => {
        if (this.beneficiaryCurrency !== this.availableCurrecyModel) {
          this.findExchange();
        }
      });
  }
  // 监听Currency & Interbank Settlement Amount输入
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
  onBeneficialBankNameChange(e: any) {
    if (e === 'all') {
      this.beneficiaryCurrency = '';
      return;
    }

    const val = this.beneficialBankNameList.filter(
      (item: any) => item.value === e
    );
    this.validateForm.get('beneficialBankId')?.setValue(e);
    // this.validateForm.get('beneficialBankName')?.setValue(ss);
    this.beneficiaryCurrency = val[0].currencyName;
    if (this.availableCurrecyModel !== val[0].currencyName) {
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
    console.log(this.checkedItemComment);
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
    // this.isVisible = true;
    if (this.validateForm.valid) {
      if (this.beneficiaryCurrency !== this.availableCurrecyModel) {
        if (this.checkedItemComment.length === 0) {
          this.modal.error({
            nzTitle: 'Error',
            nzContent: '请选择汇率 !'
          });
          return;
        }
      }
      this.isVisible = true;
      console.log('submit', this.validateForm.value);
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
    this.isVisible = false;
    this.isVisibleEnterPassword = true;
  }

  cancelEnterPassword() {
    this.isVisibleEnterPassword = false;
  }
  confirmEnterPassword() {}
}
