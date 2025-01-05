import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { ActivatedRoute } from '@angular/router';
import { StatementsService } from '@app/core/services/http/poc-financial/statements/statements.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonService } from '@app/core/services/http/common/common.service';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { SearchCommonVO } from '@app/core/services/types';
import { finalize } from 'rxjs';
import {
  getCurrentTimeZone,
  timeToTimestampMillisecond
} from '@app/utils/tools';
interface SearchParam {
  tokenId: string | number;
  blockchainId: string | number;
  fileId: string;
  exportState: string | number;
  createTime: any;
  txnTime: any;
}

interface ExportParam {
  tokenId: string;
  walletAddress: string;
  fileType: number | string;
  txTypes: any;
  txnTime: any;
}

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrl: './export.component.less'
})
export class ExportComponent implements OnInit, AfterViewInit {
  @ViewChild('headerContent', { static: false })
  headerContent!: TemplateRef<NzSafeAny>;
  @ViewChild('headerExtra', { static: false })
  headerExtra!: TemplateRef<NzSafeAny>;
  @ViewChild('numberTpl', { static: true })
  numberTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('operationTpl', { static: true })
  operationTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('statusTpl', { static: true })
  statusTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('fileIdTpl', { static: true })
  fileIdTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('fileHashTpl', { static: true })
  fileHashTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('proofHashTpl', { static: true })
  proofHashTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('proofStatusTpl', { static: true })
  proofStatusTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('walletAddressTpl', { static: true })
  walletAddressTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('txnTypesTpl', { static: true })
  txnTypesTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('transactionPeriodTpl', { static: true })
  transactionPeriodTpl!: TemplateRef<NzSafeAny>;
  tokenList: Array<any> = [];
  blockchainList: Array<any> = [];
  tableConfig!: AntTableConfig;
  dataList: NzSafeAny[] = [];
  txTypesError: boolean = false;
  txnTimeError: boolean = false;
  exportLoading: boolean = false;
  searchParam: Partial<SearchParam> = {
    tokenId: '',
    blockchainId: '',
    fileId: '',
    exportState: '',
    createTime: [],
    txnTime: []
  };
  exportParam: Partial<ExportParam> = {
    tokenId: '',
    walletAddress: '',
    fileType: 0,
    txTypes: [],
    txnTime: []
  };
  tableQueryParams: NzTableQueryParams = {
    pageIndex: 1,
    pageSize: 10,
    sort: [],
    filter: []
  };
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumb: [],
    extra: '',
    desc: '',
    footer: ''
  };
  constructor(
    public routeInfo: ActivatedRoute,
    private statementsService: StatementsService,
    private cdr: ChangeDetectorRef,
    private modal: NzModalService,
    private message: NzMessageService,
    private commonService: CommonService,
    private date: DatePipe
  ) {}

  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: `Export`,
      breadcrumbs: [
        { name: 'Financial Management' },
        {
          name: 'Statements and Reports',
          url: '/poc/poc-financial/statements'
        },
        { name: 'Export' }
      ],
      extra: '',
      desc: '',
      footer: ''
    };
  }
  ngOnInit(): void {
    this.initTable();
    this.getTokenList();
    this.getBlockchainList();
  }

  tableChangeDectction(): void {
    this.dataList = [...this.dataList];
    this.cdr.detectChanges();
  }

  tableLoading(isLoading: boolean): void {
    this.tableConfig.loading = isLoading;
    this.tableChangeDectction();
  }

  resetForm() {
    this.searchParam = {
      createTime: '',
      txnTime: '',
      fileId: '',
      blockchainId: '',
      exportState: '',
      tokenId: ''
    };
    this.getDataList(this.tableQueryParams);
  }

  resetFormExport() {
    this.exportParam = {
      txTypes: [],
      tokenId: '',
      txnTime: [],
      walletAddress: '',
      fileType: 0
    };
  }

  changePageSize(e: number): void {
    this.tableConfig.pageSize = e;
  }

  getTokenList() {
    this.commonService.tokenList().subscribe((res) => {
      this.tokenList = res;
      this.cdr.markForCheck();
      return;
    });
  }

  getBlockchainList() {
    this.commonService.blockchainList().subscribe((res) => {
      this.blockchainList = res;
      this.cdr.markForCheck();
      return;
    });
  }

  onDelete(exportTaskId: any) {
    this.modal.confirm({
      nzTitle: `Are you sure you want to delete ?`,
      nzContent: '',
      nzOnOk: () =>
        new Promise((resolve, reject) => {
          this.statementsService.taskDelete({ exportTaskId }).subscribe({
            next: (res) => {
              resolve(true);
              if (res) {
                this.message
                  .success(`Deleted`, { nzDuration: 1000 })
                  .onClose!.subscribe(() => {
                    this.getDataList();
                  });
              }
              this.cdr.markForCheck();
            },
            error: (err) => {
              reject(true);
              this.cdr.markForCheck();
            }
          });
        }).catch(() => console.log('Oops errors!'))
    });
  }

  onDownload(busId: any, busType: any, fileName: any) {
    this.tableLoading(true);
    this.commonService
      .download(busId, busType)
      .pipe(finalize(() => this.tableLoading(false)))
      .subscribe({
        next: (res) => {
          if (res) {
            this.message
              .success('Downloaded!', { nzDuration: 1000 })
              .onClose.subscribe(() => {
                const blob = new Blob([res.body], {
                  type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                });
                if ('download' in document.createElement('a')) {
                  const elink = document.createElement('a');
                  elink.download = fileName;
                  elink.style.display = 'none';
                  elink.href = URL.createObjectURL(blob);
                  document.body.appendChild(elink);
                  elink.click();
                  URL.revokeObjectURL(elink.href);
                  document.body.removeChild(elink);
                  this.cdr.markForCheck();
                }
              });
          }
          this.tableLoading(false);
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.tableLoading(false);
          this.cdr.markForCheck();
        }
      });
  }

  getTxTypes(event: any) {
    if (event.length !== 0) {
      this.txTypesError = false;
    } else {
      this.txTypesError = true;
    }
  }

  getTxnTime(event: any) {
    if (event.length !== 0) {
      this.txnTimeError = false;
    } else {
      this.txnTimeError = true;
    }
  }

  getExport() {
    this.getTxTypes(this.exportParam.txTypes);
    this.getTxnTime(this.exportParam.txnTime);
    if (this.txTypesError === false && this.txnTimeError === false) {
      this.exportLoading = true;
      this.statementsService
        .createExport({
          exportType: 0,
          moduleType: 5,
          timeZone: getCurrentTimeZone(),
          transactionRecordsListReqVO: {
            tokenId: this.exportParam.tokenId,
            txStartTime: this.exportParam.txnTime[0]
              ? timeToTimestampMillisecond(
                  this.date.transform(
                    this.exportParam.txnTime[0],
                    'yyyy-MM-dd'
                  ) + ' 00:00:00'
                )
              : '',
            txEndTime: this.exportParam.txnTime[1]
              ? timeToTimestampMillisecond(
                  this.date.transform(
                    this.exportParam.txnTime[1],
                    'yyyy-MM-dd'
                  ) + ' 23:59:59'
                )
              : '',
            txTypes: this.exportParam.txTypes,
            walletAddress: this.exportParam.walletAddress
          }
        })
        .pipe(finalize(() => this.exportLoading === false))
        .subscribe({
          next: (res) => {
            if (res) {
              this.message.success('Export successfully!', {
                nzDuration: 1000
              });
            }
            this.getDataList();
            this.exportLoading === false;
            this.cdr.markForCheck();
          },
          error: (err) => {
            this.exportLoading === false;
            this.cdr.markForCheck();
          }
        });
    }
  }
  getDataList(e?: NzTableQueryParams): void {
    this.tableConfig.loading = true;
    const params: SearchCommonVO<any> = {
      pageSize: this.tableConfig.pageSize!,
      pageNum: e?.pageIndex || this.tableConfig.pageIndex!,
      filters: this.searchParam
    };
    this.statementsService
      .taskExportRecordsList(params.pageNum, params.pageSize, params.filters)
      .pipe(
        finalize(() => {
          this.tableLoading(false);
        })
      )
      .subscribe((_: any) => {
        this.dataList = _.data.rows;
        this.dataList.forEach((item: any, i: any) => {
          Object.assign(item, { key: (params.pageNum - 1) * 10 + i + 1 });
        });
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
          title: 'No.',
          tdTemplate: this.numberTpl,
          notNeedEllipsis: true,
          width: 80,
          show: true
        },
        {
          title: 'Token Name',
          field: 'tokenName',
          notNeedEllipsis: true,
          width: 120
        },
        {
          title: 'Blockchain',
          field: 'blockchainName',
          notNeedEllipsis: true,
          width: 120
        },
        {
          title: 'Transaction Type',
          tdTemplate: this.txnTypesTpl,
          notNeedEllipsis: true,
          width: 160
        },
        {
          title: 'Wallet Address',
          tdTemplate: this.walletAddressTpl,
          notNeedEllipsis: true,
          width: 150
        },
        {
          title: 'File ID',
          tdTemplate: this.fileIdTpl,
          notNeedEllipsis: true,
          width: 150
        },
        {
          title: 'File Hash',
          tdTemplate: this.fileHashTpl,
          notNeedEllipsis: true,
          width: 150
        },
        {
          title: 'Transaction Period',
          tdTemplate: this.transactionPeriodTpl,
          notNeedEllipsis: true,
          width: 180
        },
        {
          title: 'Executed On',
          field: 'exportTime',
          notNeedEllipsis: true,
          pipe: 'timeStamp',
          width: 120
        },
        {
          title: 'Executed Status',
          tdTemplate: this.statusTpl,
          notNeedEllipsis: true,
          width: 150
        },
        // {
        //   title: 'Proof Hash',
        //   tdTemplate: this.proofHashTpl,
        //   width: 120
        // },
        // {
        //   title: 'Proof Time',
        //   field: 'proofTime',
        //   notNeedEllipsis: true,
        //   pipe: 'timeStamp',
        //   width: 120
        // },
        // {
        //   title: 'Proof Status',
        //   tdTemplate: this.proofStatusTpl,
        //   width: 150
        // },
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
