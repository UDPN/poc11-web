/*
 * @Author: chenyuting
 * @Date: 2025-01-15 14:09:17
 * @LastEditors: chenyuting
 * @LastEditTime: 2025-02-24 13:45:05
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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '@app/core/services/http/common/common.service';
import { WalletService } from '@app/core/services/http/poc-enterprise/wallet/wallet.service';
import { SearchCommonVO } from '@app/core/services/types';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { fnCheckForm } from '@app/utils/tools';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { finalize } from 'rxjs';
interface SearchParam {
  accountAddress: any;
  enterpriseCode: string;
  currency: string | number;
  createTime: any;
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
  @ViewChild('accountAddressTpl', { static: true })
  accountAddressTpl!: TemplateRef<NzSafeAny>;
  searchParam: Partial<SearchParam> = {
    accountAddress: '',
    enterpriseCode: '',
    currency: '',
    status: '',
    createTime: []
  };
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumb: [],
    extra: '',
    desc: '',
    footer: ''
  };
  dataList: NzSafeAny[] = [];
  currencyList: any[] = [];
  tableQueryParams: NzTableQueryParams = {
    pageIndex: 1,
    pageSize: 10,
    sort: [],
    filter: []
  };
  tableConfig!: AntTableConfig;

  // isVisible: boolean = false;
  // bankAccountId: string = '';
  // walletState: number = 0;
  // visibleForm!: FormGroup;
  // visibleTitle: string = '';
  // visibleTip: string = '';
  // isLoading: boolean = false;
  // balance: any = '';
  // currency: string = '';

  constructor(
    private cdr: ChangeDetectorRef,
    private modal: NzModalService,
    private message: NzMessageService,
    private walletService: WalletService,
    private commonService: CommonService,
    private fb: FormBuilder
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
    // this.visibleForm = this.fb.group({
    //   accountAddress: ['', [Validators.required]],
    //   enterpriseCode: ['', [Validators.required]],
    //   comments: ['', [Validators.required]]
    // });
    this.commonService.currencyList().subscribe((res: any) => {
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
    this.searchParam = {
      enterpriseCode: '',
      accountAddress: '',
      currency: '',
      status: '',
      createTime: []
    };
    this.getDataList(this.tableQueryParams);
  }

  changePageSize(e: number): void {
    this.tableConfig.pageSize = e;
  }

  updateStatus(bankAccountId: any, walletState: number) {
    let statusValue = '';
    if (walletState === 1) {
      statusValue = 'deactivate';
    } else {
      statusValue = 'activate';
    }
    const toolStatus =
      statusValue.charAt(0).toUpperCase() + statusValue.slice(1);
    this.modal.confirm({
      nzTitle: `Are you sure you want to ${statusValue} ?`,
      nzContent: '',
      nzOnOk: () =>
        new Promise((resolve, reject) => {
          this.walletService
            .getStatusUpdate({ bankAccountId, walletState })
            .subscribe({
              next: (res) => {
                resolve(true);
                this.cdr.markForCheck();
                if (res) {
                  this.message.success(`${toolStatus} successfully!`, {
                    nzDuration: 1000
                  });
                }
                this.getDataList();
              },
              error: (err) => {
                reject(true);
                this.cdr.markForCheck();
              }
            });
        }).catch(() => console.log('Oops errors!'))
    });
  }

  // isOpenVisable(
  //   bankAccountId: any,
  //   accountAddress: string,
  //   enterpriseCode: string,
  //   balance: any,
  //   currency: string,
  //   walletState: number
  // ) {
  //   this.isVisible = true;
  //   this.bankAccountId = bankAccountId;
  //   this.walletState = walletState;
  //   this.balance = balance;
  //   this.currency = currency;
  //   this.visibleForm.get('accountAddress')?.setValue(accountAddress);
  //   this.visibleForm.get('enterpriseCode')?.setValue(enterpriseCode);
  //   if (walletState === 1) {
  //     this.visibleTitle = 'Deactivate Enterprise Wallet';
  //     this.visibleTip =
  //       'Disabling the wallet will prevent the enterprise from processing token transactions.';
  //   } else {
  //     this.visibleTitle = 'Activate Enterprise Wallet';
  //     this.visibleTip =
  //       'Enabling the wallet will allow the enterprise to process token transactions.';
  //   }
  // }

  // cancelVisible() {
  //   this.isVisible = false;
  //   this.bankAccountId = '';
  //   this.walletState = 0;
  //   this.visibleForm.reset();
  //   this.visibleTitle = '';
  //   this.visibleTip = '';
  //   this.balance = '';
  //   this.currency = '';
  // }

  // onStatusUpdate() {
  //   if (!fnCheckForm(this.visibleForm)) {
  //     return;
  //   }
  //   this.isLoading = true;
  //   this.walletService
  //     .getStatusUpdate({
  //       bankAccountId: this.bankAccountId,
  //       walletState: this.walletState,
  //       comments: this.visibleForm.get('comments')?.value
  //     })
  //     .pipe(finalize(() => (this.isLoading = false)))
  //     .subscribe({
  //       next: (res) => {
  //         if (res) {
  //           this.message
  //             .success('Submitted', { nzDuration: 1000 })
  //             .onClose.subscribe(() => {
  //               this.visibleForm.reset();
  //               this.getDataList(this.tableQueryParams);
  //             });
  //         }
  //         this.isLoading = false;
  //         this.cdr.markForCheck();
  //       },
  //       error: (err) => {
  //         this.isLoading = false;
  //         this.cdr.markForCheck();
  //       }
  //     });
  // }
  getDataList(e?: NzTableQueryParams): void {
    this.tableConfig.loading = true;
    const params: SearchCommonVO<any> = {
      pageSize: this.tableConfig.pageSize!,
      pageNum: e?.pageIndex || this.tableConfig.pageIndex!,
      filters: this.searchParam
    };
    this.walletService
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
  }

  private initTable(): void {
    this.tableConfig = {
      headers: [
        {
          title: 'Wallet Address',
          tdTemplate: this.accountAddressTpl,
          notNeedEllipsis: true,
          width: 150
        },
        {
          title: 'Enterprise Code',
          field: 'enterpriseCode',
          notNeedEllipsis: true,
          width: 150
        },
        {
          title: 'Token',
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
