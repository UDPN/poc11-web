/*
 * @Author: zhangxuefeng
 * @Date: 2023-10-27 14:54:28
 * @LastEditors: zhangxuefeng
 * @LastEditTime: 2023-10-30 19:37:23
 * @Description:
 */
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DestroyService } from '@app/core/services/common/destory.service';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ForeignExchangeApplyService } from '@app/core/services/http/poc-profile/foreign-exchange-apply/foreign-exchange-apply.service';
import { CommonService } from '@app/core/services/http/common/common.service';
import {
  FormControl,
  FormRecord,
  NonNullableFormBuilder,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { CurrencyStoreService } from '@app/pages/poc-profile/foreign-exchange-apply/store/currency.service';
import { PocActivateSettlementService } from '@app/core/services/http/poc-activate-settlement/poc-activate-settlement.service';

@Component({
  selector: 'app-add-pool',
  templateUrl: './add-pool.component.html',
  styleUrls: ['./add-pool.component.less'],
  providers: [DestroyService]
})
export class AddPoolComponent implements OnInit {
  typeStats$ = this._currencyStoreService.tystatus$;
  public outCapitalPool$ = this._currencyStoreService.outCapitalPool$;
  public outExchangeRate$ = this._currencyStoreService.outExchangeRate$;
  public selectOptionPacths$ = new BehaviorSubject<any[]>([]);
  protected selectOptionPacthsLenght = 0;
  public selectOptionAll$ = new BehaviorSubject<any[]>([]);
  public selectOptionPool$ = new BehaviorSubject<any[]>([]);
  public newOptionArr: any[] = [];
  public zeroShowStatus$ = this._currencyStoreService.zeroShowStatus$;
  isLoading = false;
  validateForm: FormRecord<FormControl<string>> = this.fb.record({});
  listOfControl: Array<{
    id: number;
    crrency: any;
    status: any;
    capitalPoolAddress: any;
  }> = [];
  listCheckArr: any[] = [];
  constructor(
    private fb: NonNullableFormBuilder,
    private _currencyStoreService: CurrencyStoreService,
    private destroy$: DestroyService,
    private _foreignExchangeApplyService: ForeignExchangeApplyService,
    private pocActivateSettlementService: PocActivateSettlementService,
    public _commonService: CommonService,
    public message: NzMessageService,
    private modal: NzModalService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute
  ) { }
  ngOnInit(): void {
    this.addField();
    this.initSelectOptionEdit(0);
    this.route.queryParams.subscribe((param) => {
      this.validateForm.get('currency0')?.setValue(param['currency']);
    });
  }

  capitalPoolAddressValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (!/^[0][x][0-9a-fA-F]{40}$/.test(control.value)) {
      return { regular: true, error: true };
    }
    return {};
  };

  protected showAdd() {
    this.zeroShowStatus$.next(true);
  }
  protected hideAdd() {
    this.zeroShowStatus$.next(false);
  }
  protected addField(e?: MouseEvent): void {
    e?.preventDefault();
    if (this.validateForm.valid) {
      const id =
        this.listOfControl.length > 0
          ? this.listOfControl[this.listOfControl.length - 1].id + 1
          : 0;

      const control = {
        id,
        crrency: `currency${id}`,
        status: `status${id}`,
        capitalPoolAddress: `capitalPoolAddress${id}`
      };
      const index = this.listOfControl.push(control);
      this.validateForm.addControl(
        this.listOfControl[index - 1].crrency,
        this.fb.control('', Validators.required)
      );
      this.validateForm.addControl(
        this.listOfControl[index - 1].status,
        this.fb.control('false', Validators.required)
      );

      this.validateForm.addControl(
        this.listOfControl[index - 1].capitalPoolAddress,
        this.fb.control('', [Validators.required, this.capitalPoolAddressValidator])
      );
      if (id > 0) {
        this.watchSelectOptionPacth(
          1,
          this.validateForm.get(`currency${id - 1}`)?.value,
          id
        );
      }
      this.initNewSelectOption();
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
  private initSelectOption(type: number) {
    this._commonService
      .commonApi({
        dropDownTypeCode: 'drop_down_platform_currency_info',
        csePCode: 'FXSP_PLATFORM_CURRENCY_VAILD'
      })
      .subscribe((res: any) => {
        let arr: string[] = [];
        res.dataInfo.map((item: any) => {
          arr.push(item.currency);
        });
        if (type === 1) {
          this.selectOptionPacths$.next(arr);
          this.selectOptionPacthsLenght = arr.length;
        }
        if (type === 0) {
          this.selectOptionAll$.next(arr);
          this.selectOptionPacthsLenght = arr.length;
        }
      });
  }


  private initSelectOptionEdit(type: number) {
    this._foreignExchangeApplyService.getSpApprovedInfo().subscribe((res) => {
      // this.outCapitalPool$.next(res.outCapitalPool);
      // this.outExchangeRate$.next(res.outExchangeRate);
      this._currencyStoreService.setOutExchangeRateStore(res.outExchangeRate);
      this._currencyStoreService.setOutCapitalPoolStore(res.outCapitalPool);

      this.initSelectOption(type);
      let arr: string[] = [];
      this.outCapitalPool$
        .pipe(takeUntil(this.destroy$))
        .subscribe((items: any[]) => {
          if (items !== null) {
            items.forEach((item, i) => {
              arr.push(
                item.capitalPoolCurrency
              );
            });
          }
        });
      this.selectOptionAll$.pipe(takeUntil(this.destroy$)).subscribe((data) => {
        let arrs: string[] = [];
        data.forEach((item, i) => {
          if (!arr.includes(item)) {
            arrs.push(item);
          }
        });
        this.selectOptionPacths$.next(arrs);
        this.selectOptionPacthsLenght = arrs.length;
      });
    });
  }
  private initNewSelectOption() {
    let inArr: any[] = [];
    let reg = /^currency/;
    let obj = this.validateForm.value;
    for (let i in obj) {
      if (reg.test(i)) {
        inArr.push(obj[i]);
      }
    }
    this.newOptionArr = inArr;
    this._currencyStoreService.setNewCapitalPoolStore(inArr);
  }
  private watchSelectOptionPacth(type = 1, str: any, index: number) {
    this.selectOptionPacths$.pipe(takeUntil(this.destroy$)).subscribe((res) => {
      if (type === 1) {
        this.validateForm.get(`status${index - 1}`)?.setValue('true');
        if (res.includes(str)) {
          res.splice(res.indexOf(str), 1);
        }
      }
      if (type === 2) {
        this.validateForm.get(`status${index - 1}`)?.setValue('false');
        if (str !== '') {
          this.listCheckArr[index].map((item: string) => {
            if (!res.includes(item)) {
              res.push(item);
            }
          });
        }
        if (index === 1) {
          this.listCheckArr[0].map((item: string) => {
            if (!res.includes(item)) {
              res.push(item);
            }
          });
        }
      }
    });
  }
  removeField(
    i: { id: number; crrency: any; status: any; capitalPoolAddress: any },
    e: MouseEvent
  ): void {
    e.preventDefault();
    if (this.listOfControl.length > 1) {
      this.setSelectOptionPool(this.validateForm.get(`currency${i.id - 1}`)?.value);
      this.watchSelectOptionPacth(
        2,
        this.validateForm.get(`currency${i.id}`)?.value,
        i.id
      );
      if (
        this.newOptionArr.includes(
          this.validateForm.get(`currency${i.id}`)?.value
        )
      ) {
        this.newOptionArr.splice(
          this.newOptionArr.indexOf(
            this.validateForm.get(`currency${i.id}`)?.value
          ),
          1
        );
        this._currencyStoreService.setNewCapitalPoolStore(this.newOptionArr);
      }
      const index = this.listOfControl.indexOf(i);
      this.listOfControl.splice(index, 1);
      this.validateForm.removeControl(i.crrency);
      this.validateForm.removeControl(i.status);
      this.validateForm.removeControl(i.capitalPoolAddress);
    }
  }
  onChange(
    i: { id: number; crrency: any; status: any; capitalPoolAddress: any },
    e: MouseEvent
  ) {
    this.setOldArr(i.id, e.toString());
    this.initNewSelectOption();
    this.validateForm.controls[i.capitalPoolAddress].reset();
    this.setSelectOptionPool(e);
  }

  private setSelectOptionPool(e: any) {
    this.pocActivateSettlementService
      .getWalletAdress({ currency: e.toString() })
      .subscribe((res) => {
        this.selectOptionPool$.next(res);
      });
  }

  private setOldArr(index: number, str: string) {
    let ss =
      this.listCheckArr.length === 0
        ? []
        : this.listCheckArr[index] === undefined
          ? []
          : this.listCheckArr[index];
    this.listCheckArr[index] = ss.concat(str);
  }
  onSubmit() {
    if (this.validateForm.valid) {
      let settlementInformations: any[] = [];
      let ss1 = Object.keys(this.validateForm.value);
      ss1.forEach((item: any, i: number) => {
        if (
          this.validateForm.get(
            'capitalPoolAddress' + parseInt((i / 3).toString())
          )?.value !== ''
        ) {
          settlementInformations.push(
            this.initFormData(
              this.validateForm.get('currency' + parseInt((i / 3).toString()))
                ?.value,
              this.validateForm.get(
                'capitalPoolAddress' + parseInt((i / 3).toString())
              )?.value,
              1
            )
          );
        }
      });
      const uniqueArr = [
        ...new Map(
          settlementInformations.map((item) => [item.capitalPoolAddress, item])
        ).values()
      ];
      this.addData(uniqueArr, []);
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
  private initFormData(
    currency: string,
    targetCurrency: string,
    type: number
  ): any {
    if (type === 1) {
      return {
        capitalPoolPlatform: 'UDPN',
        capitalPoolCurrency: currency.split('-')[0] + '-' + currency.split('-')[1],
        capitalPoolAddress: targetCurrency
      };
    }
    return {
      fromPlatform: currency.split('-')[1],
      fromCurrency: currency.split('-')[0],
      toPlatform: targetCurrency.split('-')[1],
      toCurrency: targetCurrency.split('-')[0]
    };
  }
  private addData(arr: any[], arr1: any[]) {
    this.isLoading = true;
    this._foreignExchangeApplyService
      .add({
        settlementInformations: arr,
        exchangeInformations: arr1,
        businessType: 1
      })
      .subscribe({
        next: (res) => {
          if (res.data) {
            this.message
              .success('The data has been submitted!')
              .onClose.subscribe((_) => {
                this.router.navigateByUrl('/poc/poc-capital-pool/capital-pool');
              });
          }
          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.isLoading = false;
          this.cdr.markForCheck();
        }
      });
  }
}
