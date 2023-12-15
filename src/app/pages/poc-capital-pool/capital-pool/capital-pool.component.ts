import {
  Component,
  TemplateRef,
  ViewChild,
  AfterViewInit,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '@app/core/services/http/login/login.service';
import { PocCapitalPoolService } from '@app/core/services/http/poc-capital-pool/poc-capital-pool.service';
import { ThemeService } from '@app/core/services/store/common-store/theme.service';
import { SearchCommonVO } from '@app/core/services/types';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { finalize } from 'rxjs';

interface SearchParam {
  nodeName: string;
  nodeCode: string;
  status: string;
  key: string;
  bizSN: string;
  nodeType: string;
  nodeTitle: string;
  remark: string;
  creation: any;
  fromVn: string;
}

@Component({
  selector: 'app-capital-pool',
  templateUrl: './capital-pool.component.html',
  styleUrls: ['./capital-pool.component.less']
})
export class CapitalPoolComponent implements OnInit, AfterViewInit {
  @ViewChild('headerContent', { static: false })
  headerContent!: TemplateRef<NzSafeAny>;
  @ViewChild('headerExtra', { static: false })
  headerExtra!: TemplateRef<NzSafeAny>;
  @ViewChild('operationTpl', { static: true })
  operationTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('capitalTpl', { static: true })
  capitalTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('balanceTpl', { static: true })
  balanceTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('authorizedTpl', { static: true })
  authorizedTpl!: TemplateRef<NzSafeAny>;

  searchParam: Partial<SearchParam> = {
    creation: [],
    status: ''
  };
  tableQueryParams: NzTableQueryParams = {
    pageIndex: 1,
    pageSize: 10,
    sort: [],
    filter: []
  };
  tabIndex: number = 0;
  capitalPoolTabs = ['Capital Pool Information', 'Application Information'];
  isVisible: boolean = false;
  isLoading: boolean = false;
  editValidateForm!: FormGroup;
  editInfo: any = {};
  constructor(
    private pocCapitalPoolService: PocCapitalPoolService,
    private themesService: ThemeService,
    private dataService: LoginService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
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
    (this.searchParam.creation = ''), (this.searchParam.status = '');
    this.getDataList(this.tableQueryParams);
  }

  ngOnInit() {
    this.initTable();
    if (sessionStorage.getItem('tabNumber') === '1') {
      this.tabIndex = 1;
      sessionStorage.removeItem('tabNumber');
    } else {
      this.tabIndex = 0;
    }
    this.editValidateForm = this.fb.group({
      status: [true, [Validators.required]],
      amount: ['', [Validators.required]],
    });
  }

  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: ``,
      breadcrumb: ['Capital Pool Management'],
      extra: this.headerExtra,
      desc: this.headerContent,
      footer: ''
    };
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
      .fetchList()
      .pipe(
        finalize(() => {
          this.tableLoading(false);
        })
      )
      .subscribe((_: any) => {
        this.dataList = _.data;
        this.dataList.forEach((item: any, i: any) => {
          Object.assign(item, { key: (params.pageNum - 1) * 10 + i + 1 });
        });
        this.tableConfig.total = _?.resultPageInfo?.total;
        this.tableConfig.pageIndex = params.pageNum;
        this.tableLoading(false);
        this.cdr.markForCheck();
      });
  }

  onChangeTab(event: any) {
    if (event === 1) {
      sessionStorage.setItem('tabNumber', '1');
    } else {
      sessionStorage.removeItem('tabNumber');
    }
  }

  getEdit(capitalPoolCurrency: string, capitalPoolPlatform: string, capitalPoolAddress: string) {
    this.isVisible = true;
    this.editInfo = {
      capitalPool: capitalPoolCurrency + '-' + capitalPoolPlatform,
      capitalPoolAddress
    }
  }

  cancelEdit() {
    this.isVisible = false;
  }

  edit() {}

  private initTable(): void {
    this.tableConfig = {
      headers: [
        // {
        //   title: 'Application No.',
        //   field: '',
        //   width: 200
        // },
        {
          title: 'Capital Pool',
          tdTemplate: this.capitalTpl,
          width: 200
        },
        {
          title: 'Account/Wallet',
          field: 'capitalPoolAddress',
          width: 300
        },
        {
          title: 'Balance',
          tdTemplate: this.balanceTpl,
          width: 200
        },
        {
          title: 'Date',
          field: 'createDate',
          pipe: 'timeStamp',
          width: 180
        },
        {
          title: 'Pre-authorized Debit',
          tdTemplate: this.authorizedTpl,
          width: 180
        },
        {
          title: 'Action',
          tdTemplate: this.operationTpl,
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
