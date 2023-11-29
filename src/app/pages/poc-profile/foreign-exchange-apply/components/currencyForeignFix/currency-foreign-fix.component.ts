/*
 * @Author: zhangxuefeng
 * @Date: 2023-10-27 14:26:57
 * @LastEditors: zhangxuefeng
 * @LastEditTime: 2023-10-30 20:39:49
 * @Description:
 */
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { CurrencyStoreService } from '../../store/currency.service';
import { DestroyService } from '@app/core/services/common/destory.service';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  FormControl,
  FormRecord,
  NonNullableFormBuilder,
  UntypedFormControl,
  Validators
} from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ForeignExchangeApplyService } from '@app/core/services/http/poc-profile/foreign-exchange-apply/foreign-exchange-apply.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-currency-foreign-fix',
  templateUrl: './currency-foreign-fix.component.html',
  styleUrls: ['./currency-foreign-fix.component.less'],
  providers: [DestroyService]
})
export class CurrencyForeignFixComponent implements OnInit, AfterViewInit {
  @Input() formData!: FormRecord<FormControl<string>>;
  @Output('submit') submitEmitter = new EventEmitter<any>();
  public currencyChosen$ = new BehaviorSubject<string[]>([]);
  public outExchangeRate$ = this._currencyStoreService.outExchangeRate$;
  validateForm: FormRecord<FormControl<string>> = this.fb.record({});
  listOfControl: Array<{
    id: number;
    crrency: any;
    status: any;
    tCrrency: any;
  }> = [];
  public selectOption$ = new BehaviorSubject<any[]>([]);
  public selectOption1$ = new BehaviorSubject<any[]>([]);
  public existRatePair: any[] = [];
  public existNewRatePair: any[] = [];
  isLoading = false;
  type = 1;
  zeroStatus = false;
  allSsr: any[] = [];
  dast: string[] = [];
  constructor(
    private fb: NonNullableFormBuilder,
    private _currencyStoreService: CurrencyStoreService,
    private _foreignExchangeApplyService: ForeignExchangeApplyService,
    private destroy$: DestroyService,
    public message: NzMessageService,
    private modal: NzModalService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {}
  ngAfterViewInit(): void {}
  ngOnInit(): void {
    this._foreignExchangeApplyService.getSpApprovedInfo().subscribe((res) => {
      this._currencyStoreService.setOutCapitalPoolStore(res.outCapitalPool);
    });
    this.addField();
    this.buildOption();
    this.addListen();
  }
  private addListen() {
    this._currencyStoreService
      .getTystatusStore()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.type = res;
      });
    this._currencyStoreService
      .getZeroShowStatusStore()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.zeroStatus = res;
      });
  }
  private checkFormValue(id: number, type: number): boolean {
    let data: any = this.validateForm.get(`currency${id - 1}`)?.value;
    let data1: any = this.validateForm.get(`tCrrency${id - 1}`)?.value;
    if (data === data1) {
      this.modal.warning({
        nzTitle: 'Warning',
        nzContent: 'Base Currency and Quote Currency are consistent !'
      });
      return false;
    }
    for (let i = 0; i < this.existRatePair.length; i++) {
      if (this.existRatePair[i].join('') === [data, data1].join('')) {
        this.modal.warning({
          nzTitle: 'Warning',
          nzContent: 'Exchange rate pair added!'
        });
        return false;
      }
    }
    if (type === 1) {
      this.existRatePair.push([data, data1]);
    }

    return true;
  }

  protected addField(e?: MouseEvent): void {
    e?.preventDefault();
    this.route.queryParams.subscribe((param) => {
      let ss =
        param['transactionCurrency'] === undefined
          ? []
          : param['transactionCurrency'].split('->');
      if (this.validateForm.valid) {
        const id =
          this.listOfControl.length > 0
            ? this.listOfControl[this.listOfControl.length - 1].id + 1
            : 0;
        if (id !== 0) {
          if (!this.checkFormValue(id, 1)) {
            return;
          }
        }
        const control = {
          id,
          crrency: `currency${id}`,
          status: `status${id}`,
          tCrrency: `tCrrency${id}`
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
          this.listOfControl[index - 1].tCrrency,
          this.fb.control('', [Validators.required])
        );
        if (id > 0) {
          this.validateForm.get(`status${id - 1}`)?.setValue('true');
        }

        this.removeFieldAll(id);
        if (ss.length > 0) {
          this.validateForm.get('currency0')?.setValue(ss[0]);
          setTimeout(() => {
            this.onChange(ss[0]);
          }, 1000);
        }
      } else {
        Object.values(this.validateForm.controls).forEach((control) => {
          if (control.invalid) {
            control.markAsDirty();
            control.updateValueAndValidity({ onlySelf: true });
          }
        });
      }
    });
  }
  private removeFieldAll(id: number): void {
    if (id > 0) {
      let data: any = this.validateForm.get(`currency${id - 1}`)?.value;
      let data1: any = this.validateForm.get(`tCrrency${id - 1}`)?.value;
      for (let i = 0; i < this.allSsr.length; i++) {
        if (this.allSsr[i].join('') === [data, data1].join('')) {
          this.allSsr.splice(i, 1);
        }
      }
    }
  }
  private addFieldAll(id: number): void {
    if (id > 0) {
      let data: any = this.validateForm.get(`currency${id}`)?.value;
      let data1: any = this.validateForm.get(`tCrrency${id}`)?.value;
      if (data !== undefined && data1 !== undefined) {
        for (let i = 0; i < this.allSsr.length; i++) {
          if (this.allSsr[i].join('') !== [data, data1].join('')) {
            this.allSsr.push([data, data1]);
          }
        }
      }
    }
  }
  removeField(
    i: { id: number; crrency: any; status: any; tCrrency: any },
    e: MouseEvent
  ): void {
    e.preventDefault();
    if (this.listOfControl.length > 1) {
      this.validateForm.get(`status${i.id - 1}`)?.setValue('false');
      this.existRatePair.pop();
      const index = this.listOfControl.indexOf(i);
      this.listOfControl.splice(index, 1);
      this.validateForm.removeControl(i.crrency);
      this.validateForm.removeControl(i.tCrrency);
      this.validateForm.removeControl(i.status);
      this.addFieldAll(i.id);
    }
  }
  public onChange(e: any) {
    let list1: string[] = [];
    for (let i = 0; i < this.allSsr.length; i++) {
      if (this.allSsr[i][0] === e) {
        list1.push(this.allSsr[i][1]);
      }
    }
    this.selectOption1$.next(list1);
  }
  private setSelectOption() {
    this._currencyStoreService
      .getOutExchangeRateStore()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res !== null) {
          let newArr: any[] = [];
          res.forEach((item: any, i: number) => {
            newArr[i] =
              item.formCurrency +
              '-' +
              item.formPlatform +
              ',' +
              item.toCurrency +
              '-' +
              item.toPlatform;
          });

          newArr.forEach((items: any, is: number) => {
            newArr[is] = items.split(',');
          });
          this.existRatePair = newArr;
          for (let j = 0; j < newArr.length; j++) {
            for (let i = 0; i < this.allSsr.length; i++) {
              if (
                this.allSsr[i].join('') ===
                [newArr[j][0], newArr[j][1]].join('')
              ) {
                this.allSsr.splice(i, 1);
              }
            }
          }
        }
      });
  }
  private buildOption() {
    this._currencyStoreService
      .getOutCapitalPoolStore()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        let newArr: any[] = [];
        res.forEach((item: any) => {
          newArr.push(
            item.capitalPoolCurrency + '-' + item.capitalPoolPlatform
          );
        });
        let ssr = this.permutationAndCombination(newArr, 2);
        this.allSsr = ssr;
        this.setSelectOption();
        this.existNewRatePair = newArr;
        this.selectOption$.next(newArr);
      });

    this._currencyStoreService
      .getNewCapitalPoolStore()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (this.type === 1) {
          if (res.length > 0) {
            this.selectOption$.next(
              this.existNewRatePair.concat(res.filter((str: string) => !!str))
            );
          }
        }
        if (this.type === 0) {
          if (res.length > 0 && this.existNewRatePair.length > 0) {
            this.selectOption$.next(
              this.existNewRatePair.concat(res.filter((str: string) => !!str))
            );
          }
        }
      });
  }
  permutationAndCombination(
    source: string[] = [],
    selectedLimit: number,
    isPermutation = true
  ) {
    if (!Array.isArray(source)) return source;

    // remove duplicated item
    source = [...new Set(source)];
    selectedLimit = selectedLimit || source.length;

    const result: any[] = [];
    const sourceLen = source.length;

    selectedLimit = selectedLimit > sourceLen ? sourceLen : selectedLimit;

    const innerLoop = (prefix = [], done: any[] = [], index = 0) => {
      const prefixLen = prefix.length;

      for (let i = isPermutation ? 0 : index; i < sourceLen; i++) {
        if (prefixLen > selectedLimit - 1) break;

        // Optimization: Continue to next cycle if current item has be already used for 'prefix'.
        if (done.includes(i)) continue;

        const item = source[i];
        const newItem: any = [...prefix, item];

        if (prefixLen === selectedLimit - 1) {
          result.push(newItem);
        }

        if (prefixLen < selectedLimit - 1) {
          innerLoop(newItem, [...done, i], index++);
        }
      }
    };

    if (source.length) {
      // there is only one case if we want to select all items from source by combination.
      if (!isPermutation && selectedLimit === sourceLen) {
        return source;
      }

      innerLoop();
    }

    return result;
  }
  onSubmitFi() {
    if (this.validateForm.valid) {
      if (!this.checkFormValue(this.listOfControl.length, 2)) {
        return;
      }
      let exchangeInformations: any[] = [];
      let ss = Object.keys(this.validateForm.value);
      ss.forEach((item: any, i: number) => {
        exchangeInformations.push(
          this.initFormData(
            this.validateForm.get('currency' + parseInt((i / 3).toString()))
              ?.value,
            this.validateForm.get('tCrrency' + parseInt((i / 3).toString()))
              ?.value,
            2
          )
        );
      });
      const uniqueArr1 = exchangeInformations.filter(
        (item, index) =>
          exchangeInformations.findIndex(
            (i) =>
              i.fromPlatform === item.fromPlatform &&
              i.fromCurrency === item.fromCurrency &&
              i.toPlatform === item.toPlatform &&
              i.toCurrency === item.toCurrency
          ) === index
      );
      this.addData([], uniqueArr1);
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
  onSubmit() {
    if (this.type === 0 && this.zeroStatus === false) {
      if (this.validateForm.valid) {
        if (!this.checkFormValue(this.listOfControl.length, 2)) {
          return;
        }
        let exchangeInformations: any[] = [];
        let ss = Object.keys(this.validateForm.value);
        ss.forEach((item: any, i: number) => {
          exchangeInformations.push(
            this.initFormData(
              this.validateForm.get('currency' + parseInt((i / 3).toString()))
                ?.value,
              this.validateForm.get('tCrrency' + parseInt((i / 3).toString()))
                ?.value,
              2
            )
          );
        });
        const uniqueArr1 = exchangeInformations.filter(
          (item, index) =>
            exchangeInformations.findIndex(
              (i) =>
                i.fromPlatform === item.fromPlatform &&
                i.fromCurrency === item.fromCurrency &&
                i.toPlatform === item.toPlatform &&
                i.toCurrency === item.toCurrency
            ) === index
        );
        this.addData([], uniqueArr1);
      } else {
        Object.values(this.validateForm.controls).forEach((control) => {
          if (control.invalid) {
            control.markAsDirty();
            control.updateValueAndValidity({ onlySelf: true });
          }
        });
      }
      return;
    }
    if (this.type === 1 || (this.type === 0 && this.zeroStatus === true)) {
      this.submitEmitter.emit();
      if (this.validateForm.valid && this.formData.valid) {
        if (!this.checkFormValue(this.listOfControl.length, 2)) {
          return;
        }

        let exchangeInformations: any[] = [];
        let ss = Object.keys(this.validateForm.value);
        ss.forEach((item: any, i: number) => {
          exchangeInformations.push(
            this.initFormData(
              this.validateForm.get('currency' + parseInt((i / 3).toString()))
                ?.value,
              this.validateForm.get('tCrrency' + parseInt((i / 3).toString()))
                ?.value,
              2
            )
          );
        });
        const uniqueArr1 = exchangeInformations.filter(
          (item, index) =>
            exchangeInformations.findIndex(
              (i) =>
                i.fromPlatform === item.fromPlatform &&
                i.fromCurrency === item.fromCurrency &&
                i.toPlatform === item.toPlatform &&
                i.toCurrency === item.toCurrency
            ) === index
        );
        let settlementInformations: any[] = [];
        let ss1 = Object.keys(this.formData.value);
        ss1.forEach((item: any, i: number) => {
          if (
            this.formData.get(
              'capitalPoolAddress' + parseInt((i / 3).toString())
            )?.value !== ''
          ) {
            settlementInformations.push(
              this.initFormData(
                this.formData.get('currency' + parseInt((i / 3).toString()))
                  ?.value,
                this.formData.get(
                  'capitalPoolAddress' + parseInt((i / 3).toString())
                )?.value,
                1
              )
            );
          }
        });
        const uniqueArr = [
          ...new Map(
            settlementInformations.map((item) => [
              item.capitalPoolAddress,
              item
            ])
          ).values()
        ];
        this.addData(uniqueArr, uniqueArr1);
      } else {
        Object.values(this.validateForm.controls).forEach((control) => {
          if (control.invalid) {
            control.markAsDirty();
            control.updateValueAndValidity({ onlySelf: true });
          }
        });
      }
    }
    return;
  }
  private initFormData(
    currency: string,
    targetCurrency: string,
    type: number
  ): any {
    if (type === 1) {
      return {
        capitalPoolPlatform: currency.split('-')[1],
        capitalPoolCurrency: currency.split('-')[0],
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
        businessType: 0
      })
      .subscribe({
        next: (res) => {
          if (res.data) {
            this.message
              .success('The data has been submitted!')
              .onClose.subscribe((_) => {
                this.router.navigateByUrl(
                  '/poc/poc-profile/foreign-exchange-apply'
                );
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
