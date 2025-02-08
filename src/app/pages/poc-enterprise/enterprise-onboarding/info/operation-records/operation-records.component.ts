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
        return 'Onboard';
      case 2:
        return 'Edit';
      case 3:
        return 'Enable';
      case 4:
        return 'Deactivate';
      default:
        return 'Unknown';
    }
  }

  getStatusColor(status: number): string {
    switch (status) {
      case 35:
        return 'success';
      case 30:
        return 'processing';
      case 40:
      case 15:
        return 'error';
      default:
        return 'default';
    }
  }

  getStatusText(status: number): string {
    switch (status) {
      case 35:
        return 'Success';
      case 30:
        return 'Processing';
      case 40:
        return 'Failed';
      case 15:
        return 'Rejected';
      default:
        return 'Unknown';
    }
  }
} 