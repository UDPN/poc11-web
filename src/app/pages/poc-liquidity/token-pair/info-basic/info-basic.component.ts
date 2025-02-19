import { Component, OnInit } from '@angular/core';
import { TokenPairService, TokenPairDetail, FxRateHistory } from '@app/core/services/http/poc-liquidity/token-pair/token-pair.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-info-basic',
  templateUrl: './info-basic.component.html',
  styleUrl: './info-basic.component.less'
})
export class InfoBasicComponent implements OnInit {
  loading = false;
  historyLoading = false;
  tokenPairInfo: TokenPairDetail = {
    tokenPair: '',
    fxType: '',
    status: 0,
    fxRate: '',
    fxRateUpdatedOn: 0,
    createdBy: '',
    createdOn: 0
  };

  // FX Rate History
  dateRange: Date[] = [];
  historyList: FxRateHistory[] = [];
  pageSize = 10;
  pageIndex = 1;
  total = 0;

  constructor(
    private tokenPairService: TokenPairService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.getTokenPairDetail();
    this.getFxRateHistory();
  }

  getTokenPairDetail(): void {
    this.loading = true;
    this.tokenPairService.getTokenPairDetail().subscribe({
      next: (res) => {
        if (res.code === 0) {
          this.tokenPairInfo = res.data;
        } else {
          this.message.error(res.message || 'Failed to get token pair details');
        }
        this.loading = false;
      },
      error: (err) => {
        this.message.error(err.message || 'Failed to get token pair details');
        this.loading = false;
      }
    });
  }

  getFxRateHistory(): void {
    this.historyLoading = true;
    const params = {
      startDate: this.dateRange[0],
      endDate: this.dateRange[1]
    };

    this.tokenPairService.getFxRateHistory(params).subscribe({
      next: (res) => {
        if (res.code === 0) {
          this.historyList = res.data.rows;
          this.total = res.data.page.total;
        } else {
          this.message.error(res.message || 'Failed to get FX rate history');
        }
        this.historyLoading = false;
      },
      error: (err) => {
        this.message.error(err.message || 'Failed to get FX rate history');
        this.historyLoading = false;
      }
    });
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    this.pageIndex = params.pageIndex;
    this.pageSize = params.pageSize;
    this.getFxRateHistory();
  }

  resetSearch(): void {
    this.dateRange = [];
    this.getFxRateHistory();
  }

  getStatusColor(status: number): string {
    switch (status) {
      case 1:
        return 'success';
      case 0:
        return 'processing';
      case 2:
        return 'error';
      default:
        return 'default';
    }
  }

  getStatusText(status: number): string {
    switch (status) {
      case 1:
        return 'Active';
      case 0:
        return 'Processing';
      case 2:
        return 'Inactive';
      default:
        return 'Unknown';
    }
  }
}
