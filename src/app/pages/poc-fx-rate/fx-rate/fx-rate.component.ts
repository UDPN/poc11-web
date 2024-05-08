import {
  Component,
  TemplateRef,
  ViewChild,
  AfterViewInit,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PocFxRateService } from '@app/core/services/http/poc-fx-rate/poc-fx-rate.service';
import { SearchCommonVO } from '@app/core/services/types';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { finalize } from 'rxjs';

interface SearchParam {
  currency: any;
  updateTime: any;
}
interface ListParam {
  fromPlatform: string;
  fromCurrency: string;
  toPlatform: string;
  toCurrency: string;
}

@Component({
  selector: 'app-fx-rate',
  templateUrl: './fx-rate.component.html',
  styleUrls: ['./fx-rate.component.less']
})
export class FxRateComponent implements OnInit, AfterViewInit {
  @ViewChild('headerContent', { static: false })
  headerContent!: TemplateRef<NzSafeAny>;
  @ViewChild('headerExtra', { static: false })
  headerExtra!: TemplateRef<NzSafeAny>;
  @ViewChild('currencyTpl', { static: true })
  currencyTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('commissionTpl', { static: true })
  commissionTpl!: TemplateRef<NzSafeAny>;
  searchParam: Partial<SearchParam> = {
    updateTime: [],
    currency: ''
  };
  listParam: Partial<ListParam> = {
    fromPlatform: '',
    fromCurrency: '',
    toPlatform: '',
    toCurrency: ''
  };
  currencyList: any = [];

  tableQueryParams: NzTableQueryParams = {
    pageIndex: 1,
    pageSize: 10,
    sort: [],
    filter: []
  };
  compareList: any = [];
  constructor(
    private pocFxRateService: PocFxRateService,
    private cdr: ChangeDetectorRef,
    public routeInfo: ActivatedRoute
  ) {}
  tableConfig!: AntTableConfig;
  dataList: NzSafeAny[] = [];
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumb: [],
    extra: '',
    desc: '',
    footer: ''
  };
  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: ``,
      breadcrumb: ['FX Rate Query'],
      extra: this.headerExtra,
      desc: this.headerContent,
      footer: ''
    };
  }

  ngOnInit() {
    this.initTable();
    this.initSelect();
  }

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
    this.searchParam.updateTime = '';
    this.searchParam.currency = '';
    this.getDataList(this.tableQueryParams);
  }

  initSelect() {
    this.pocFxRateService.getCurrency().subscribe((res) => {
      this.currencyList = res;
      this.currencyList.map((item: any, i: any) => {
        Object.assign(item, { key: i + 1 });
      });
      if (this.currencyList) {
        this.routeInfo.queryParams.subscribe((params) => {
          if (JSON.stringify(params) !== '{}') {
            this.currencyList.map((item: any, index: number) => {
              const compareList = {
                fromCurrency: item.fromCurrency,
                fromPlatform: item.fromPlatform,
                toCurrency: item.toCurrency,
                toPlatform: item.toPlatform
              };
              if (JSON.stringify(params) === JSON.stringify(compareList)) {
                this.searchParam.currency = item.key;
                this.cdr.markForCheck();
                this.cdr.detectChanges();
              }
            });
          }
        });
      }
    });
  }

  changePageSize(e: number): void {
    this.tableConfig.pageSize = e;
  }

  getDataList(e?: NzTableQueryParams): void {
    this.currencyList.map((item: any) => {
      if (this.searchParam.currency === item.key) {
        this.listParam.fromPlatform = item.fromPlatform;
        this.listParam.fromCurrency = item.fromCurrency;
        this.listParam.toPlatform = item.toPlatform;
        this.listParam.toCurrency = item.toCurrency;
      } else if (this.searchParam.currency === '') {
        this.listParam.fromPlatform = '';
        this.listParam.fromCurrency = '';
        this.listParam.toPlatform = '';
        this.listParam.toCurrency = '';
      }
    });
    this.tableConfig.loading = true;
    const params: SearchCommonVO<any> = {
      pageSize: this.tableConfig.pageSize!,
      pageNum: e?.pageIndex || this.tableConfig.pageIndex!,
      filters: {
        fromCurrency: this.listParam.fromCurrency,
        toCurrency: this.listParam.toCurrency,
        updateTime: this.searchParam.updateTime
      }
    };
    this.pocFxRateService
      .fetchList(params.pageNum, params.pageSize, params.filters)
      .pipe(
        finalize(() => {
          this.tableLoading(false);
        })
      )
      .subscribe((_: any) => {
        this.dataList = _.data?.rows;
        this.tableConfig.total = _.data.page.total;
        this.tableConfig.pageIndex = params.pageNum;
        this.tableLoading(false);
        this.cdr.markForCheck();
      });
  }

  private initTable(): void {
    this.tableConfig = {
      headers: [
        {
          title: 'Currency Pair',
          tdTemplate: this.currencyTpl
        },
        {
          title: 'Exchange Rate',
          field: 'rate',
          pipe: 'toThousandRate'
        },
        {
          title: 'FX Service Provider',
          field: 'provider'
        },
        {
          title: 'Charging Model',
          field: 'chargingModel',
          pipe: 'chargingModel'
        },
        {
          title: 'Commission',
          tdTemplate: this.commissionTpl,
          notNeedEllipsis: true
        },
        {
          title: 'Updated Date',
          field: 'updateDate',
          pipe: 'timeStamp',
          notNeedEllipsis: true
        }
      ],
      total: 0,
      showCheckbox: false,
      loading: false,
      pageSize: 10,
      pageIndex: 1
    };
  }
}
