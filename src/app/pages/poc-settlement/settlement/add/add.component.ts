import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { Location } from '@angular/common';
import { NzMessageService } from 'ng-zorro-antd/message';
import { fnCheckForm } from '@app/utils/tools';
import { debounceTime, finalize, fromEvent, map } from 'rxjs';
import { UserService } from '@app/core/services/http/poc-system/user/user.service';
import { CommonService } from '@app/core/services/http/common/common.service';
import JSZip from 'jszip';
import { SettlementService } from '@app/core/services/http/poc-settlement/settlement/settlement.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.less']
})
export class AddComponent implements OnInit {
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumbs: [],
    extra: '',
    desc: '',
    footer: ''
  };
  validateForm!: FormGroup;
  info: any = {};
  isLoading: boolean = false;
  tempStatus: boolean = true;
  pairedList: any = [];
  chargingModelList: any = [];
  commissionAfter: string = '%';
  maxCommissionAfter: string = '';
  rateList: any = {
    sourceCurrency: '',
    sourcePlatform: '',
    targetCurrency: '',
    targetPlatform: ''
  };
  constructor(private fb: FormBuilder, public routeInfo: ActivatedRoute, private commonService: CommonService, private message: NzMessageService, private settlementService: SettlementService, private cdr: ChangeDetectorRef, private location: Location) { }
  ngAfterViewInit(): void {
    this.fromCommission();
    this.fromMaxCommission();
    this.pageHeaderInfo = {
      title: this.tempStatus === true ? 'Create' : 'Edit',
      breadcrumbs: [
        { name: 'Settlement Management' },
        { name: 'Settlement Model Management', url: '/poc/poc-settlement/settlement' },
        { name: this.tempStatus === true ? 'Create' : 'Edit' }
      ],
      extra: '',
      desc: '',
      footer: ''
    };
  }

  ngOnInit() {
    this.validateForm = this.fb.group({
      pairedExchangeRate: [1, [Validators.required]],
      settlementModelName: [null, [Validators.required]],
      chargingModel: ['1', [Validators.required]],
      commission: [null, [Validators.required]],
      maxCommission: [null, [Validators.required]]
    })
    this.initSelect();
    this.routeInfo.queryParams.subscribe((params: any) => {
      if (JSON.stringify(params) !== '{}') {
        const chargingModel = this.validateForm.get('chargingModel')?.value.toString();
        this.onChangeModel(chargingModel);
        this.tempStatus = false;
        this.getInfo(params['formRateCurrency'], params['formRatePlatform'], params['toRateCurrency'], params['toRatePlatform']);
      } else {
        this.onChangeRate(1);
        this.onChangeModel('1');
      }
    })
  }

  initSelect() {
    this.commonService.commonApi({ dropDownTypeCode: 'drop_down_exchange_rate_info' }).subscribe((res) => {
      this.pairedList = res.dataInfo;
      this.pairedList.map((item: any, i: any) => {
        Object.assign(item, { key: i + 1 })
      })
      this.maxCommissionAfter = this.pairedList[0].sourceCurrency + '-' + this.pairedList[0].sourcePlatform + ' (Per Transaction)';
    })
    this.commonService.commonApi({ dropDownTypeCode: 'drop_down_business_status_info', csePCode: 'FXSP_CHARGING_MODEL' }).subscribe((res) => {
      this.chargingModelList = res.dataInfo;
    })
  }

  fromCommission() {
    const el: any = document.getElementById('inputCommission');
    const inputValue = fromEvent(el, 'keyup');
    inputValue.pipe(
      debounceTime(200),
      map((e: any) => {
        let data = e.target.value;
        let sender = this.validateForm.get("commission");
        let chargingModel = this.validateForm.get("chargingModel");
        sender?.setValue(sender?.value.replace(/[^\-?\d.]/g, ''));
        let posDots = data.lastIndexOf(".");
        let posDotss = data.indexOf(".");
        if (posDots === 0) {
          sender?.setValue('');
          return;
        }
        if (posDots > posDotss) {
          sender?.setValue(sender?.value.substring(0, posDotss + 1));
          return;
        }
        let rf = sender?.value.split(".");
        if (chargingModel?.value === '1') {
          if (rf.length > 1 && rf[1].length > 0 && rf[1].length > 6) {
            rf[1] = rf[1].substring(0, 6);
            sender?.setValue(rf[0] + '.' + rf[1]);
            return;
          }
        } else {
          if (rf.length > 1 && rf[1].length > 0 && rf[1].length > 8) {
            rf[1] = rf[1].substring(0, 8);
            sender?.setValue(rf[0] + '.' + rf[1]);
            return;
          }
        }
      }),
    ).subscribe()
  }

  fromMaxCommission() {
    const el: any = document.getElementById('inputMaxCommission');
    const inputValue = fromEvent(el, 'keyup');
    inputValue.pipe(
      debounceTime(200),
      map((e: any) => {
        let data = e.target.value;
        let sender = this.validateForm.get("maxCommission");
        sender?.setValue(sender?.value.replace(/[^\-?\d.]/g, ''));
        let posDots = data.lastIndexOf(".");
        let posDotss = data.indexOf(".");
        if (posDots === 0) {
          sender?.setValue('');
          return;
        }
        if (posDots > posDotss) {
          sender?.setValue(sender?.value.substring(0, posDotss + 1));
          return;
        }
        let rf = sender?.value.split(".");
        if (rf.length > 1 && rf[1].length > 0 && rf[1].length > 8) {
          rf[1] = rf[1].substring(0, 8);
          sender?.setValue(rf[0] + '.' + rf[1]);
          return;
        }
      }),
    ).subscribe()
  }

  bankNameValidator = (control: UntypedFormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (!(/^[^a-zA-Z][\s\S]{1,49}$/).test(control.value)) {
      return { regular: true, error: true };
    }
    return {};
  };

  onChangeRate(event: any) {
    this.pairedList.map((item: any) => {
      if (event === item.key) {
        this.rateList.sourceCurrency = item.sourceCurrency;
        this.rateList.sourcePlatform = item.sourcePlatform;
        this.rateList.targetCurrency = item.targetCurrency;
        this.rateList.targetPlatform = item.targetPlatform;
      }
    })
    if (this.validateForm.get('chargingModel')?.value === '1') {
      this.maxCommissionAfter = this.rateList.sourceCurrency + '-' + this.rateList.sourcePlatform + ' (Per Transaction)';
    } else {
      this.commissionAfter = this.rateList.sourceCurrency + '-' + this.rateList.sourcePlatform + ' (Per Transaction)';
    }
  }

  onChangeModel(event: any) {
    this.validateForm?.get('commission')?.reset();
    this.pairedList?.map((item: any) => {
      if (item.key === this.validateForm.get('pairedExchangeRate')?.value) {
        if (event === '1') {
          console.log(22222);
          this.commissionAfter = '%';
          this.maxCommissionAfter = item.sourceCurrency + '-' + item.sourcePlatform + ' (Per Transaction)';
          this.validateForm?.addControl('maxCommission', new FormControl('', [Validators.required]));
        } else {
          console.log(33333333);
          this.commissionAfter = item.sourceCurrency + '-' + item.sourcePlatform + ' (Per Transaction)';
          this.validateForm?.removeControl('maxCommission');
        }
      }
    })
  }

  getInfo(formRateCurrency: string, formRatePlatform: string, toRateCurrency: string, toRatePlatform: string): void {
    this.settlementService.getInfo({ formRateCurrency, formRatePlatform, toRateCurrency, toRatePlatform }).subscribe((res: any) => {
      this.info = res;
      this.validateForm.get('settlementModelName')?.setValue(res.settlementModelName);
      this.validateForm.get('chargingModel')?.setValue(res.chargingModel === 1 ? '1' : '2');
      this.validateForm.get('commission')?.setValue(res.chargingModel === 1 ? res.ratioCommission : res.regularCommission);
      this.validateForm.get('maxCommission')?.setValue(res.maxCommission);
      this.pairedList.map((item: any) => {
        if (item.sourceCurrency === res.formRateCurrency && item.sourcePlatform === res.formRatePlatform && item.targetCurrency === res.toRateCurrency && item.targetPlatform === res.toRatePlatform) {
          this.validateForm.get('pairedExchangeRate')?.setValue(item.key);
          this.cdr.markForCheck();
        }
      })
      this.cdr.markForCheck();
      return;
    })
  }

  onSubmit() {
    if (!fnCheckForm(this.validateForm)) {
      return;
    }
    this.isLoading = true;
    const params = {
      formRatePlatform: this.rateList.sourcePlatform || this.pairedList[0].sourcePlatform,
      formRateCurrency: this.rateList.sourceCurrency || this.pairedList[0].sourceCurrency,
      toRatePlatform: this.rateList.targetPlatform || this.pairedList[0].targetPlatform,
      toRateCurrency: this.rateList.targetCurrency || this.pairedList[0].targetCurrency,
      settlementModelName: this.validateForm.get('settlementModelName')?.value,
      chargingModel: this.validateForm.get('chargingModel')?.value === '2' ? 2 : 1,
      regularCommission: this.validateForm.get('chargingModel')?.value === '2' ? this.validateForm.get('commission')?.value : '',
      ratioCommission: this.validateForm.get('chargingModel')?.value === '1' ? this.validateForm.get('commission')?.value : '',
      maxCommission: this.validateForm.get('maxCommission')?.value
    }
    if (this.tempStatus === true) {
      this.settlementService.add(params).pipe(finalize(() => this.isLoading = false)).subscribe({
        next: res => {
          if (res) {
            this.message.success('Add successfully!', { nzDuration: 1000 }).onClose.subscribe(() => {
              this.validateForm.reset();
              this.location.back();
            });
          }
          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error: err => {
          this.isLoading = false;
          this.cdr.markForCheck();
        }
      })
    } else {
      this.settlementService.edit(params).pipe(finalize(() => this.isLoading = false)).subscribe({
        next: res => {
          if (res) {
            this.message.success('Edit successfully!', { nzDuration: 1000 }).onClose.subscribe(() => {
              this.validateForm.reset();
              this.location.back();
            });
          }
          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error: err => {
          this.isLoading = false;
          this.cdr.markForCheck();
        }
      })
    }
  }

  onBack() {
    this.location.back();
  }

}
