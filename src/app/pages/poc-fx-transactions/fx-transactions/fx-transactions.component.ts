import {
  Component,
  TemplateRef,
  ViewChild,
  AfterViewInit,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';
import { CommonService } from '@app/core/services/http/common/common.service';
import { PocFxTransactionsService } from '@app/core/services/http/poc-fx-transactions/poc-fx-transactions.service';
import { SearchCommonVO } from '@app/core/services/types';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { finalize } from 'rxjs';

interface SearchParam {
  currency: string;
  transactionNo: string;
  creation: any;
  transactionHash: any;
  commercialBankId: string;
  commercialBankName: string;
  receivingBankName: string;
}

interface ListParam {
  formRatePlatform: string;
  formRateCurrency: string;
  toRatePlatform: string;
  toRateCurrency: string;
}

@Component({
  selector: 'app-fx-transactions',
  templateUrl: './fx-transactions.component.html',
  styleUrls: ['./fx-transactions.component.less']
})
export class FxTransactionsComponent implements OnInit, AfterViewInit {
  @ViewChild('headerContent', { static: false })
  headerContent!: TemplateRef<NzSafeAny>;
  @ViewChild('headerExtra', { static: false })
  headerExtra!: TemplateRef<NzSafeAny>;
  @ViewChild('operationTpl', { static: true })
  operationTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('amountTpl', { static: true }) amountTpl!: TemplateRef<NzSafeAny>;

  searchParam: Partial<SearchParam> = {
    creation: [],
    currency: '',
    transactionNo: '',
    transactionHash: '',
    commercialBankId: '',
    commercialBankName: '',
    receivingBankName: ''
  };
  listParam: Partial<ListParam> = {
    formRatePlatform: '',
    formRateCurrency: '',
    toRatePlatform: '',
    toRateCurrency: ''
  };
  currencyList: any = [];
  tableQueryParams: NzTableQueryParams = {
    pageIndex: 1,
    pageSize: 10,
    sort: [],
    filter: []
  };
  constructor(
    private pocFxTransactionsService: PocFxTransactionsService,
    private cdr: ChangeDetectorRef,
    private _commonService: CommonService
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
    (this.searchParam.creation = []), (this.searchParam.currency = '');
    this.getDataList(this.tableQueryParams);
  }

  ngOnInit() {
    this.initTable();
    this.initSelect();
  }

  initSelect() {
    this._commonService
      .commonApi({ dropDownTypeCode: 'drop_down_exchange_rate_info' })
      .subscribe((res) => {
        this.currencyList = res.dataInfo;
        this.currencyList.map((item: any, i: any) => {
          Object.assign(item, { key: i + 1 });
        });
        this.cdr.markForCheck();
      });
  }

  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: ``,
      breadcrumb: ['FX Transactions'],
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
        (this.listParam.formRatePlatform = item.sourcePlatform),
          (this.listParam.formRateCurrency = item.sourceCurrency),
          (this.listParam.toRatePlatform = item.targetPlatform),
          (this.listParam.toRateCurrency = item.targetCurrency);
      } else if (this.searchParam.currency === '') {
        (this.listParam.formRatePlatform = ''),
          (this.listParam.formRateCurrency = ''),
          (this.listParam.toRatePlatform = ''),
          (this.listParam.toRateCurrency = '');
      }
    });
    this.tableConfig.loading = true;
    const params: SearchCommonVO<any> = {
      pageSize: this.tableConfig.pageSize!,
      pageNum: e?.pageIndex || this.tableConfig.pageIndex!,
      filters: {
        transactionNo: this.searchParam.transactionNo,
        transactionHash: this.searchParam.transactionHash,
        formPlatform: this.listParam.formRatePlatform,
        formCurrency: this.listParam.formRateCurrency,
        toPlatform: this.listParam.toRatePlatform,
        toCurrency: this.listParam.toRateCurrency,
        creation: this.searchParam.creation,
        commercialBankId: this.searchParam.commercialBankId,
        commercialBankName: this.searchParam.commercialBankName,
        receivingBankName: this.searchParam.receivingBankName
      },
    };
    this.pocFxTransactionsService
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
          title: 'Transaction No.',
          field: 'transactionNo',
          width: 350
        },
        {
          title: 'Commercial Bank Name',
          field: 'commercialBankName',
          width: 200
        },
        {
          title: 'Receiving Bank Name',
          field: 'receivingBankName',
          width: 200
        },
        {
          title: 'Amount',
          tdTemplate: this.amountTpl,
          width: 180
        },
        {
          title: 'Date',
          field: 'transactionDate',
          pipe: 'timeStamp',
          notNeedEllipsis: true,
          width: 220
        },
        {
          title: 'Status',
          field: 'status',
          pipe: 'transactionsStatus',
          width: 120
        },
        {
          title: 'Action',
          tdTemplate: this.operationTpl,
          fixed: true,
          fixedDir: 'right',
          showAction: false,
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
}
