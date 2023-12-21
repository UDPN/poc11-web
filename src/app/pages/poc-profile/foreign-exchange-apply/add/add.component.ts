import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormRecord,
  NonNullableFormBuilder,
  UntypedFormControl,
  Validators
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { Location } from '@angular/common';
import { NzMessageService } from 'ng-zorro-antd/message';
import { fnCheckForm } from '@app/utils/tools';
import { ForeignExchangeApplyService } from '@app/core/services/http/poc-profile/foreign-exchange-apply/foreign-exchange-apply.service';
import { CommonService } from '@app/core/services/http/common/common.service';
import { CurrencyStoreService } from '../store/currency.service';

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
  validateForm: FormRecord<FormControl<string>> = this.fb.record({});
  info: any = {};
  settlementList: any = [];
  settlementListExchange: any = [];
  settlementListOld: any = [];
  exchangeOld: any = [];
  foreignList: any = [];
  isLoading: boolean = false;
  row: number = 0;
  listOfControl: Array<{ id: number; crrency: any; capitalPoolAddress: any }> =
    [];
  constructor(
    private fb: NonNullableFormBuilder,
    public routeInfo: ActivatedRoute,
    private message: NzMessageService,
    private foreignExchangeApplyService: ForeignExchangeApplyService,
    private cdr: ChangeDetectorRef,
    private location: Location,
    public _commonService: CommonService,
    private _currencyStoreService: CurrencyStoreService
  ) { }

  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: 'Activate Exchange Busines',
      breadcrumbs: [
        {
          name: 'Foreign Exchange Management',
          url: '/poc/poc-profile/foreign-exchange-apply'
        },
        { name: 'Activate Exchange Busines' }
      ],
      extra: '',
      desc: '',
      footer: ''
    };
  }
  ngOnInit() {
    this.foreignExchangeApplyService.getSpApproved().subscribe((res) => {
      this._currencyStoreService.setTystatusStore(res.examineStatus);
      this._currencyStoreService.setZeroShowStatusStore(
        res.examineStatus === 1 ? true : false
      );
      // this._currencyStoreService.setTystatusStore(0);
      // if (res.examineStatus === 0) {
      //   //edit
      //   this.foreignExchangeApplyService
      //     .getSpApprovedInfo()
      //     .subscribe((resz) => {
      //       this.info = resz
      //       this.initSelectFirter(resz);

      //     });
      // } else {
      //   this.initSelect();
      // }
      this.foreignExchangeApplyService
        .getSpApprovedInfo()
        .subscribe((resz) => {
          this.info = resz
          this.initSelectFirter(resz);

        });
    });
  }
  initSelectFirter(data: any) {
    let outCapitalPool: any[] =
      data.outCapitalPool === null ? [] : data.outCapitalPool;
    let outExchangeRate: any[] =
      data.outExchangeRate === null ? [] : data.outExchangeRate;
    let currencyArr: string[] = [];
    let currencyArrOld: object[] = [];
    let outExchangeRateOld: object[] = [];
    outCapitalPool.forEach((item, i) => {
      currencyArr.push(
        item.capitalPoolCurrency + '-' + item.capitalPoolPlatform
      );
      currencyArrOld.push({
        currency: item.capitalPoolCurrency + '-' + item.capitalPoolPlatform,
        capitalPoolAddress: item.capitalPoolAddress
      });
    });
    this._currencyStoreService.setCapitalDataOldStore(currencyArrOld);
    outExchangeRate.forEach((item, i) => {
      outExchangeRateOld.push({
        from: item.formCurrency + '-' + item.formPlatform,
        to: item.toCurrency + '-' + item.toPlatform
      });
    });
    this._currencyStoreService.setCapitalDataExchangeOldStore(
      outExchangeRateOld
    );
    this._commonService
      .commonApi({
        dropDownTypeCode: 'drop_down_platform_currency_info',
        csePCode: 'FXSP_PLATFORM_CURRENCY_VAILD'
      })
      .subscribe((res) => {
        this.settlementList = [];
        this.settlementListExchange = [];
        res.dataInfo.forEach((item: any, i: number) => {
          let crrencys = item.currency + '-' + item.platform;
          if (!currencyArr.includes(crrencys)) {
            this.settlementList.push({
              index: i,
              currency: crrencys,
              status: 0
            });
          }
          this.settlementListExchange.push({
            index: i,
            currency: crrencys,
            status: 0
          });
        });
        this._currencyStoreService.setSettlementListStore(
          this.settlementListExchange
        );
      });
  }
  initSelect() {
    this._commonService
      .commonApi({
        dropDownTypeCode: 'drop_down_platform_currency_info',
        csePCode: 'FXSP_PLATFORM_CURRENCY_VAILD'
      })
      .subscribe((res) => {
        this.settlementList = [];
        res.dataInfo.forEach((item: any, i: number) => {
          this.settlementList.push({
            index: i,
            currency: item.currency + '-' + item.platform,
            status: 0
          });
        });
      });
  }

  onSubmit() {
    if (!fnCheckForm(this.validateForm)) {
      return;
    }
    this.isLoading = true;
  }

  onBack() {
    this.location.back();
  }
}
