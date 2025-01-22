/*
 * @Author: chenyuting
 * @Date: 2025-01-15 14:09:17
 * @LastEditors: chenyuting
 * @LastEditTime: 2025-01-22 11:10:46
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
import { ActivatedRoute } from '@angular/router';
import { WalletService } from '@app/core/services/http/poc-enterprise/wallet/wallet.service';
import { SearchCommonVO } from '@app/core/services/types';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrl: './info.component.less'
})
export class InfoComponent implements OnInit, AfterViewInit {
  @ViewChild('transactionNoTpl', { static: true })
  transactionNoTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('fromTpl', { static: true })
  fromTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('toTpl', { static: true })
  toTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('amountTpl', { static: true })
  amountTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('sendingAmountTpl', { static: true })
  sendingAmountTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('transactionHashTpl', { static: true })
  transactionHashTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('receivingAmountTpl', { static: true })
  receivingAmountTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('statusTpl', { static: true })
  statusTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('walletAddressTpl', { static: true })
  walletAddressTpl!: TemplateRef<NzSafeAny>;
  info: any = {};
  detailsTabs = ['Basic Information', 'Transactions'];
  transactionsTabs = ['Top-up / Withdraw', 'Transfer / FX Purchasing'];
  transactionsIndex: any = 0;
  tableConfig!: AntTableConfig;
  transferTableConfig!: AntTableConfig;
  dataList: NzSafeAny[] = [];
  transferDataList: NzSafeAny[] = [];
  type: string = '';
  tableQueryParams: NzTableQueryParams = {
    pageIndex: 1,
    pageSize: 10,
    sort: [],
    filter: []
  };
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumbs: [],
    extra: '',
    desc: '',
    footer: ''
  };

  constructor(
    private cdr: ChangeDetectorRef,
    private routeInfo: ActivatedRoute,
    private walletService: WalletService
  ) {}

  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: this.type === 'info' ? 'Details' : 'Approval',
      breadcrumbs: [
        { name: 'Enterprise Management' },
        {
          name: 'Wallet Management',
          url: '/poc/poc-enterprise/wallet'
        },
        { name: this.type === 'info' ? 'Details' : 'Approval' }
      ],
      extra: '',
      desc: '',
      footer: ''
    };
  }
  ngOnInit() {
    this.routeInfo.queryParams.subscribe((params) => {
      this.getBasicDetail();
      this.type = params['type'];
      if (this.type === 'info') {
        this.transactionsIndexChange(0);
      }
    });
  }

  getBasicDetail() {
    this.routeInfo.queryParams.subscribe((params) => {
      this.walletService
        .getBasicInfo({ bankAccountId: params['bankAccountId'] })
        .subscribe((res: any) => {
          this.info = res;
          this.cdr.markForCheck();
          return;
        });
    });
  }
  tabIndexChange(value: any) {
    if (value === 0) {
      this.getBasicDetail();
    } else {
      this.transactionsIndexChange(0);
    }
  }
  transactionsIndexChange(value: any) {
    this.transactionsIndex = value;
    this.initTable();
    if (value === 0) {
      this.getTopUpWithdrawDataList(this.tableQueryParams);
    } else {
      this.getTransferDataList(this.tableQueryParams);
    }
  }

  changePageSize(e: number): void {
    this.tableConfig.pageSize = e;
  }
  changePageSize1(e: number): void {
    this.transferTableConfig.pageSize = e;
  }
  tableChangeDectction(): void {
    this.dataList = [...this.dataList];
    this.cdr.detectChanges();
  }
  transferTableChangeDectction(): void {
    this.transferDataList = [...this.transferDataList];
    this.cdr.detectChanges();
  }
  tableLoading(isLoading: boolean): void {
    this.tableConfig.loading = isLoading;
    this.tableChangeDectction();
  }
  transferTableLoading(isLoading: boolean): void {
    this.transferTableConfig.loading = isLoading;
    this.transferTableChangeDectction();
  }
  getTopUpWithdrawDataList(e?: NzTableQueryParams): void {
    this.tableConfig.loading = true;
    this.routeInfo.queryParams.subscribe((param) => {
      const params: SearchCommonVO<any> = {
        pageSize: this.tableConfig.pageSize!,
        pageNum: e?.pageIndex || this.tableConfig.pageIndex!,
        filters: {
          bankAccountId: param['bankAccountId']
        }
      };
      this.walletService
        .getTopUpAndWithdrawInfo(
          params.pageNum,
          params.pageSize,
          params.filters
        )
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
    });
  }

  getTransferDataList(e?: NzTableQueryParams): void {
    this.transferTableConfig.loading = true;
    this.routeInfo.queryParams.subscribe((param) => {
      const params: SearchCommonVO<any> = {
        pageSize: this.transferTableConfig.pageSize!,
        pageNum: e?.pageIndex || this.transferTableConfig.pageIndex!,
        filters: {
          bankAccountId: param['bankAccountId']
        }
      };
      this.walletService
        .getTransferInfo(params.pageNum, params.pageSize, params.filters)
        .pipe(
          finalize(() => {
            this.transferTableLoading(false);
          })
        )
        .subscribe((_: any) => {
          this.transferDataList = _.data?.rows;
          console.log(this.transferDataList, 'transferDataList');

          this.transferTableConfig.total = _.data.page.total;
          this.transferTableConfig.pageIndex = params.pageNum;
          this.transferTableLoading(false);
          this.cdr.markForCheck();
        });
    });
  }

  private initTable(): void {
    this.transferTableConfig = {
      headers: [
        {
          title: 'Transaction No.',
          tdTemplate: this.transactionNoTpl,
          width: 100
        },
        {
          title: 'From',
          tdTemplate: this.fromTpl,
          width: 110
        },
        {
          title: 'Sending Amount',
          tdTemplate: this.sendingAmountTpl,
          width: 100
        },
        {
          title: 'To',
          tdTemplate: this.toTpl,
          width: 110
        },
        {
          title: 'Receiving Amount',
          tdTemplate: this.receivingAmountTpl,
          width: 100
        },
        {
          title: 'Type',
          field: 'type',
          pipe: 'walletTransferInfoType',
          width: 100
        },
        {
          title: 'Transaction Hash',
          tdTemplate: this.transactionHashTpl,
          width: 100
        },
        {
          title: 'Transaction Time',
          field: 'txTime',
          pipe: 'timeStamp',
          notNeedEllipsis: true,
          width: 150
        },
        {
          title: 'Status',
          tdTemplate: this.statusTpl,
          width: 80
        }
      ],
      total: 0,
      showCheckbox: false,
      loading: false,
      pageSize: 10,
      pageIndex: 1
    };

    this.tableConfig = {
      headers: [
        {
          title: 'Transaction No.',
          tdTemplate: this.transactionNoTpl,
          notNeedEllipsis: true,
          width: 100
        },
        {
          title: 'Wallet Address',
          tdTemplate: this.walletAddressTpl,
          notNeedEllipsis: true,
          width: 100
        },
        {
          title: 'Currency',
          field: 'currency',
          notNeedEllipsis: true,
          width: 100
        },
        {
          title: 'Type',
          field: 'type',
          pipe: 'walletTopUpWithdrawInfoType',
          notNeedEllipsis: true,
          width: 100
        },
        {
          title: 'Amount',
          tdTemplate: this.amountTpl,
          notNeedEllipsis: true,
          width: 100
        },
        {
          title: 'Transaction Hash',
          tdTemplate: this.transactionHashTpl,
          notNeedEllipsis: true,
          width: 100
        },
        {
          title: 'Transaction Time',
          field: 'txTime',
          pipe: 'timeStamp',
          notNeedEllipsis: true,
          width: 100
        },
        {
          title: 'Status',
          tdTemplate: this.statusTpl,
          notNeedEllipsis: true,
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
