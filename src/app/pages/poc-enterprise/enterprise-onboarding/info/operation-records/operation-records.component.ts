import { Component, Input, OnInit } from '@angular/core';
import { EnterpriseOnboardingService } from '@app/core/services/http/poc-enterprise/enterprise-onboarding/enterprise-onboarding.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-operation-records',
  templateUrl: './operation-records.component.html',
  styleUrls: ['./operation-records.component.less']
})
export class OperationRecordsComponent implements OnInit {
  @Input() enterpriseId: number = 0;
  loading = false;
  total = 0;
  pageSize = 10;
  pageIndex = 1;
  operationType = 0;
  recordList: any[] = [];

  constructor(
    private enterpriseService: EnterpriseOnboardingService,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    this.loadRecordList();
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    this.pageIndex = params.pageIndex;
    this.pageSize = params.pageSize;
    this.loadRecordList();
  }

  onOperationTypeChange(): void {
    this.pageIndex = 1;
    this.loadRecordList();
  }

  resetFilter(): void {
    this.operationType = 0;
    this.pageIndex = 1;
    this.loadRecordList();
  }

  loadRecordList(): void {
    this.loading = true;
    const params = {
      data: {
        enterpriseId: this.enterpriseId,
        operationType: this.operationType
      },
      page: {
        pageNum: this.pageIndex,
        pageSize: this.pageSize
      }
    };

    this.enterpriseService.getOperationRecords(params).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.code === 0) {
          this.recordList = res.data.rows;
          this.total = res.data.page.total;
        } else {
          this.message.error(res.message || 'Failed to get operation records');
        }
      },
      error: (err) => {
        this.loading = false;
        this.message.error(err.message || 'Failed to get operation records');
      }
    });
  }

  getOperationTypeText(type: number): string {
    switch (type) {
      case 1:
        return 'Opened';
      case 2:
        return 'Edited';
      case 3:
        return 'Started';
      case 4:
        return 'Disabled';
      default:
        return 'Unknown';
    }
  }

  getStatusColor(status: number): string {
    switch (status) {
      case 1:
        return 'success';  // 保存 - 绿色
      case 3:
        return 'default';  // 撤回 - 灰色
      case 5:
        return 'warning';  // 待审核 - 黄色
      case 10:
        return 'processing';  // 审核中 - 蓝色
      case 15:
        return 'error';  // 审核拒绝 - 红色
      case 20:
        return 'warning';  // 审核通过/待上链 - 黄色
      case 30:
        return 'processing';  // 上链中/轮询查询交易回执 - 蓝色
      case 35:
        return 'success';  // 上链成功 - 绿色
      case 40:
        return 'error';  // 上链失败 - 红色
      case 45:
        return 'default';  // 删除 - 灰色
      default:
        return 'default';
    }
  }

  getStatusText(status: number): string {
    switch (status) {
      case 1:
        return 'Saved';
      case 3:
        return 'Withdrawn';
      case 5:
        return 'Pending Review';
      case 10:
        return 'Under Review';
      case 15:
        return 'Review Rejected';
      case 20:
        return 'Review Approved/Pending Chain';
      case 30:
        return 'Chain Processing';
      case 35:
        return 'Chain Success';
      case 40:
        return 'Chain Failed';
      case 45:
        return 'Deleted';
      default:
        return 'Unknown';
    }
  }
} 