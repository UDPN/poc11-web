import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { SearchCommonVO } from '@app/core/services/types';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { finalize } from 'rxjs';
import { PocDownloadCenterService } from '@app/core/services/http/poc-download-center/poc-download-center.service';
import { CommonService } from '@app/core/services/http/common/common.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-download-center',
  templateUrl: './download-center.component.html',
  styleUrl: './download-center.component.less'
})
export class DownloadCenterComponent implements OnInit, AfterViewInit {
  @ViewChild('headerContent', { static: false })
  headerContent!: TemplateRef<NzSafeAny>;
  @ViewChild('headerExtra', { static: false })
  headerExtra!: TemplateRef<NzSafeAny>;
  @ViewChild('operationTpl', { static: true })
  operationTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('numberTpl', { static: true })
  numberTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('fileIdTpl', { static: true })
  fileIdTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('fileHashTpl', { static: true })
  fileHashTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('statusTpl', { static: true })
  statusTpl!: TemplateRef<NzSafeAny>;
  tableConfig!: AntTableConfig;
  dataList: NzSafeAny[] = [];
  isLoadingDownlad: boolean = false;
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
    private cdr: ChangeDetectorRef,
    private downloadCenterService: PocDownloadCenterService,
    private commonService: CommonService,
    private message: NzMessageService
  ) {}
  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: ``,
      breadcrumb: ['Download Center'],
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

  changePageSize(e: number): void {
    this.tableConfig.pageSize = e;
  }
  getDataList(e?: NzTableQueryParams): void {
    this.tableConfig.loading = true;
    const params: SearchCommonVO<any> = {
      pageSize: this.tableConfig.pageSize!,
      pageNum: e?.pageIndex || this.tableConfig.pageIndex!
    };
    this.downloadCenterService
      .fetchList(params.pageNum, params.pageSize)
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

  getDownload(busId: any, busType: any, fileName: any) {
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
  private initTable(): void {
    this.tableConfig = {
      headers: [
        {
          title: 'No.',
          tdTemplate: this.numberTpl,
          notNeedEllipsis: true,
          width: 100,
          show: true
        },
        {
          title: 'Data Source',
          field: 'moduleType',
          pipe: 'moduleType',
          notNeedEllipsis: true,
          width: 180
        },
        {
          title: 'File ID',
          tdTemplate: this.fileIdTpl,
          notNeedEllipsis: true,
          width: 180
        },
        {
          title: 'File Hash',
          notNeedEllipsis: true,
          tdTemplate: this.fileHashTpl,
          width: 180
        },
        {
          title: 'Export Time',
          field: 'exportTime',
          pipe: 'timeStamp',
          notNeedEllipsis: true,
          width: 180
        },
        {
          title: 'Created by',
          field: 'exportUserName',
          notNeedEllipsis: true,
          width: 100
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
