import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NotificationsService } from '@app/core/services/http/poc-notifications/poc-notifications.service';
import { SearchCommonVO } from '@app/core/services/types';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-internal-notifications',
  templateUrl: './internal-notifications.component.html',
  styleUrl: './internal-notifications.component.less'
})
export class InternalNotificationsComponent {
  @ViewChild('numberTpl', { static: true })
  numberTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('contentTpl', { static: true })
  contentTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('operationTpl', { static: true })
  operationTpl!: TemplateRef<NzSafeAny>;
  tableQueryParams: NzTableQueryParams = {
    pageIndex: 1,
    pageSize: 10,
    sort: [],
    filter: []
  };
  tableConfig!: AntTableConfig;
  dataList: NzSafeAny[] = [{}];
  modalInfo: any = {};
  isVisible: boolean = false;
  constructor(
    private cdr: ChangeDetectorRef,
    private notificationsService: NotificationsService,
    private modal: NzModalService,
    private message: NzMessageService,
    private sanitizer: DomSanitizer
  ) {}
  ngAfterViewInit(): void {}
  ngOnInit(): void {
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
      pageNum: e?.pageIndex || this.tableConfig.pageIndex!,
      filters: { msgType: 3 }
    };
    this.notificationsService
      .getList(params.pageNum, params.pageSize, params.filters)
      .pipe(
        finalize(() => {
          this.tableLoading(false);
        })
      )
      .subscribe((_: any) => {
        this.dataList = _.data?.rows;
        this.dataList.forEach((item: any, i: any) => {
          item.content = this.sanitizer.bypassSecurityTrustHtml(item.content);
          Object.assign(item, {
            key: (params.pageNum - 1) * 10 + i + 1
          });
        });
        this.tableConfig.total = _.data.page.total;
        this.tableConfig.pageIndex = params.pageNum;
        this.tableLoading(false);
        this.cdr.markForCheck();
      });
  }

  cancel() {
    this.isVisible = false;
    this.modalInfo = {};
  }
  getModal(chatMsgId: any): void {
    this.isVisible = true;
    this.notificationsService
      .getInfo({ chatMsgId, msgType: 3 })
      .subscribe((res: any) => {
        this.modalInfo = res;
        this.modalInfo.content = this.sanitizer.bypassSecurityTrustHtml(
          this.modalInfo.content
        );
        this.cdr.markForCheck();
        return;
      });
  }

  onDelete(chatMsgId: any) {
    this.modal.confirm({
      nzTitle: `Are you sure you want to delete this internal notification?`,
      nzContent: '',
      nzOnOk: () =>
        new Promise((resolve, reject) => {
          this.notificationsService
            .getNoticeDelete({ chatMsgId, msgType: 3 })
            .subscribe({
              next: (res) => {
                resolve(true);
                if (res) {
                  this.message
                    .success(`Delete successfully`, { nzDuration: 1000 })
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

  private initTable(): void {
    this.tableConfig = {
      headers: [
        {
          title: 'No.',
          tdTemplate: this.numberTpl,
          notNeedEllipsis: true,
          width: 50
        },
        {
          title: 'Type',
          field: 'title',
          notNeedEllipsis: true,
          width: 150
        },
        {
          title: 'Details',
          tdTemplate: this.contentTpl,
          notNeedEllipsis: true,
          width: 450
        },
        {
          title: 'Created on',
          field: 'createTime',
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
  }
}
