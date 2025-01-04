/*
 * @Author: chenyuting
 * @Date: 2024-12-10 17:23:08
 * @LastEditors: chenyuting
 * @LastEditTime: 2024-12-19 17:14:34
 * @Description:
 */
/*
 * @Author: chenyuting
 * @Date: 2024-12-10 11:08:21
 * @LastEditors: chenyuting
 * @LastEditTime: 2024-12-16 14:23:07
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
import {
  FormBuilder,
  FormGroup,
  UntypedFormControl,
  Validators
} from '@angular/forms';
import { CommonService } from '@app/core/services/http/common/common.service';
import { StatementsService } from '@app/core/services/http/poc-financial/statements/statements.service';
import { SearchCommonVO } from '@app/core/services/types';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { getCurrentTimeZone } from '@app/utils/tools';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { finalize } from 'rxjs';
interface SearchParam {
  tokenId: string;
  blockchainId: string;
  exportStrategy: string | number;
  status: string | number;
  createTime: any;
  lastExecutedTime: any;
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
  @ViewChild('statusTpl', { static: true })
  statusTpl!: TemplateRef<NzSafeAny>;
  tableConfig!: AntTableConfig;
  dataList: NzSafeAny[] = [];
  tokenList: any = [];
  blockchainList: any = [];
  visible = false;
  validateForm!: FormGroup;
  isNewLoading: boolean = false;
  frequencyType: string = '';
  searchParam: Partial<SearchParam> = {
    tokenId: '',
    blockchainId: '',
    exportStrategy: '',
    status: '',
    createTime: [],
    lastExecutedTime: []
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
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private modal: NzModalService,
    private message: NzMessageService,
    private statementsService: StatementsService,
    private commonService: CommonService
  ) {}
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
    this.getTokenList();
    this.getBlockchainList();
    this.validateForm = this.fb.group({
      taskName: [null, [Validators.required, this.taskNameValidator]],
      tokenId: [null, [Validators.required]],
      txTypes: [[], [Validators.required]],
      exportStrategy: [null, [Validators.required]]
    });
  }

  taskNameValidator = (
    control: UntypedFormControl
  ): { [s: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (!/^[A-Za-z0-9]{0,50}$/.test(control.value)) {
      return { regular: true, error: true };
    }
    return {};
  };
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
    this.searchParam.lastExecutedTime = '';
    this.searchParam.tokenId = '';
    this.searchParam.blockchainId = '';
    this.searchParam.exportStrategy = '';
    this.searchParam.status = '';
    this.getDataList(this.tableQueryParams);
  }

  changePageSize(e: number): void {
    this.tableConfig.pageSize = e;
  }

  open(): void {
    this.visible = true;
  }

  changeFrequency(value: any) {
    this.frequencyType = value;
  }

  onBack() {
    this.visible = false;
    this.validateForm.reset();
  }

  getTokenList() {
    this.commonService.tokenList().subscribe((res) => {
      this.tokenList = res;
      console.log(res);

      this.cdr.markForCheck();
      return;
    });
  }

  getBlockchainList() {
    this.commonService.blockchainList().subscribe((res) => {
      this.blockchainList = res;
      console.log(res, 'res1');

      this.cdr.markForCheck();
      return;
    });
  }
  onSubmit() {
    this.isNewLoading = true;
    const params = this.validateForm.value;
    params.timeZone = getCurrentTimeZone();
    this.statementsService
      .createTask(params)
      .pipe(finalize(() => (this.isNewLoading = false)))
      .subscribe({
        next: (res) => {
          if (res) {
            this.message
              .success('Add successfully!', { nzDuration: 1000 })
              .onClose.subscribe(() => {
                this.validateForm.reset();
                this.visible = false;
                this.getDataList(this.tableQueryParams);
              });
          }
          this.isNewLoading = false;
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.isNewLoading = false;
          this.cdr.markForCheck();
        }
      });
  }
  onDelete(exportRuleId: string, taskName: string) {
    this.modal.confirm({
      nzTitle: `Are you sure you want to delete <b>${taskName}</b> ?`,
      nzContent: '',
      nzOnOk: () =>
        new Promise((resolve, reject) => {
          this.statementsService
            .statusUpdate({ exportRuleId, state: 35 })
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

  onStatusUpdate(exportRuleId: any, state: number, taskName: string) {
    let statusValue = '';
    if (state === 30) {
      statusValue = 'deactivate';
    } else {
      statusValue = 'activate';
    }
    const toolStatus =
      statusValue.charAt(0).toUpperCase() + statusValue.slice(1);
    this.modal.confirm({
      nzTitle: `Are you sure you want to ${statusValue} <b>${taskName}</b> ?`,
      nzContent: '',
      nzOnOk: () =>
        new Promise((resolve, reject) => {
          this.statementsService
            .statusUpdate({ exportRuleId, state })
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
  getDataList(e?: NzTableQueryParams): void {
    this.tableConfig.loading = true;
    const params: SearchCommonVO<any> = {
      pageSize: this.tableConfig.pageSize!,
      pageNum: e?.pageIndex || this.tableConfig.pageIndex!,
      filters: this.searchParam
    };
    this.statementsService
      .fetchList(params.pageNum, params.pageSize, params.filters)
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
          width: 100,
          show: true
        },
        {
          title: 'Task Name',
          field: 'taskName',
          notNeedEllipsis: true,
          width: 120
        },
        {
          title: 'Token Name',
          field: 'tokenName',
          notNeedEllipsis: true,
          width: 120
        },
        {
          title: 'Bloackchain',
          field: 'blockchainName',
          notNeedEllipsis: true,
          width: 120
        },
        {
          title: 'Export Frequency',
          field: 'exportStrategy',
          pipe: 'exportStrategy',
          notNeedEllipsis: true,
          width: 120
        },
        {
          title: 'Created on',
          field: 'createTime',
          notNeedEllipsis: true,
          pipe: 'timeStamp',
          width: 150
        },
        {
          title: 'Last Executed On',
          field: 'lastExecutedTime',
          notNeedEllipsis: true,
          pipe: 'timeStamp',
          width: 150
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
          width: 200
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
