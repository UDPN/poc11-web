import {
  Component,
  TemplateRef,
  ViewChild,
  AfterViewInit,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '@app/core/services/http/login/login.service';
import { PocCapitalPoolService } from '@app/core/services/http/poc-capital-pool/poc-capital-pool.service';
import { CbdcTransactionService } from '@app/core/services/http/poc-wallet/cbdc-transaction/cbdc-transaction.service';
import { ThemeService } from '@app/core/services/store/common-store/theme.service';
import { SearchCommonVO } from '@app/core/services/types';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { finalize } from 'rxjs';

interface SearchParam {
  transactionNo: string;
  type: string;
  currency: string;
  createTime: any;
  status: string;
  to: string;
}

@Component({
  selector: 'app-cbdc-transaction',
  templateUrl: './cbdc-transaction.component.html',
  styleUrls: ['./cbdc-transaction.component.less']
})
export class CbdcTransactionComponent implements OnInit, AfterViewInit {
  @ViewChild('headerContent', { static: false })
  headerContent!: TemplateRef<NzSafeAny>;
  @ViewChild('headerExtra', { static: false })
  headerExtra!: TemplateRef<NzSafeAny>;
  @ViewChild('transactionNoTpl', { static: true })
  transactionNoTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('walletAddressTpl', { static: true })
  walletAddressTpl!: TemplateRef<NzSafeAny>;
  // @ViewChild('toTpl', { static: true })
  // toTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('transactionHashTpl', { static: true })
  transactionHashTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('operationTpl', { static: true })
  operationTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('statusTpl', { static: true })
  statusTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('amountTpl', { static: true })
  amountTpl!: TemplateRef<NzSafeAny>;
  searchParam: Partial<SearchParam> = {
    createTime: [],
    status: '',
    type: '',
    to: ''
  };
  tableQueryParams: NzTableQueryParams = {
    pageIndex: 1,
    pageSize: 10,
    sort: [],
    filter: []
  };
  isVisible: boolean = false;
  isLoading: boolean = false;
  tableConfig!: AntTableConfig;
  dataList: NzSafeAny[] = [];
  typeList: any[] = [];
  currencyList: any[] = [];
  statusList: any[] = [];
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumb: [],
    extra: '',
    desc: '',
    footer: ''
  };
  constructor(
    private cbdcTransactionService: CbdcTransactionService,
    private themesService: ThemeService,
    private dataService: LoginService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private router: Router,
    public routeInfo: ActivatedRoute
  ) {}
  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: ``,
      breadcrumb: ['Wallet Management', 'Mint & Melt Transactions'],
      extra: this.headerExtra,
      desc: this.headerContent,
      footer: ''
    };
  }

  ngOnInit() {
    this.routeInfo.queryParams.subscribe((params) => {
      if (JSON.stringify(params) !== '{}') {
        // this.searchParam.transactionNo = params['txType'];
      }
    });
    this.initTable();
    if (this.router.url.indexOf('?') !== -1) {
      history.replaceState(
        this.router.url,
        '',
        this.router.url.substring(0, this.router.url.indexOf('?'))
      );
    }
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
    this.searchParam.createTime = [];
    this.searchParam.status = '';
    this.searchParam.type = '';
    this.getDataList(this.tableQueryParams);
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
    this.cbdcTransactionService
      .getList(params.pageNum, params.pageSize, params.filters)
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
          title: 'Transaction No.',
          tdTemplate: this.transactionNoTpl,
          notNeedEllipsis: true,
          width: 150
        },
        {
          title: 'Master Wallet Address',
          tdTemplate: this.walletAddressTpl,
          notNeedEllipsis: true,
          width: 150
        },
        {
          title: 'Type',
          field: 'type',
          pipe: 'walletTransactionsType',
          notNeedEllipsis: true,
          width: 100
        },
        {
          title: 'Currency',
          field: 'currency',
          notNeedEllipsis: true,
          width: 80
        },
        {
          title: 'Amount',
          tdTemplate: this.amountTpl,
          notNeedEllipsis: true,
          width: 120
        },
        {
          title: 'Created on',
          field: 'creationTime',
          pipe: 'timeStamp',
          notNeedEllipsis: true,
          width: 150
        },
        {
          title: 'Status',
          tdTemplate: this.statusTpl,
          notNeedEllipsis: true,
          width: 120
        },
        {
          title: 'Actions',
          tdTemplate: this.operationTpl,
          fixed: true,
          fixedDir: 'right',
          showAction: false,
          width: 100
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
