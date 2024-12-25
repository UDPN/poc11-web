/*
 * @Author: zhangxuefeng
 * @Date: 2023-10-27 14:54:28
 * @LastEditors: chenyuting
 * @LastEditTime: 2024-12-24 17:42:17
 * @Description:
 */
import {
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
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
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';

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
    currency: any;
    status: any;
    capitalPoolAddress: any;
  }> = [];
  fileForm: FormRecord<FormControl<string>> = this.fb.record({});
  fileListOfControl: Array<{
    id: number;
    status: any;
    fileCode: any;
    fileUrl: any;
  }> = [];
  listCheckArr: any[] = [];
  fileList: any;
  isUpload: boolean = false;
  editCapitalPoolList: any = [];
  isFirstEdit: boolean = true;
  editFileList: any = [];
  @ViewChild('authorizedTpl', { static: true })
  authorizedTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('currencyTpl', { static: true })
  currencyTpl!: TemplateRef<NzSafeAny>;
  tableConfig!: AntTableConfig;
  dataList: NzSafeAny[] = [];
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
  ) {}
  ngOnInit(): void {
    this.initSelectOptionEdit(0);
    this.edit();
    this.initTable();
  }

  edit() {
    this.pocActivateSettlementService.getInfo().subscribe((res: any) => {
      if (res.updateStatus === 0) {
        this.isFirstEdit = false;
      } else {
        this.isFirstEdit = true;
        this.dataList = res.capitalPoolList;
        this.editFileList = res.fileList;
        this.dataList.forEach((item: any, i: any) => {
          // item.capitalPoolCurrency =
          //   item.capitalPoolCurrency.split('-')[0] +
          //   '-' +
          //   item.capitalPoolPlatform;
            item.capitalPoolCurrency =
            item.capitalPoolCurrency.split('-')[0];
          Object.assign(item, { key: i });
        });
        if (res.fileList && res.fileList.length > 0) {
          this.editFileList.forEach((item: any, index: number) => {
            const control = {
              id: index,
              status: false,
              // fileCode: `file${index}`,
              fileCode: item.fileCode,
              fileUrl: `fileUrl${index}`
            };
            const indexs = this.fileListOfControl.push(control);
            this.fileForm.addControl(
              this.fileListOfControl[indexs - 1].fileCode,
              this.fb.control('', Validators.required)
            );
            this.fileListOfControl[indexs - 1].fileUrl = item.fileUrl;
            this.fileForm.get(`fileCode${index}`)?.setValue(item.fileCode);
          });
        }
        this.cdr.markForCheck();
      }
      this.addField();
    });
  }

  capitalPoolAddressValidator = (
    control: FormControl
  ): { [s: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (!/^[0][x][0-9a-fA-F]{40}$/.test(control.value)) {
      return { regular: true, error: true };
    }
    return {};
  };

  uploadFileImg($event?: any) {
    const id =
      this.fileListOfControl.length > 0
        ? this.fileListOfControl[this.fileListOfControl.length - 1].id + 1
        : 0;

    const control = {
      id,
      status: false,
      fileCode: `file${id}`,
      fileUrl: `fileUrl${id}`
    };
    const index = this.fileListOfControl.push(control);
    this.fileForm.addControl(
      this.fileListOfControl[index - 1].fileCode,
      this.fb.control('', Validators.required)
    );
    const isImgType =
      $event.target.files[0]?.type === 'image/jpeg' ||
      $event.target.files[0]?.type === 'image/png' ||
      $event.target.files[0]?.type === 'image/gif' ||
      $event.target.files[0]?.type === 'image/bmp' ||
      $event.target.files[0]?.type === 'application/pdf';
    const isImgSize = $event.target.files[0]?.size! / 1024 / 1024 < 5;
    if (!isImgType && $event.target.files[0] !== undefined) {
      this.message.error('You can only upload png/jpg/gif/bmp/jpeg/pdf file !');
      this.fileListOfControl.splice(index - 1, 1);
      return;
    }
    if (!isImgSize && $event.target.files[0] !== undefined) {
      this.message.error('Image must smaller than 5MB !');
      this.fileListOfControl.splice(index - 1, 1);
      return;
    }
    if ($event.target.files.length === 0) {
      this.fileListOfControl.splice(index - 1, 1);
      return;
    }

    this.fileListOfControl[index - 1].fileUrl = $event.target.files[0]?.name;
    this.fileListOfControl[index - 1].id = index - 1;
    this.cdr.markForCheck();
    this.fileListOfControl[index - 1].status = true;
    this.isUpload = true;
    this._commonService.uploadImg($event.target.files[0]).subscribe((res) => {
      this.isUpload = false;
      this.fileListOfControl[index - 1].fileCode = res;
      this.fileListOfControl[index - 1].status = false;
      this.cdr.markForCheck();
    });
    $event.target.value = '';
  }

  onDeleteFile(id: number): void {
    this.fileForm.removeControl(this.fileListOfControl[id].fileCode);
    this.fileListOfControl.splice(id, 1);
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
        currency: `currency${id}`,
        status: `status${id}`,
        capitalPoolAddress: `capitalPoolAddress${id}`
      };
      const index = this.listOfControl.push(control);
      this.validateForm.addControl(
        this.listOfControl[index - 1].currency,
        this.fb.control('', Validators.required)
      );
      this.validateForm.addControl(
        this.listOfControl[index - 1].status,
        this.fb.control('false', Validators.required)
      );

      this.validateForm.addControl(
        this.listOfControl[index - 1].capitalPoolAddress,
        this.fb.control('', [
          Validators.required,
          this.capitalPoolAddressValidator
        ])
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
          console.log(arr);
          this.selectOptionPacths$.next(arr);
          this.selectOptionPacthsLenght = arr.length;
        }
        if (type === 0) {
          console.log(arr);
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
              arr.push(item.capitalPoolCurrency);
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
        console.log(this.selectOptionPacths$, '22222');
        
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
          this.listCheckArr[index]?.map((item: string) => {
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
    i: { id: number; currency: any; status: any; capitalPoolAddress: any },
    e: MouseEvent
  ): void {
    e.preventDefault();
    // this.isFirstEdit = false;
    this.editCapitalPoolList = [];
    if (this.listOfControl.length > 1) {
      this.setSelectOptionPool(
        this.validateForm.get(`currency${i.id - 1}`)?.value
      );
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
      this.validateForm.removeControl(i.currency);
      this.validateForm.removeControl(i.status);
      this.validateForm.removeControl(i.capitalPoolAddress);
    }
  }
  onChange(
    i: { id: number; currency: any; status: any; capitalPoolAddress: any },
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
    if (this.isFirstEdit) {
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
      let arrs: any[] = [];
      if (uniqueArr.length > 0) {
        uniqueArr.forEach((item: any, index: number) => {
          arrs.push(item.capitalPoolCurrency);
        });
      }
      if (arrs.length > 0) {
        this.dataList.forEach((item: any, index: number) => {
          if (arrs.includes(item.capitalPoolCurrency)) {
            let indexs = uniqueArr.findIndex(
              (val) => val.capitalPoolCurrency == item.capitalPoolCurrency
            );
            item.capitalPoolAddress = uniqueArr[indexs].capitalPoolAddress;
          }
        });
      }

      for (const key in this.dataList) {
        delete this.dataList[key].key;
      }
      this.addData(
        this.dataList.length < uniqueArr.length ? uniqueArr : this.dataList,
        []
      );
    } else if (this.validateForm.valid) {
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
      let arrs: any[] = [];
      if (uniqueArr.length > 0) {
        uniqueArr.forEach((item: any, index: number) => {
          arrs.push(item.capitalPoolCurrency);
        });
      }
      if (arrs.length > 0) {
        this.dataList.forEach((item: any, index: number) => {
          if (arrs.includes(item.capitalPoolCurrency)) {
            let indexs = uniqueArr.findIndex(
              (val) => val.capitalPoolCurrency == item.capitalPoolCurrency
            );
            item.capitalPoolAddress = uniqueArr[indexs].capitalPoolAddress;
          }
        });
      }

      for (const key in this.dataList) {
        delete this.dataList[key].key;
      }
      this.addData(
        this.dataList.length < uniqueArr.length ? uniqueArr : this.dataList,
        []
      );
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
    currency: any,
    targetCurrency: string,
    type: number
  ): any {
    if (type === 1) {
      return {
        capitalPoolPlatform: 'UDPN',
        // capitalPoolCurrency: currency.split('-')[0] + '-' + 'UDPN',
        capitalPoolCurrency: currency.split('-')[0],
        capitalPoolAddress: targetCurrency
      };
    }
    return {
      fromPlatform: currency.split('-')[2],
      fromCurrency: currency.split('-')[0] + currency.split('-')[1],
      toPlatform: targetCurrency.split('-')[2],
      toCurrency:
        targetCurrency.split('-')[0] + '-' + targetCurrency.split('-')[1]
    };
  }
  private addData(arr: any[], arr1: any[]) {
    this.isLoading = true;
    const array: any = [];
    this.fileList = Object.assign([], this.fileListOfControl);
    this.fileList.forEach((item: any) => {
      array.push({ fileCode: item.fileCode, fileUrl: item.fileUrl });
    });
    this.fileList = array;
    console.log(arr);
    
    // return;
    this.pocActivateSettlementService
      .save({
        capitalPoolList: arr,
        fileList: this.fileList
      })
      .subscribe({
        next: (res) => {
          if (res) {
            this.message
              .success('The data has been submitted!')
              .onClose.subscribe((_) => {
                location.reload();
                // this.router.navigateByUrl(
                //   '/poc/poc-activate-settlement/activate-settlement'
                // );
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
  private initTable(): void {
    this.tableConfig = {
      headers: [
        {
          title: 'Currency',
          tdTemplate: this.currencyTpl,
          width: 180
        },
        {
          title: 'Account/Wallet (Capital Pool Address)',
          field: 'capitalPoolAddress',
          width: 300
        },
        {
          title: 'Actions',
          tdTemplate: this.authorizedTpl,
          width: 120
        }
      ],
      total: 0,
      showCheckbox: false,
      loading: false,
      pageSize: 10,
      pageIndex: 1
    };
  }
  onDel(index: number) {
    this.dataList.splice(index, 1);
  }
}
