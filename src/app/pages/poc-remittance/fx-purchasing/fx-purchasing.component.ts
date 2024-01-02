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
import { FxPurchasingService } from '@app/core/services/http/poc-remittance/fx-purchasing/fxPurchasing.service';
import { ThemeService } from '@app/core/services/store/common-store/theme.service';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzModalService } from 'ng-zorro-antd/modal';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-fx-purchasing',
  templateUrl: './fx-purchasing.component.html',
  styleUrls: ['./fx-purchasing.component.less']
})
export class FxPurchasingComponent implements OnInit, AfterViewInit {
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
  constructor(
    private pocCapitalPoolService: PocCapitalPoolService,
    private themesService: ThemeService,
    private dataService: LoginService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private fxPurchasingService: FxPurchasingService,
    private modal: NzModalService
  ) {}
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
    this.initData();
    this.validateForm = this.fb.group({
      receivingBankName: [null, [Validators.required]],
      receivingBankId: [null, [Validators.required]],
      receivingWalletAddress: [null, [Validators.required]],
      amount: [null, [Validators.required]],
      transactionWalletAddressId: [0, [Validators.required]],
      bankAccountId: ['', [Validators.required]],
      transactionWalletAddress: ['', [Validators.required]],
      availableBalance: [null, [Validators.required]],
      transactionBankName: [null, [Validators.required]]
    });
    this.passwordForm = this.fb.group({
      password: ['', [Validators.required]]
    });
  }
  initData() {
    this.fxPurchasingService.fetchFXPurchase().subscribe((res) => {
      this.fxPurchaseData = res;
      this.onPurchase(0);
    });
    this.fxPurchasingService.fetchFxReceiving().subscribe((res) => {
      this.fxReceivingData = [];
      res.forEach((item: any, i: number) => {
        this.fxReceivingData.push({
          bankId: item.bankId,
          bankName: item.bankName,
          currecy: item.digitalCurrencyName,
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
    this.reveingCurrecy = this.fxReceivingData[e]?.currecy;
    this.receivingWalletAddressList = this.fxReceivingData[e]?.walletAddress;
    if (this.reveingCurrecy === this.purchCurrecy) {
      this.setShowStatus(true);
    } else {
      this.setShowStatus(false);
    }
  }
  onPurchase(e: any) {
    this.purIndex = e;
    this.validateForm
      .get('transactionWalletAddress')
      ?.setValue(this.fxPurchaseData[e].chainAccountAddress);
    this.validateForm
      .get('bankAccountId')
      ?.setValue(this.fxPurchaseData[e]['walletExtendInfo'][e].bankAccountId);
    this.validateForm
      .get('transactionBankName')
      ?.setValue(this.fxPurchaseData[e]['walletExtendInfo'][e].bankName);
    this.validateForm
      .get('availableBalance')
      ?.setValue(this.fxPurchaseData[e]['walletExtendInfo'][e].cbdcCount);
    this.purchCurrecyList = Array.from(
      this.fxPurchaseData[e]['walletExtendInfo'],
      ({ digitalCurrencyName }) => digitalCurrencyName
    );
    this.onPurchCurrecy(0);
    if (this.reveingCurrecy === this.purchCurrecy) {
      this.setShowStatus(true);
    } else {
      this.setShowStatus(false);
    }
  }
  onPurchCurrecy(e: number) {
    this.purchCurrecy = this.purchCurrecyList[e];
    this.validateForm
      .get('transactionBankName')
      ?.setValue(
        this.fxPurchaseData[this.purIndex]['walletExtendInfo'][e].bankName
      );
    this.validateForm
      .get('availableBalance')
      ?.setValue(
        this.fxPurchaseData[this.purIndex]['walletExtendInfo'][e].cbdcCount
      );
    if (this.reveingCurrecy === this.purchCurrecy) {
      this.setShowStatus(true);
    } else {
      this.setShowStatus(false);
    }
  }
  setShowStatus(status: boolean) {
    this.showStatus = status;
    this.cdr.markForCheck();
  }
  fromEventAmount() {
    this.validateForm
      .get('amount')
      ?.valueChanges.pipe(debounceTime(1000))
      .subscribe((_) => {
        if (this.reveingCurrecy !== this.purchCurrecy) {
          this.nzLoading = true;
          this.cdr.markForCheck();
          this.fxPurchasingService
            .fetchRateInfo({
              from: this.validateForm.get('receivingWalletAddress')?.value,
              to: this.validateForm.get('transactionWalletAddress')?.value
            })
            .subscribe((res) => {
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
              this.dataList.forEach((item: any, index: number) => {
                if (this.radioValue === 0) {
                  this.checkedItemComment.push(item);
                }
              });
              this.cdr.markForCheck();
            });
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
        passWord: this.passwordForm.get('password')?.value,
        rateId: this.checkedItemComment[0].rateId,
        transactionWalletId: this.validateForm.get('bankAccountId')?.value
      })
      .subscribe((res) => {
        if (res) {
          this.modal
            .success({
              nzTitle: 'Success',
              nzContent: 'Transfer successful!'
            })
            .afterClose.subscribe((_) => {
              this.initData();
              this.validateForm.reset();
              this.passwordForm.reset();
            });
        }
        this.isLoading = false;
        this.isVisible = false;
      });
  }
}
