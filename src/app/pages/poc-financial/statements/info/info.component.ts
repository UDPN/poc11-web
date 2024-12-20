/*
 * @Author: chenyuting
 * @Date: 2024-12-12 16:33:30
 * @LastEditors: chenyuting
 * @LastEditTime: 2024-12-19 17:22:01
 * @Description: 
 */
/*
 * @Author: chenyuting
 * @Date: 2024-12-12 16:33:30
 * @LastEditors: chenyuting
 * @LastEditTime: 2024-12-16 09:45:37
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
import { CommonService } from '@app/core/services/http/common/common.service';
import { StatementsService } from '@app/core/services/http/poc-financial/statements/statements.service';
import { SearchCommonVO } from '@app/core/services/types';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { finalize } from 'rxjs';
interface SearchParam {
  fileId: string;
  exportState: string | number;
  createTime: any;
  txnTime: any;
  exportRuleId: any;
}
@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrl: './info.component.less'
})
export class InfoComponent implements OnInit, AfterViewInit {
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
  info: any = {};
  tableConfig!: AntTableConfig;
  dataList: NzSafeAny[] = [];
  searchParam: Partial<SearchParam> = {
    fileId: '',
    exportState: '',
    createTime: [],
    txnTime: [],
    exportRuleId: ''
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
    private commonService: CommonService
  ) {}

  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: `Details`,
      breadcrumbs: [
        { name: 'Financial Management' },
        {
          name: 'Statements and Reports',
          url: '/poc/poc-financial/statements'
        },
        { name: 'Details' }
      ],
      extra: '',
      desc: '',
      footer: ''
    };
  }
  ngOnInit(): void {
    this.initTable();
    this.getInfo();
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
    this.searchParam = {};
    this.searchParam.createTime = '';
    this.searchParam.txnTime = '';
    this.searchParam.fileId = '';
    this.searchParam.exportState = '';
    this.getDataList(this.tableQueryParams);
  }

  changePageSize(e: number): void {
    this.tableConfig.pageSize = e;
  }

  getInfo(): void {
    this.routeInfo.queryParams.subscribe((params) => {
      this.searchParam.exportRuleId = params['exportRuleId'];
      this.statementsService
        .taskDetail({ exportRuleId: params['exportRuleId'] })
        .subscribe((res: any) => {
          this.info = res;
          this.cdr.markForCheck();
          return;
        });
    });
  }

  onDelete(exportTaskId: any) {
    this.modal.confirm({
      nzTitle: `Are you sure you want to delete ?`,
      nzContent: '',
      nzOnOk: () =>
        new Promise((resolve, reject) => {
          this.statementsService.taskDelete({ exportTaskId }).subscribe({
            next: res => {
              resolve(true);
              if (res) {
                this.message.success(`Delete successfully`, {nzDuration: 1000}).onClose!.subscribe(() => {
                  this.getDataList();
                });
              }
              this.cdr.markForCheck();
            },
            error: err => {
              reject(true);
              this.cdr.markForCheck();
            },
          })
        }).catch(() => console.log('Oops errors!'))
    });
  }

  onDownload(busId: any, busType: any, fileName: any) {
    this.tableLoading(true);
    this.commonService
      .download(busId, busType)
      .pipe(finalize(() => (this.tableLoading(false))))
      .subscribe({
        next: (res) => {
          if (res) {
            this.message
              .success('Download successfully!', { nzDuration: 1000 })
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

  getDataList(e?: NzTableQueryParams): void {
    this.tableConfig.loading = true;
    const params: SearchCommonVO<any> = {
      pageSize: this.tableConfig.pageSize!,
      pageNum: e?.pageIndex || this.tableConfig.pageIndex!,
      filters: this.searchParam
    };
    this.statementsService
      .taskDetailRecordsList(params.pageNum, params.pageSize, params.filters)
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
          width: 80,
          show: true
        },
        {
          title: 'File ID',
          tdTemplate: this.fileIdTpl,
          width: 120
        },
        {
          title: 'File Hash',
          tdTemplate: this.fileHashTpl,
          width: 120
        },
        {
          title: 'Transaction Period',
          field: 'startTime',
          notNeedEllipsis: true,
          pipe: 'dayStamp',
          width: 150
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
          width: 150
        },
        {
          title: 'Proof Hash',
          tdTemplate: this.proofHashTpl,
          width: 120
        },
        {
          title: 'Proof Time',
          field: 'proofTime',
          notNeedEllipsis: true,
          pipe: 'timeStamp',
          width: 120
        },
        {
          title: 'Proof Status',
          tdTemplate: this.proofStatusTpl,
          width: 100
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
