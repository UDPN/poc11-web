/*
 * @Author: chenyuting
 * @Date: 2025-01-15 14:09:17
 * @LastEditors: chenyuting
 * @LastEditTime: 2025-01-17 11:03:39
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
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
interface SearchParam {
  walletAddress: any;
  enterpriseName: string;
  currency: string | number;
  creationTime: any;
  status: string;
}

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrl: './wallet.component.less'
})
export class WalletComponent implements OnInit, AfterViewInit {
  @ViewChild('headerContent', { static: false })
  headerContent!: TemplateRef<NzSafeAny>;
  @ViewChild('headerExtra', { static: false })
  headerExtra!: TemplateRef<NzSafeAny>;
  @ViewChild('operationTpl', { static: true })
  operationTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('statusTpl', { static: true })
  statusTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('balanceTpl', { static: true })
  balanceTpl!: TemplateRef<NzSafeAny>;
  searchParam: Partial<SearchParam> = {
    walletAddress: '',
    enterpriseName: '',
    currency: '',
    status: '',
    creationTime: []
  };
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumb: [],
    extra: '',
    desc: '',
    footer: ''
  };
  dataList: NzSafeAny[] = [{}];
  tableQueryParams: NzTableQueryParams = {
    pageIndex: 1,
    pageSize: 10,
    sort: [],
    filter: []
  };
  tableConfig!: AntTableConfig;

  constructor(
    private cdr: ChangeDetectorRef,
    private modal: NzModalService,
    private message: NzMessageService
  ) {}
  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: ``,
      breadcrumb: ['Enterprise Management', 'Wallet Management'],
      extra: this.headerExtra,
      desc: this.headerContent,
      footer: ''
    };
  }
  ngOnInit() {
    this.initTable();
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
    this.searchParam = {
      enterpriseName: '',
      walletAddress: '',
      currency: '',
      status: '',
      creationTime: []
    };
    this.getDataList(this.tableQueryParams);
  }

  changePageSize(e: number): void {
    this.tableConfig.pageSize = e;
  }

  updateStatus(state: number) {
    let statusValue = '';
    // if (state === 30) {
    //   statusValue = 'deactivate';
    // } else {
    //   statusValue = 'activate';
    // }
    const toolStatus =
      statusValue.charAt(0).toUpperCase() + statusValue.slice(1);
    this.modal.confirm({
      nzTitle: `Are you sure you want to ${statusValue} ?`,
      nzContent: '',
      nzOnOk: () =>
        new Promise((resolve, reject) => {
          // this.statementsService
          //   .statusUpdate({ exportRuleId, state })
          //   .subscribe({
          //     next: (res) => {
          //       resolve(true);
          //       this.cdr.markForCheck();
          //       if (res) {
          //         this.message.success(`${toolStatus} successfully!`, {
          //           nzDuration: 1000
          //         });
          //       }
          //       this.getDataList();
          //     },
          //     error: (err) => {
          //       reject(true);
          //       this.cdr.markForCheck();
          //     }
          //   });
        }).catch(() => console.log('Oops errors!'))
    });
  }

  getDataList(e?: NzTableQueryParams): void {
    // this.tableConfig.loading = true;
    // const params: SearchCommonVO<any> = {
    //   pageSize: this.tableConfig.pageSize!,
    //   pageNum: e?.pageIndex || this.tableConfig.pageIndex!,
    //   filters: this.searchParam
    // };
    // this.transactionRecordService
    //   .getList(params.pageNum, params.pageSize, params.filters)
    //   .pipe(
    //     finalize(() => {
    //       this.tableLoading(false);
    //     })
    //   )
    //   .subscribe((_: any) => {
    //     this.dataList = _.data?.rows;
    //     this.dataList.forEach((item: any, i: any) => {
    //       Object.assign(item, { key: (params.pageNum - 1) * 10 + i + 1 });
    //     });
    //     this.tableConfig.total = _.data.page.total;
    //     this.tableConfig.pageIndex = params.pageNum;
    //     this.tableLoading(false);
    //     this.cdr.markForCheck();
    //   });
  }

  private initTable(): void {
    this.tableConfig = {
      headers: [
        {
          title: 'Wallet Address',
          field: 'walletAddress',
          notNeedEllipsis: true,
          width: 150
        },
        {
          title: 'Enterprise Name',
          field: 'enterpriseName',
          notNeedEllipsis: true,
          width: 150
        },
        {
          title: 'Currency',
          field: 'currency',
          notNeedEllipsis: true,
          width: 100
        },
        {
          title: 'Balance',
          tdTemplate: this.balanceTpl,
          notNeedEllipsis: true,
          width: 150
        },
        {
          title: 'Created on',
          field: 'createTime',
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
          width: 150
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
