import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { LoginInOutService } from '@app/core/services/common/login-in-out.service';
import { UserService } from '@app/core/services/http/poc-system/user/user.service';
import { SearchCommonVO } from '@app/core/services/types';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { finalize } from 'rxjs';
interface SearchParam {
  userName: string;
  realName: string;
}

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.less']
})
export class UserComponent implements OnInit {
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumb: [],
    extra: '',
    desc: '',
    footer: ''
  };
  searchParam: Partial<SearchParam> = {
    userName: '',
    realName: ''
  };
  @ViewChild('operationTpl', { static: true })
  operationTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('numberTpl', { static: true })
  numberTpl!: TemplateRef<NzSafeAny>;
  tableConfig!: AntTableConfig;
  dataList: NzSafeAny[] = [];
  tableQueryParams: NzTableQueryParams = { pageIndex: 1, pageSize: 10, sort: [], filter: [] }
  constructor(private userService: UserService, private message: NzMessageService, private cdr: ChangeDetectorRef, private modal: NzModalService, private loginOutService: LoginInOutService) { }
  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: `User Management`,
      breadcrumb: ['System Management', 'User Management', 'List'],
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
    this.userService.list(params.pageNum, params.pageSize, params.filters).pipe(finalize(() => {
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

  onStatusUpdate(userId: string, lockable: any, userName: string): void {
    let status = '';
    if (lockable === 1) {
      status = 'disable'
    } else {
      status = 'enable'
    }
    const toolStatus = status.charAt(0).toUpperCase() + status.slice(1);
    this.modal.confirm({
      nzTitle: `Are you sure you want to ${status} the information of '${userName}' user ?`,
      nzContent: '',
      nzOnOk: () =>
        new Promise((resolve, reject) => {
          this.userService.statusUpdate({ userId, lockable }).subscribe({
            next: res => {
              resolve(true);
              this.cdr.markForCheck();
              if (res) {
                this.message.success(`${toolStatus} the user successfully!`, { nzDuration: 1000 });
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

  onResetPassword(userId: string, userName: string, realName: string) {
    const clientName = sessionStorage.getItem('clientName');
    this.modal.confirm({
      nzTitle: 'Are you sure you want to reset password ?',
      nzContent: '',
      nzOnOk: () =>
        new Promise((resolve, reject) => {
          this.userService.resetPassword({ userId }).subscribe({
            next: res => {
              resolve(true);
              this.message.success(`The password of '${userName}' has been reset to '${res.pwd}'`, { nzDuration: 1000 }).onClose!.subscribe(() => {
                if (realName === clientName) {
                  this.loginOutService.loginOut().then();
                }
                this.getDataList();
              });
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

  onDelete(userId: string) {
    this.modal.confirm({
      nzTitle: 'Are you sure you want to delete this user ?',
      nzContent: '',
      nzOnOk: () =>
        new Promise((resolve, reject) => {
          this.userService.statusUpdate({ userId, lockable: 3 }).subscribe({
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
          width: 100,
          show: true
        },
        {
          title: 'User Name',
          field: 'userName',
          width: 180
        },
        {
          title: 'Real Name',
          field: 'realName',
          width: 180
        },
        {
          title: 'Telephone Number',
          field: 'telephone',
          width: 180
        },
        {
          title: 'Email',
          field: 'email',
          width: 180
        },
        {
          title: 'Status',
          field: 'lockable',
          pipe: 'lockable',
          width: 100
        },
        {
          title: 'Actions',
          tdTemplate: this.operationTpl,
          fixed: true,
          fixedDir: 'right',
          showAction: false,
          width: 300

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
