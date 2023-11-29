import { Component, TemplateRef, ViewChild, AfterViewInit, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '@app/core/services/http/common/common.service';
import { LoginService } from '@app/core/services/http/login/login.service';
import { PocFxRateHistoryService } from '@app/core/services/http/poc-fx-rate-history/poc-fx-rate-history.service';
import { PocHomeService } from '@app/core/services/http/poc-home/poc-home.service';
import { ThemeService } from '@app/core/services/store/common-store/theme.service';
import { SearchCommonVO } from '@app/core/services/types';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { finalize } from 'rxjs';

interface SearchParam {
  currency:string;
  createTime:any
}
interface ListParam {

  formRatePlatform: string,
  formRateCurrency: string,
  toRatePlatform: string,
  toRateCurrency: string,
}

@Component({
  selector: 'app-fx-rate-history',
  templateUrl: './fx-rate-history.component.html',
  styleUrls: ['./fx-rate-history.component.less'],
})
export class FxRateHistoryComponent implements OnInit, AfterViewInit {
  @ViewChild('headerContent', { static: false }) headerContent!: TemplateRef<NzSafeAny>;
  @ViewChild('headerExtra', { static: false }) headerExtra!: TemplateRef<NzSafeAny>;
   @ViewChild('currencyTpl', { static: true })
  currencyTpl!: TemplateRef<NzSafeAny>;
  operationTpl!: TemplateRef<NzSafeAny>;
  searchParam: Partial<SearchParam> = {
    createTime: [],
    currency: ''
  };
   listParam: Partial<ListParam> = {
    formRatePlatform: '',
    formRateCurrency: '',
    toRatePlatform: '',
    toRateCurrency: ''
  };
  currencyList: any = [];

  tableQueryParams: NzTableQueryParams = { pageIndex: 1, pageSize: 10, sort: [], filter: [] };
  compareList: any = [];
  constructor(
    private pocFxRateHistoryService: PocFxRateHistoryService, 
    private router: Router, private cdr: ChangeDetectorRef, 
    public routeInfo: ActivatedRoute,
    public _commonService: CommonService,
    ) { }
  tableConfig!: AntTableConfig;
  dataList: NzSafeAny[] = [];
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumb: [],
    extra: '',
    desc: '',
    footer: ''
  };

  tableChangeDectction(): void {
    this.dataList = [...this.dataList];
    this.cdr.detectChanges();
  }

  tableLoading(isLoading: boolean): void {
    this.tableConfig.loading = isLoading;
    this.tableChangeDectction();
  }

  resetForm(): void {
    this.searchParam = {};
    this.listParam = {};
    this.searchParam.createTime = '',
    this.searchParam.currency = ''
    this.getDataList(this.tableQueryParams);
  }

  ngOnInit() {
    this.initTable();
    this.initSelect();
    this.routeInfo.queryParams.subscribe((params: any) => {
      if (JSON.stringify(params) !== '{}') {
        this.listParam.formRatePlatform = params['sourcePlatform'],
        this.listParam.formRateCurrency = params['sourceCurrency'],
        this.listParam.toRatePlatform = params['targetPlatform'],
        this.listParam.toRateCurrency = params['targetCurrency']
      } else {
        this.listParam.formRatePlatform = '',
        this.listParam.formRateCurrency = '',
        this.listParam.toRatePlatform = '',
        this.listParam.toRateCurrency = ''
      }
    })
    if (this.router.url.indexOf('?') !== -1) {
      history.replaceState(this.router.url, "", this.router.url.substring(0, this.router.url.indexOf('?')));
    }
  }

  initSelect() {
    this._commonService.commonApi({ dropDownTypeCode: 'drop_down_exchange_rate_info' }).subscribe((res) => {
      this.currencyList = res.dataInfo;
      this.currencyList.map((item: any, i: any) => {
        Object.assign(item, { key: i + 1 })
      })
      if (this.currencyList) {
        this.routeInfo.queryParams.subscribe(params => {
          if (JSON.stringify(params) !== '{}') {
            this.currencyList.map((item: any, index: number) => {
              const compareList = {
                sourceCurrency: item.sourceCurrency,
                sourcePlatform: item.sourcePlatform,
                targetCurrency: item.targetCurrency,
                targetPlatform: item.targetPlatform
              };
              if (JSON.stringify(params) === JSON.stringify(compareList)) {
                this.searchParam.currency = item.key;
                this.cdr.markForCheck();
                this.cdr.detectChanges();
              }
            })
          }
        })
      }
    })
  }

  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: ``,
      breadcrumb: ['FX Rate Management'],
      extra: this.headerExtra,
      desc: this.headerContent,
      footer: ''
    };
  }

  changePageSize(e: number): void {
    this.tableConfig.pageSize = e;
  }

  getDataList(e?: NzTableQueryParams): void {


    this.currencyList.map((item: any) => {
      if (this.searchParam.currency === item.key) {
        this.listParam.formRatePlatform = item.sourcePlatform,
        this.listParam.formRateCurrency = item.sourceCurrency,
        this.listParam.toRatePlatform = item.targetPlatform,
        this.listParam.toRateCurrency = item.targetCurrency
      } else if (this.searchParam.currency === '') {
        this.listParam.formRatePlatform = '',
        this.listParam.formRateCurrency = '',
        this.listParam.toRatePlatform = '',
        this.listParam.toRateCurrency = ''
      }
    })

    this.tableConfig.loading = true;
    const params: SearchCommonVO<any> = {
      pageSize: this.tableConfig.pageSize!,
      pageNum: e?.pageIndex || this.tableConfig.pageIndex!,
      filters: {
        formRatePlatform: this.listParam.formRatePlatform,
        formRateCurrency: this.listParam.formRateCurrency,
        toRatePlatform: this.listParam.toRatePlatform,
        toRateCurrency: this.listParam.toRateCurrency,
        createTime: this.searchParam.createTime
      }
    };
    this.pocFxRateHistoryService.fetchList(params.pageNum, params.pageSize, params.filters).pipe(finalize(() => {
      this.tableLoading(false);
    })).subscribe((_: any) => {
      this.dataList = _.data;

      this.tableConfig.total = _?.resultPageInfo?.total;
      this.tableConfig.pageIndex = params.pageNum;
      this.tableLoading(false);
      this.cdr.markForCheck();
    });
  }

  private initTable(): void {
    this.tableConfig = {
      headers: [
        {
          title: 'Transaction Currency',
          tdTemplate: this.currencyTpl,
          width: 200
        },
        {
          title: 'Exchange Rate',
          field: 'exchangeRate',
          width: 200
        },
        {
          title: 'Date',
          field: 'rateDate',
          pipe: 'timeStamp',
          width: 200
        },
      ],
      total: 0,
      showCheckbox: false,
      loading: false,
      pageSize: 10,
      pageIndex: 1,
    };
  }
}
