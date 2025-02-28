import {
  Component,
  TemplateRef,
  ViewChild,
  AfterViewInit,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';
import { CommonService } from '@app/core/services/http/common/common.service';
import { LoginService } from '@app/core/services/http/login/login.service';
import { PocHomeService } from '@app/core/services/http/poc-home/poc-home.service';
import { SettlementService } from '@app/core/services/http/poc-settlement/settlement/settlement.service';
import { ThemeService } from '@app/core/services/store/common-store/theme.service';
import { SearchCommonVO } from '@app/core/services/types';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { finalize } from 'rxjs';

interface SearchParam {
  settlementModelCode: string;
  settlementModelName: string;
  pairedExchangeRate: any;
  chargingModel: string;
}

interface ListParam {
  sourceCurrency: string;
  sourcePlatform: string;
  targetCurrency: string;
  targetPlatform: string;
}

@Component({
  selector: 'app-settlement',
  templateUrl: './settlement.component.html',
  styleUrls: ['./settlement.component.less']
})
export class SettlementComponent implements OnInit, AfterViewInit {
  @ViewChild('headerContent', { static: false })
  headerContent!: TemplateRef<NzSafeAny>;
  @ViewChild('headerExtra', { static: false })
  headerExtra!: TemplateRef<NzSafeAny>;
  @ViewChild('operationTpl', { static: true })
  operationTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('exchangeRateTpl', { static: true })
  exchangeRateTpl!: TemplateRef<NzSafeAny>;
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumb: [],
    extra: '',
    desc: '',
    footer: ''
  };
  searchParam: Partial<SearchParam> = {
    pairedExchangeRate: '',
    chargingModel: ''
  };
  listParam: Partial<ListParam> = {
    sourceCurrency: '',
    sourcePlatform: '',
    targetCurrency: '',
    targetPlatform: ''
  };
  pairedList: any = [];
  chargingModelList: any = [];
  tableConfig!: AntTableConfig;
  dataList: NzSafeAny[] = [];
  tableQueryParams: NzTableQueryParams = {
    pageIndex: 1,
    pageSize: 10,
    sort: [],
    filter: []
  };
  constructor(
    private settlementService: SettlementService,
    private cdr: ChangeDetectorRef,
    public _commonService: CommonService
  ) {}
  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: ``,
      breadcrumb: ['Settlement Management', 'Settlement Model Management'],
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
    (this.searchParam.pairedExchangeRate = ''),
      (this.searchParam.chargingModel = '');
    this.getDataList(this.tableQueryParams);
  }

  initSelect() {
    this._commonService
      .commonApi({ dropDownTypeCode: 'drop_down_exchange_rate_info' })
      .subscribe((res) => {
        this.pairedList = res.dataInfo;
        this.pairedList.map((item: any, i: any) => {
          Object.assign(item, { key: i + 1 });
        });
      });
    this._commonService
      .commonApi({
        dropDownTypeCode: 'drop_down_business_status_info',
        csePCode: 'FXSP_CHARGING_MODEL'
      })
      .subscribe((res) => {
        this.chargingModelList = res.dataInfo;
      });
  }

  changePageSize(e: number): void {
    this.tableConfig.pageSize = e;
  }

  getDataList(e?: NzTableQueryParams): void {
    this.pairedList.map((item: any) => {
      if (this.searchParam.pairedExchangeRate === item.key) {
        (this.listParam.sourceCurrency = item.sourceCurrency),
          (this.listParam.sourcePlatform = item.sourcePlatform),
          (this.listParam.targetCurrency = item.targetCurrency),
          (this.listParam.targetPlatform = item.targetPlatform);
      } else if (this.searchParam.pairedExchangeRate === '') {
        (this.listParam.sourceCurrency = ''),
          (this.listParam.sourcePlatform = ''),
          (this.listParam.targetCurrency = ''),
          (this.listParam.targetPlatform = '');
      }
    });
    this.tableConfig.loading = true;
    const params: SearchCommonVO<any> = {
      pageSize: this.tableConfig.pageSize!,
      pageNum: e?.pageIndex || this.tableConfig.pageIndex!,
      filters: {
        settlementModelCode: this.searchParam.settlementModelCode,
        settlementModelName: this.searchParam.settlementModelName,
        formRatePlatform: this.listParam.sourcePlatform,
        formRateCurrency: this.listParam.sourceCurrency,
        toRatePlatform: this.listParam.targetPlatform,
        toRateCurrency: this.listParam.targetCurrency,
        chargingModel: this.searchParam.chargingModel
      }
    };
    this.settlementService
      .getList(params.pageNum, params.pageSize, params.filters)
      .pipe(
        finalize(() => {
          this.tableLoading(false);
        })
      )
      .subscribe((_: any) => {
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
          title: 'Model Code',
          field: 'settlementModelCode',
          notNeedEllipsis: true,
          width: 300
        },
        {
          title: 'Model Name',
          field: 'settlementModelName',
          notNeedEllipsis: true,
          width: 220
        },
        {
          title: 'Currency Pair',
          tdTemplate: this.exchangeRateTpl,
          notNeedEllipsis: true,
          width: 300
        },
        {
          title: 'Charging Model',
          field: 'chargingModel',
          pipe: 'chargingModel',
          notNeedEllipsis: true,
          width: 220
        },
        {
          title: 'Actions',
          tdTemplate: this.operationTpl,
          notNeedEllipsis: true,
          fixed: true,
          fixedDir: 'right',
          showAction: false,
          width: 180
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
