import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { RoleService } from '@app/core/services/http/poc-system/role/role.service';
import { SearchCommonVO } from '@app/core/services/types';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { finalize } from 'rxjs';
interface SearchParam {
  roleName: string;
}
@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.less']
})
export class RoleComponent implements OnInit {
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumb: [],
    extra: '',
    desc: '',
    footer: ''
  };
  searchParam: Partial<SearchParam> = {
    roleName: ''
  };
  @ViewChild('operationTpl', { static: true })
  operationTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('numberTpl', { static: true })
  numberTpl!: TemplateRef<NzSafeAny>;
  tableConfig!: AntTableConfig;
  dataList: NzSafeAny[] = [];
  tableQueryParams: NzTableQueryParams = { pageIndex: 1, pageSize: 10, sort: [], filter: [] }
  constructor(private roleService: RoleService, private message: NzMessageService, private cdr: ChangeDetectorRef, private modal: NzModalService) { }
  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: `Role Management`,
      breadcrumb: ['System Management', 'Role Management', 'List'],
      extra: '',
      desc: '',
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

  resetForm() {
    this.searchParam = {};
    this.getDataList(this.tableQueryParams);
  }

  changePageSize(e: number): void {
    this.tableConfig.pageSize = e;
  }

  getDataList(e?: NzTableQueryParams): void {
    this.tableConfig.loading = true;
    const params: SearchCommonVO<any> = {
      pageSize: this.tableConfig.pageSize!,
      pageNum: e?.pageIndex || this.tableConfig.pageIndex!,
      filters: this.searchParam
    };
    this.roleService.list(params.pageNum, params.pageSize, params.filters).pipe(finalize(() => {
      this.tableLoading(false);
    })).subscribe((_: any) => {
      this.dataList = _.data;
      this.dataList.forEach((item: any, i: any) => {
        Object.assign(item, { key: (params.pageNum - 1) * 10 + i + 1 })
      })
      this.tableConfig.total = _?.resultPageInfo?.total;
      this.tableConfig.pageIndex = params.pageNum;
      this.tableLoading(false);
      this.cdr.markForCheck();
    });
  }

  onStatusUpdate(roleCode: string, lockable: any, roleName: string): void {
    let status = '';
    if (lockable === 1) {
      status = 'disable'
    } else if (lockable === 2) {
      status = 'enable'
    }
    const toolStatus = status.charAt(0).toUpperCase() + status.slice(1);
    this.modal.confirm({
      nzTitle: `Are you sure you want to ${status} the information of '${roleName}' role ?`,
      nzContent: '',
      nzOnOk: () =>
        new Promise((resolve, reject) => {
          this.roleService.statusUpdate({ roleCode, lockable }).subscribe({
            next: res => {
              resolve(true);
              this.cdr.markForCheck();
              if (res) {
                this.message.success(`${toolStatus} the role successfully!`);
              }
              this.getDataList();
            },
            error: err => {
              reject(true);
              this.cdr.markForCheck();
            },
          })
        }).catch(() => console.log('Oops errors!'))
    });
  }

  onDelete(roleCode: string) {
    this.modal.confirm({
      nzTitle: 'Are you sure you want to delete this role ?',
      nzContent: '',
      nzOnOk: () =>
        new Promise((resolve, reject) => {
          this.roleService.statusUpdate({ roleCode, lockable: 3 }).subscribe({
            next: res => {
              resolve(true);
              if (res) {
                this.message.success(`Delete successfully`).onClose!.subscribe(() => {
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

  private initTable(): void {
    this.tableConfig = {
      headers: [
        {
          title: 'No.',
          tdTemplate: this.numberTpl,
          width: 150,
          show: true
        },
        {
          title: 'Role Name',
          field: 'roleName',
          width: 200
        },
        {
          title: 'Description',
          field: 'description',
          width: 320
        },
        {
          title: 'Status',
          field: 'lockable',
          pipe: 'lockable',
          width: 200
        },
        {
          title: 'Actions',
          tdTemplate: this.operationTpl,
          fixed: true,
          fixedDir: 'right',
          showAction: false,
          width: 250

        },
      ],
      total: 0,
      showCheckbox: false,
      loading: false,
      pageSize: 10,
      pageIndex: 1,
    };
  }

}
