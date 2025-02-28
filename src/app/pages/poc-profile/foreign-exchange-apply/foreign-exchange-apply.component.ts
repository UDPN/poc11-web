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
import { ForeignExchangeApplyService } from '@app/core/services/http/poc-profile/foreign-exchange-apply/foreign-exchange-apply.service';
import { ThemeService } from '@app/core/services/store/common-store/theme.service';
import { SearchCommonVO } from '@app/core/services/types';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { finalize } from 'rxjs';

interface SearchParam {
  applicationTime: any;
  approvalTime: any;
  businessApplicationStatus: string;
  businessApplicationCode: string;
  applicationType: string;
}

@Component({
  selector: 'app-foreign-exchange-apply',
  templateUrl: './foreign-exchange-apply.component.html',
  styleUrls: ['./foreign-exchange-apply.component.less']
})
export class ForeignExchangeApplyComponent implements OnInit, AfterViewInit {
  @ViewChild('headerContent', { static: false })
  headerContent!: TemplateRef<NzSafeAny>;
  @ViewChild('headerExtra', { static: false })
  headerExtra!: TemplateRef<NzSafeAny>;
  @ViewChild('operationTpl', { static: true })
  operationTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('currencyTpl', { static: true })
  currencyTpl!: TemplateRef<NzSafeAny>;
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumb: [],
    extra: '',
    desc: '',
    footer: ''
  };
  searchParam: Partial<SearchParam> = {
    businessApplicationStatus: '',
    applicationTime: [],
    approvalTime: []
  };
  tableConfig!: AntTableConfig;
  dataList: NzSafeAny[] = [];
  statusList: any = [];
  businessTypeList: any = [];
  tableQueryParams: NzTableQueryParams = {
    pageIndex: 1,
    pageSize: 10,
    sort: [],
    filter: []
  };
  constructor(
    private foreignExchangeApplyService: ForeignExchangeApplyService,
    private cdr: ChangeDetectorRef,
    public _commonService: CommonService
  ) {}
  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: ``,
      breadcrumb: ['FX Pair Management'],
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
    this.searchParam.applicationTime = [];
    this.searchParam.approvalTime = [];
    this.searchParam.businessApplicationStatus = '';
    this.searchParam.applicationType = '';
    this.getDataList(this.tableQueryParams);
  }

  initSelect() {
    this._commonService
      .commonApi({
        dropDownTypeCode: 'drop_down_business_status_info',
        csePCode: 'FXSP_FOREIGN_EXCHANGE_APPLICATION'
      })
      .subscribe((res) => {
        this.statusList = res.dataInfo;
      });

    this._commonService
      .commonApi({
        dropDownTypeCode: 'drop_down_business_status_info',
        csePCode: 'FXSP_EXCHANGE_BUSINESS_TYPE'
      })
      .subscribe((res) => {
        this.businessTypeList = res.dataInfo;
      });
  }

  changePageSize(e: number): void {
    this.tableConfig.pageSize = e;
  }

  getDataList(e?: NzTableQueryParams): void {
    this.tableConfig.loading = true;
    const params: SearchCommonVO<any> = {
      pageSize: this.tableConfig.pageSize!,
      pageNum: e?.pageIndex || this.tableConfig.pageIndex!,
      filters: this.searchParam
    };
    this.foreignExchangeApplyService
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
          title: 'Application No.',
          field: 'applicationNo',
          notNeedEllipsis: true,
          width: 350
        },
        {
          title: 'FX Pair',
          tdTemplate: this.currencyTpl,
          notNeedEllipsis: true,
          width: 220
        },
        {
          title: 'Application Type',
          field: 'applicationType',
          pipe: 'exchangeBusinessType',
          notNeedEllipsis: true,
          width: 220
        },
        {
          title: 'Created on',
          field: 'applicationTime',
          pipe: 'timeStamp',
          notNeedEllipsis: true,
          width: 200
        },
        {
          title: 'Onboarded On',
          field: 'approvalTime',
          pipe: 'timeStamp',
          notNeedEllipsis: true,
          width: 200
        },
        {
          title: 'Status',
          field: 'status',
          pipe: 'foreignStatus',
          notNeedEllipsis: true,
          width: 160
        },
        {
          title: 'Actions',
          tdTemplate: this.operationTpl,
          fixed: true,
          fixedDir: 'right',
          showAction: false,
          width: 160
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
