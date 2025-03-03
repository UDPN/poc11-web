import { Component, OnInit, Input } from '@angular/core';
import { TokenPairService } from '@app/core/services/http/poc-liquidity/token-pair/token-pair.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

interface OperationRecord {
  createTime: number;
  createUser: string;
  exchangeRate: number;
  fromCurrency: string;
  operationType: number;
  rateId: number;
  rateRecordId: number;
  remarks: string;
  state: number;
  toCurrency: string;
  txHash: string;
  txTime: number;
}

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
  operationType = 0;

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
        operationType: this.operationType
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
        } 
        this.loading = false;
      },
      error: (err) => {
        console.error(err.message || 'Failed to get operation records');
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
    this.operationType = 0;
    this.pageIndex = 1;
    this.getOperationRecords();
  }

  getStatusColor(state: number): string {
    switch (state) {
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

  getStatusText(state: number): string {
    switch (state) {
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

  getOperationTypeText(type: number): string {
    switch (type) {
      case 1:
        return 'Add';
      case 3:
        return 'Activate';
      case 4:
        return 'Deactivate';
      default:
        return 'Unknown';
    }
  }
}
