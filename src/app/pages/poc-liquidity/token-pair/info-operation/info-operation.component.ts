import { Component, OnInit, Input } from '@angular/core';
import { TokenPairService, OperationRecord } from '@app/core/services/http/poc-liquidity/token-pair/token-pair.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-info-operation',
  templateUrl: './info-operation.component.html',
  styleUrl: './info-operation.component.less'
})
export class InfoOperationComponent implements OnInit {
  @Input() rateId: number = 0;
  loading = false;
  operationRecords: OperationRecord[] = [];
  total = 0;
  pageSize = 10;
  pageIndex = 1;
  operationType = 'All';

  constructor(
    private tokenPairService: TokenPairService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.getOperationRecords();
  }

  getOperationRecords(): void {
    this.loading = true;
    const params = {
      data: {
        rateId: this.rateId,
        operationType: this.operationType === 'All' ? '' : this.operationType
      },
      page: {
        pageNum: this.pageIndex,
        pageSize: this.pageSize
      }
    };

    this.tokenPairService.getOperationRecords(params).subscribe({
      next: (res) => {
        if (res.code === 0) {
          this.operationRecords = res.data.rows;
          this.total = res.data.page.total;
        } else {
          this.message.error(res.message || 'Failed to get operation records');
        }
        this.loading = false;
      },
      error: (err) => {
        this.message.error(err.message || 'Failed to get operation records');
        this.loading = false;
      }
    });
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    this.pageIndex = params.pageIndex;
    this.pageSize = params.pageSize;
    this.getOperationRecords();
  }

  resetSearch(): void {
    this.operationType = 'All';
    this.pageIndex = 1;
    this.getOperationRecords();
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'success':
        return 'success';
      case 'processing':
        return 'processing';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  }
}
