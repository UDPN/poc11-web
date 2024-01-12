/*
 * @Author: zhangxuefeng
 * @Date: 2023-10-27 14:54:28
 * @LastEditors: zhangxuefeng
 * @LastEditTime: 2023-10-30 12:08:12
 * @Description:
 */
import { Component, OnInit } from '@angular/core';
import { CurrencyStoreService } from '../../store/currency.service';
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

@Component({
  selector: 'app-currency-capital-fix',
  templateUrl: './currency-capital-fix.component.html',
  styleUrls: ['./currency-capital-fix.component.less'],
  providers: [DestroyService]
})
export class CurrencyCapitalFixComponent implements OnInit {
  typeStats$ = this._currencyStoreService.tystatus$;
  public outCapitalPool$ = this._currencyStoreService.outCapitalPool$;
  public outExchangeRate$ = this._currencyStoreService.outExchangeRate$;
  public selectOptionPacths$ = new BehaviorSubject<any[]>([]);
  protected selectOptionPacthsLenght = 0;
  public selectOptionAll$ = new BehaviorSubject<any[]>([]);
  public newOptionArr: any[] = [];
  public zeroShowStatus$ = this._currencyStoreService.zeroShowStatus$;

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
    public _commonService: CommonService
  ) {}
  ngOnInit(): void {
    this.addField();
    this.typeStats$.pipe(takeUntil(this.destroy$)).subscribe((res) => {
      // 1 add 0 edit
      if (res === 1) {
        this.initSelectOption(res);
        return;
      }
      if (res === 0) {
        this.initSelectOptionEdit(res);
        return;
      }
    });
  }
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
        this.fb.control('', Validators.required)
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
          arr.push(item.currency + '-' + item.platform);
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
      this.outCapitalPool$.pipe(takeUntil(this.destroy$)).subscribe((items) => {
        items.forEach((item, i) => {
          arr.push(item.capitalPoolCurrency + '-' + item.capitalPoolPlatform);
        });
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
      this.validateForm.removeControl(i.capitalPoolAddress);
    }
  }
  onChange(
    i: { id: number; crrency: any; status: any; capitalPoolAddress: any },
    e: MouseEvent
  ) {
    this.setOldArr(i.id, e.toString());
    this.initNewSelectOption();
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
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
