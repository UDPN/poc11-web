/*
 * @Author: chenyuting
 * @Date: 2024-12-09 15:40:52
 * @LastEditors: chenyuting
 * @LastEditTime: 2025-03-03 10:26:40
 * @Description:
 */
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
import { TransactionRecordService } from '@app/core/services/http/poc-remittance/transaction/transaction.service';
import { TransferService } from '@app/core/services/http/poc-remittance/transfer/transfer.service';
import { ThemeService } from '@app/core/services/store/common-store/theme.service';
import { SearchCommonVO } from '@app/core/services/types';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { finalize } from 'rxjs';

interface SearchParam {
  centralBankId: any;
  fromAccountAddress: string;
  serialNumber: string;
  creationTime: any;
  state: string;
  toAccountAddress: string;
  type: string;
}

@Component({
  selector: 'app-transaction-record',
  templateUrl: './transaction-record.component.html',
  styleUrls: ['./transaction-record.component.less']
})
export class TransactionRecordComponent implements OnInit, AfterViewInit {
  @ViewChild('headerContent', { static: false })
  headerContent!: TemplateRef<NzSafeAny>;
  @ViewChild('headerExtra', { static: false })
  headerExtra!: TemplateRef<NzSafeAny>;
  @ViewChild('transactionNoTpl', { static: true })
  transactionNoTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('fromTpl', { static: true })
  fromTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('toTpl', { static: true })
  toTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('transactionHashTpl', { static: true })
  transactionHashTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('operationTpl', { static: true })
  operationTpl!: TemplateRef<NzSafeAny>;
  centralBankTpl!: TemplateRef<NzSafeAny>;
  isVisibleTopUp: boolean = false;
  isVisibleWithdraw: boolean = false;
  isLoading: boolean = false;
  topUpForm!: FormGroup;
  withdrawForm!: FormGroup;
  @ViewChild('statusTpl', { static: true })
  statusTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('amountTpl', { static: true })
  amountTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('fxRateTpl', { static: true })
  fxRateTpl!: TemplateRef<NzSafeAny>;
  searchParam: Partial<SearchParam> = {
    creationTime: [],
    state: '',
    type: '',
    centralBankId: ''
  };
  tableQueryParams: NzTableQueryParams = {
    pageIndex: 1,
    pageSize: 10,
    sort: [],
    filter: []
  };
  tableConfig!: AntTableConfig;
  dataList: NzSafeAny[] = [
    {
      transactionNo: 'F9160189-E5F9160189',
      from: '0x000000000000',
      to: '0x000000000000',
      type: 'Top-up',
      amount: '10000000',
      currency: 'w-CNY',
      creationTime: 1654231412,
      status: 'Pending Approval'
    }
  ];
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
    private themesService: ThemeService,
    private dataService: LoginService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private transactionRecordService: TransactionRecordService,
    private transferService: TransferService,
    private router: Router,
    public routeInfo: ActivatedRoute
  ) {}
  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: ``,
      breadcrumb: ['Remittance Management', 'Transaction Records'],
      extra: this.headerExtra,
      desc: this.headerContent,
      footer: ''
    };
  }

  ngOnInit() {
    this.routeInfo.queryParams.subscribe((params) => {
      if (JSON.stringify(params) !== '{}') {
        this.searchParam.serialNumber = params['traceId'];
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
    this.transferService.fetchBankList().subscribe((res: any) => {
      this.currencyList = res;
    });
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
    this.searchParam.creationTime = [];
    this.searchParam.state = '';
    this.searchParam.type = '';
    this.searchParam.centralBankId = '';
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
    this.transactionRecordService
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
          width: 120
        },
        {
          title: 'From',
          tdTemplate: this.fromTpl,
          notNeedEllipsis: true,
          width: 120
        },
        {
          title: 'To',
          tdTemplate: this.toTpl,
          notNeedEllipsis: true,
          width: 120
        },
        {
          title: 'Type',
          field: 'type',
          pipe: 'transactionsRecordType',
          notNeedEllipsis: true,
          width: 130
        },
        {
          title: 'Amount',
          tdTemplate: this.amountTpl,
          notNeedEllipsis: true,
          width: 150
        },
        {
          title: 'FX Rate',
          tdTemplate: this.fxRateTpl,
          notNeedEllipsis: true,
          width: 140
        },
        {
          title: 'Created on',
          field: 'createTime',
          pipe: 'timeStamp',
          notNeedEllipsis: true,
          width: 180
        },
        {
          title: 'Status',
          tdTemplate: this.statusTpl,
          notNeedEllipsis: true,
          width: 100
        },
        {
          title: 'Actions',
          tdTemplate: this.operationTpl,
          notNeedEllipsis: true,
          fixed: true,
          fixedDir: 'right',
          showAction: false,
          width: 60
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
