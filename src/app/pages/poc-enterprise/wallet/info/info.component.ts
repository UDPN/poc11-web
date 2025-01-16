/*
 * @Author: chenyuting
 * @Date: 2025-01-15 14:09:17
 * @LastEditors: chenyuting
 * @LastEditTime: 2025-01-16 15:10:55
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
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

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
  detailsTabs = ['Basic Information', 'Transactions'];
  transactionsTabs = ['Top-up / Withdraw', 'Transfer'];
  transactionsIndex: number = 0;
  tableConfig!: AntTableConfig;
  dataList: NzSafeAny[] = [];
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

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: `Details`,
      breadcrumbs: [
        { name: 'Enterprise Management' },
        {
          name: 'Wallet Management',
          url: '/poc/poc-enterprise/wallet'
        },
        { name: 'Details' }
      ],
      extra: '',
      desc: '',
      footer: ''
    };
  }
  ngOnInit() {
    this.initTable(0);
  }

  tabIndexChange(value: any) {
    console.log(value);
  }

  transactionsIndexChange(value: any) {
    this.initTable(value);
    this.getDtataList(this.tableQueryParams, value);
  }

  changePageSize(e: number): void {
    this.tableConfig.pageSize = e;
  }

  tableChangeDectction(): void {
    this.dataList = [...this.dataList];
    this.cdr.detectChanges();
  }

  tableLoading(isLoading: boolean): void {
    this.tableConfig.loading = isLoading;
    this.tableChangeDectction();
  }
  getDtataList(e?: NzTableQueryParams, tabIndex?: number): void {
    // this.tableConfig.loading = true;
    // this.routeInfo.queryParams.subscribe((param) => {
    //   const params: SearchCommonVO<any> = {
    //     pageSize: this.transactionTableConfig.pageSize!,
    //     pageNum: e?.pageIndex || this.transactionTableConfig.pageIndex!,
    //     filters: {
    //       bankAccountId: param['bankAccountId']
    //     }
    //   };
    //   this.cbdcWalletService
    //     .getTransactionList(params.pageNum, params.pageSize, params.filters)
    //     .pipe(
    //       finalize(() => {
    //         this.tableLoading(false);
    //       })
    //     )
    //     .subscribe((_: any) => {
    //       this.transactionList = _.data?.rows;
    //       this.transactionList.forEach((item) => {
    //         Object.assign(item, {
    //           chainAccountAddress: param['chainAccountAddress']
    //         });
    //       });
    //       this.transactionTableConfig.total = _.data.page.total;
    //       this.transactionTableConfig.pageIndex = params.pageNum;
    //       this.tableLoading(false);
    //       this.cdr.markForCheck();
    //     });
    // });
  }

  private initTable(value: number): void {
    this.tableConfig =
      value === 1
        ? {
            headers: [
              {
                title: 'Transaction No.',
                tdTemplate: this.transactionNoTpl,
                width: 100
              },
              {
                title: 'From',
                tdTemplate: this.fromTpl,
                width: 100
              },
              {
                title: 'Sending Amount',
                tdTemplate: this.sendingAmountTpl,
                width: 100
              },
              {
                title: 'To',
                tdTemplate: this.toTpl,
                width: 100
              },
              {
                title: 'Receiving Amount',
                tdTemplate: this.receivingAmountTpl,
                width: 100
              },
              {
                title: 'Type',
                field: 'type',
                pipe: 'walletInfoType',
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
                width: 100
              },
              {
                title: 'Status',
                tdTemplate: this.statusTpl,
                width: 100
              }
            ],
            total: 0,
            showCheckbox: false,
            loading: false,
            pageSize: 10,
            pageIndex: 1
          }
        : {
            headers: [
              {
                title: 'Transaction No.',
                tdTemplate: this.transactionNoTpl,
                width: 100
              },
              {
                title: 'From',
                tdTemplate: this.fromTpl,
                width: 100
              },
              {
                title: 'To',
                tdTemplate: this.toTpl,
                width: 100
              },
              {
                title: 'Type',
                field: 'type',
                pipe: 'walletInfoType',
                width: 100
              },
              {
                title: 'Amount',
                tdTemplate: this.amountTpl,
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
                width: 100
              },
              {
                title: 'Status',
                tdTemplate: this.statusTpl,
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
