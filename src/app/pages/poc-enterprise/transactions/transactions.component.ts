/*
 * @Author: chenyuting
 * @Date: 2025-01-15 14:14:24
 * @LastEditors: chenyuting
 * @LastEditTime: 2025-02-19 16:42:33
 * @Description:
 */
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { CommonService } from '@app/core/services/http/common/common.service';
import { TransactionsService } from '@app/core/services/http/poc-enterprise/transactions/transactions.service';
import { SearchCommonVO } from '@app/core/services/types';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { finalize } from 'rxjs';
interface SearchParam {
  applicationId: string;
  walletAddress: any;
  enterpriseCode: string;
  currency: string | number;
  appliedOn: any;
  transactionType: string | number;
  txHash: string;
}

interface TransferSearchParam {
  applicationId: string;
  enterpriseCode: string;
  fromAccountAddress: string;
  sendingCurrency: string | number;
  toAccountAddress: string;
  receivingCurrency: string | number;
  createTime: any;
  state: string;
  type: string | number;
  txHash: string;
}
@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.less'
})
export class TransactionsComponent implements OnInit, AfterViewInit {
  @ViewChild('headerContent', { static: false })
  headerContent!: TemplateRef<NzSafeAny>;
  @ViewChild('headerExtra', { static: false })
  headerExtra!: TemplateRef<NzSafeAny>;
  @ViewChild('appllicationNoTpl', { static: true })
  appllicationNoTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('walletAddressTpl', { static: true })
  walletAddressTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('fromTpl', { static: true })
  fromTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('toTpl', { static: true })
  toTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('sendingAmountTpl', { static: true })
  sendingAmountTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('receivingAmountTpl', { static: true })
  receivingAmountTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('amountTpl', { static: true })
  amountTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('txHashTpl', { static: true })
  txHashTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('operationTpl', { static: true })
  operationTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('transferOperationTpl', { static: true })
  transferOperationTpl!: TemplateRef<NzSafeAny>;
  tabs = ['Top-up / Withdrawal', 'Transfer / FX Purchasing'];
  dataList: NzSafeAny[] = [];
  tableConfig!: AntTableConfig;
  currencyList: any[] = [];
  tabIndex: number = 0;
  tableQueryParams: NzTableQueryParams = {
    pageIndex: 1,
    pageSize: 10,
    sort: [],
    filter: []
  };
  searchParam: Partial<SearchParam> = {
    applicationId: '',
    walletAddress: '',
    enterpriseCode: '',
    currency: '',
    transactionType: '',
    appliedOn: [],
    txHash: ''
  };
  transferSearchParam: Partial<TransferSearchParam> = {
    applicationId: '',
    enterpriseCode: '',
    fromAccountAddress: '',
    toAccountAddress: '',
    sendingCurrency: '',
    receivingCurrency: '',
    type: '',
    createTime: [],
    txHash: ''
  };
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumb: [],
    extra: '',
    desc: '',
    footer: ''
  };
  constructor(
    private cdr: ChangeDetectorRef,
    private transactionsService: TransactionsService,
    private commonService: CommonService
  ) {}
  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: ``,
      breadcrumb: ['Enterprise Management', 'Transactions'],
      extra: this.headerExtra,
      desc: this.headerContent,
      footer: ''
    };
  }
  ngOnInit() {
    this.initTable(0);
    this.commonService.currencyList().subscribe((res: any) => {
      this.currencyList = res;
    });
  }

  tabIndexChange(value: number) {
    this.tabIndex = value;
    this.initTable(value);
    this.getDataList(this.tableQueryParams);
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
    if (this.tabIndex === 0) {
      this.searchParam = {
        applicationId: '',
        enterpriseCode: '',
        walletAddress: '',
        currency: '',
        txHash: '',
        transactionType: '',
        appliedOn: []
      };
    } else {
      this.transferSearchParam = {
        applicationId: '',
        enterpriseCode: '',
        fromAccountAddress: '',
        toAccountAddress: '',
        txHash: '',
        sendingCurrency: '',
        receivingCurrency: '',
        type: '',
        createTime: []
      };
    }
    this.getDataList(this.tableQueryParams);
  }

  changePageSize(e: number): void {
    this.tableConfig.pageSize = e;
  }

  getDataList(e?: NzTableQueryParams): void {
    this.tableConfig.loading = true;
    const params: SearchCommonVO<any> = {
      pageSize: this.tableConfig.pageSize!,
      pageNum: e?.pageIndex || this.tableConfig.pageIndex!
    };
    if (this.tabIndex === 0) {
      params.filters = this.searchParam;
      this.transactionsService
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
    } else {
      params.filters = this.transferSearchParam;
      this.transactionsService
        .fetchTransferList(params.pageNum, params.pageSize, params.filters)
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
  }

  private initTable(value: number): void {
    if (value === 0) {
      this.tableConfig = {
        headers: [
          {
            title: 'Enterprise Code',
            field: 'enterpriseCode',
            notNeedEllipsis: true,
            width: 150
          },
          {
            title: 'Wallet Address',
            tdTemplate: this.walletAddressTpl,
            notNeedEllipsis: true,
            width: 130
          },
          {
            title: 'Token Currency',
            field: 'tokenSymbol',
            notNeedEllipsis: true,
            width: 100
          },
          {
            title: 'Type',
            field: 'transactionType',
            pipe: 'walletTopUpWithdrawInfoType',
            notNeedEllipsis: true,
            width: 100
          },
          {
            title: 'Amount',
            tdTemplate: this.amountTpl,
            notNeedEllipsis: true,
            width: 150
          },
          {
            title: 'Transaction Hash',
            tdTemplate: this.txHashTpl,
            notNeedEllipsis: true,
            width: 150
          },
          {
            title: 'Applied On',
            field: 'appliedOn',
            pipe: 'timeStamp',
            notNeedEllipsis: true,
            width: 150
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
    } else {
      this.tableConfig = {
        headers: [
          {
            title: 'Enterprise Code',
            field: 'enterpriseCode',
            notNeedEllipsis: true,
            width: 150
          },
          {
            title: 'From',
            tdTemplate: this.fromTpl,
            notNeedEllipsis: true,
            width: 130
          },
          {
            title: 'Sending Amount',
            tdTemplate: this.sendingAmountTpl,
            notNeedEllipsis: true,
            width: 140
          },
          {
            title: 'To',
            tdTemplate: this.toTpl,
            notNeedEllipsis: true,
            width: 130
          },
          {
            title: 'Receiving Amount',
            tdTemplate: this.receivingAmountTpl,
            notNeedEllipsis: true,
            width: 140
          },
          {
            title: 'Type',
            field: 'type',
            pipe: 'walletTransferInfoType',
            notNeedEllipsis: true,
            width: 120
          },
          {
            title: 'Transaction Hash',
            tdTemplate: this.txHashTpl,
            notNeedEllipsis: true,
            width: 150
          },
          {
            title: 'Transaction Time',
            field: 'txTime',
            pipe: 'timeStamp',
            notNeedEllipsis: true,
            width: 150
          },
          {
            title: 'Actions',
            tdTemplate: this.transferOperationTpl,
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
}
