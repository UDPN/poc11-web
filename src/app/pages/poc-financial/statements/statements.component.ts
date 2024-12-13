/*
 * @Author: chenyuting
 * @Date: 2024-12-10 11:08:21
 * @LastEditors: chenyuting
 * @LastEditTime: 2024-12-12 16:46:17
 * @Description:
 */
/*
 * @Author: chenyuting
 * @Date: 2024-12-10 11:08:21
 * @LastEditors: chenyuting
 * @LastEditTime: 2024-12-10 11:18:49
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
import { SearchCommonVO } from '@app/core/services/types';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { finalize } from 'rxjs';
interface SearchParam {
  tokenName: string;
  blockchain: string;
  exportFrequency: string | number;
  status: string | number;
  createTime: any;
  executedTime: any;
}
@Component({
  selector: 'app-statements',
  templateUrl: './statements.component.html',
  styleUrl: './statements.component.less'
})
export class StatementsComponent implements OnInit, AfterViewInit {
  @ViewChild('headerContent', { static: false })
  headerContent!: TemplateRef<NzSafeAny>;
  @ViewChild('headerExtra', { static: false })
  headerExtra!: TemplateRef<NzSafeAny>;
  @ViewChild('numberTpl', { static: true })
  numberTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('operationTpl', { static: true })
  operationTpl!: TemplateRef<NzSafeAny>;
  tableConfig!: AntTableConfig;
  dataList: NzSafeAny[] = [];  
  tokenList: any = [];
  blockchainList: any = [];
  visible = false;
  validateForm!: FormGroup;
  searchParam: Partial<SearchParam> = {
    tokenName: '',
    blockchain: '',
    exportFrequency: '',
    status: '',
    createTime: [],
    executedTime: []
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
  constructor(private cdr: ChangeDetectorRef,private fb: FormBuilder, private modal: NzModalService, private message: NzMessageService) {}
  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: ``,
      breadcrumb: ['Financial Management', 'Statements and Reports'],
      extra: this.headerExtra,
      desc: this.headerContent,
      footer: ''
    };
  }

  ngOnInit() {
    this.initTable();
    this.validateForm = this.fb.group({
      taskName: [null, [Validators.required]],
      // realName: [null, [Validators.required]],
      // telephone: [null, [Validators.required]],
      // email: [null, [Validators.required]],
      // roleIdList: [null, [Validators.required]],
      // lockable: [2, [Validators.required]],
    })
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
    this.getDataList(this.tableQueryParams);
  }

  changePageSize(e: number): void {
    this.tableConfig.pageSize = e;
  }


  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }
  onDelete(name: string) {
    this.modal.confirm({
      nzTitle: `Are you sure you want to delete <b>${name}</b> ?`,
      nzContent: '',
      nzOnOk: () =>
        new Promise((resolve, reject) => {
          // this.userService.statusUpdate({ userId, lockable: 3 }).subscribe({
          //   next: res => {
          //     resolve(true);
          //     if (res) {
          //       this.message.success(`Delete successfully`).onClose!.subscribe(() => {
          //         this.getDataList();
          //       });
          //     }
          //     this.cdr.markForCheck();
          //   },
          //   error: err => {
          //     reject(true);
          //     this.cdr.markForCheck();
          //   },
          // })
        }).catch(() => console.log('Oops errors!'))
    });
  }
  onStatusUpdate(id: number, lockable: number, name: string) {
    let status = '';
    if (lockable === 1) {
      status = 'deactivate'
    } else {
      status = 'activate'
    }
    const toolStatus = status.charAt(0).toUpperCase() + status.slice(1);
    this.modal.confirm({
      nzTitle: `Are you sure you want to ${status} <b>${name}</b> ?`,
      nzContent: '',
      nzOnOk: () =>
        new Promise((resolve, reject) => {
          // this.userService.statusUpdate({ id, lockable }).subscribe({
          //   next: res => {
          //     resolve(true);
          //     this.cdr.markForCheck();
          //     if (res) {
          //       this.message.success(`${toolStatus} successfully!`, { nzDuration: 1000 });
          //     }
          //     this.getDataList();
          //   },
          //   error: err => {
          //     reject(true);
          //     this.cdr.markForCheck();
          //   },
          // })
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
    // this.userService
    //   .list(params.pageNum, params.pageSize, params.filters)
    //   .pipe(
    //     finalize(() => {
    //       this.tableLoading(false);
    //     })
    //   )
    //   .subscribe((_: any) => {
    //     this.dataList = _.data;
    //     this.dataList.forEach((item: any, i: any) => {
    //       Object.assign(item, { key: (params.pageNum - 1) * 10 + i + 1 });
    //     });
    //     this.tableConfig.total = _?.resultPageInfo?.total;
    //     this.tableConfig.pageIndex = params.pageNum;
    //     this.tableLoading(false);
    //     this.cdr.markForCheck();
    //   });
  }

  private initTable(): void {
    this.tableConfig = {
      headers: [
        {
          title: 'No.',
          tdTemplate: this.numberTpl,
          width: 100,
          show: true
        },
        {
          title: 'Task Name',
          field: 'taskName',
          width: 120
        },
        {
          title: 'Token Name',
          field: 'tokenName',
          width: 120
        },
        {
          title: 'Blockchain',
          field: 'blockchain',
          width: 150
        },
        {
          title: 'Export Frequency',
          field: 'exportFrequency',
          width: 150
        },
        {
          title: 'Created On',
          field: 'createTime',
          notNeedEllipsis: true,
          pipe: 'timeStamp',
          width: 150
        },
        {
          title: 'Last Executed On',
          field: 'executedTime',
          notNeedEllipsis: true,
          pipe: 'timeStamp',
          width: 150
        },
        {
          title: 'Status',
          field: 'status',
          width: 100
        },
        {
          title: 'Actions',
          tdTemplate: this.operationTpl,
          fixed: true,
          fixedDir: 'right',
          showAction: false,
          width: 300
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
