import {
  Component,
  TemplateRef,
  ViewChild,
  AfterViewInit,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';
import { CommonService } from '@app/core/services/http/common/common.service';
import { PocCapitalPoolService } from '@app/core/services/http/poc-capital-pool/poc-capital-pool.service';
import { SearchCommonVO } from '@app/core/services/types';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { finalize } from 'rxjs';

interface SearchParam {
  businessApplicationStatus: string;
  businessApplicationCode: string;
  applicationDate: any;
  approvalDate: any;
  applicationType: string;
}

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.less']
})
export class ApplicationComponent implements OnInit {
  @ViewChild('headerContent', { static: false })
  headerContent!: TemplateRef<NzSafeAny>;
  @ViewChild('headerExtra', { static: false })
  headerExtra!: TemplateRef<NzSafeAny>;
  @ViewChild('operationTpl', { static: true })
  operationTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('currencyTpl', { static: true })
  currencyTpl!: TemplateRef<NzSafeAny>;
  searchParam: Partial<SearchParam> = {
    businessApplicationStatus: '',
    applicationType: '',
    applicationDate: [],
    approvalDate: []
  };
  statusList: any = [];
  businessTypeList: any = [];
  tableConfig!: AntTableConfig;
  dataList: NzSafeAny[] = [];
  tableQueryParams: NzTableQueryParams = {
    pageIndex: 1,
    pageSize: 10,
    sort: [],
    filter: []
  };
  constructor(
    private pocCapitalPoolService: PocCapitalPoolService,
    private cdr: ChangeDetectorRef,
    public _commonService: CommonService
  ) { }
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
    this.searchParam.businessApplicationStatus = '';
    this.searchParam.applicationType = '';
    this.searchParam.applicationDate = [];
    this.searchParam.approvalDate = [];
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
    this.pocCapitalPoolService
      .getApplicationList(params.pageNum, params.pageSize, params.filters)
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
          width: 320
        },
        {
          title: 'Currency',
          tdTemplate: this.currencyTpl,
          width: 160
        },
        {
          title: 'Currency Business Type',
          field: 'applicationType',
          pipe: 'exchangeBusinessType',
          width: 180
        },
        {
          title: 'Created on',
          field: 'applicationTime',
          pipe: 'timeStamp',
          notNeedEllipsis: true,
          width: 180
        },
        {
          title: 'Onboarded on',
          field: 'approvalTime',
          pipe: 'timeStamp',
          notNeedEllipsis: true,
          width: 180
        },
        {
          title: 'Status',
          field: 'status',
          pipe: 'foreignStatus',
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
