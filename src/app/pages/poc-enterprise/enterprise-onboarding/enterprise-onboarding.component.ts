/*
 * @Author: chenyuting
 * @Date: 2025-01-15 13:34:21
 * @LastEditors: chenyuting
 * @LastEditTime: 2025-01-20 10:40:24
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
import { SearchCommonVO } from '@app/core/services/types';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { finalize } from 'rxjs';
import { EnterpriseOnboardingService } from '@app/core/services/http/poc-enterprise/enterprise-onboarding/enterprise-onboarding.service';

interface SearchParam {
  enterpriseName: any;
  enterpriseCode: string;
  contactName: string | number;
  email: string;
  creationTime: any;
  status: string;
}

@Component({
  selector: 'app-enterprise-onboarding',
  templateUrl: './enterprise-onboarding.component.html',
  styleUrl: './enterprise-onboarding.component.less'
})
export class EnterpriseOnboardingComponent implements OnInit, AfterViewInit {
  @ViewChild('headerContent', { static: false })
  headerContent!: TemplateRef<NzSafeAny>;
  @ViewChild('headerExtra', { static: false })
  headerExtra!: TemplateRef<NzSafeAny>;
  @ViewChild('numberTpl', { static: true })
  numberTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('statusTpl', { static: true })
  statusTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('operationTpl', { static: true })
  operationTpl!: TemplateRef<NzSafeAny>;
  dataList: NzSafeAny[] = [{}];
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumb: [],
    extra: '',
    desc: '',
    footer: ''
  };
  searchParam: Partial<SearchParam> = {
    enterpriseName: '',
    enterpriseCode: '',
    contactName: '',
    email: '',
    status: '',
    creationTime: []
  };
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
    private message: NzMessageService,
    private enterpriseOnboardingService: EnterpriseOnboardingService
  ) {}

  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: ``,
      breadcrumb: ['Enterprise Management', 'Enterprise Onboarding'],
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
      enterpriseCode: '',
      contactName: '',
      email: '',
      status: '',
      creationTime: []
    };
    this.getDataList(this.tableQueryParams);
  }

  changePageSize(e: number): void {
    this.tableConfig.pageSize = e;
  }

  updateStatus(state: number, enterpriseName: string) {
    let statusValue = '';
    // if (state === 30) {
    //   statusValue = 'deactivate';
    // } else {
    //   statusValue = 'activate';
    // }
    const toolStatus =
      statusValue.charAt(0).toUpperCase() + statusValue.slice(1);
    this.modal.confirm({
      nzTitle: `Are you sure you want to ${statusValue} <b>${enterpriseName}</b> ?`,
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
    this.tableConfig.loading = true;
    const params: SearchCommonVO<any> = {
      pageSize: this.tableConfig.pageSize!,
      pageNum: e?.pageIndex || this.tableConfig.pageIndex!,
      filters: {
        enterpriseCode: this.searchParam.enterpriseCode,
        enterpriseName: this.searchParam.enterpriseName,
        contactName: this.searchParam.contactName,
        contactEmail: this.searchParam.email,
        status: this.searchParam.status,
        createdOn: this.searchParam.creationTime
      }
    };

    this.enterpriseOnboardingService
      .fetchList(params.pageNum, params.pageSize, params.filters)
      .pipe(
        finalize(() => {
          this.tableLoading(false);
        })
      )
      .subscribe({
        next: (res: any) => {
          this.dataList = res.data?.rows || [];
          this.dataList.forEach((item: any, i: number) => {
            Object.assign(item, { key: (params.pageNum - 1) * 10 + i + 1 });
          });
          this.tableConfig.total = res.data?.page?.total || 0;
          this.tableConfig.pageIndex = params.pageNum;
          this.tableLoading(false);
          this.cdr.markForCheck();
        },
        error: () => {
          this.message.error('Failed to fetch enterprise list');
          this.tableLoading(false);
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
          width: 50
        },
        {
          title: 'Enterprise Code',
          field: 'enterpriseCode',
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
          title: 'Contact Name',
          field: 'contactName',
          notNeedEllipsis: true,
          width: 100
        },
        {
          title: 'Email',
          field: 'email',
          notNeedEllipsis: true,
          width: 120
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
          width: 180
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
