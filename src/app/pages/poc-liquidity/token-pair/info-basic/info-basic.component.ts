import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TokenPairService, TokenPairDetailResponse } from '@app/core/services/http/poc-liquidity/token-pair/token-pair.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

interface DisplayTokenPairInfo {
  tokenPair: string;
  fxType: string;
  status: number;
  fxRate: string;
  fxRateUpdatedOn: number;
  createdBy: string;
  createdOn: number;
}

@Component({
  selector: 'app-info-basic',
  templateUrl: './info-basic.component.html',
  styleUrl: './info-basic.component.less'
})
export class InfoBasicComponent implements OnInit, OnChanges {
  @Input() rateId: number = 0;

  loading = false;
  historyLoading = false;
  tokenPairInfo: DisplayTokenPairInfo = {
    tokenPair: '',
    fxType: 'Local FX',
    status: 0,
    fxRate: '',
    fxRateUpdatedOn: 0,
    createdBy: '',
    createdOn: 0
  };

  // FX Rate History
  dateRange: Date[] = [];
  historyList: any[] = [];
  pageSize = 10;
  pageIndex = 1;
  total = 0;

  constructor(
    private tokenPairService: TokenPairService,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    if (this.rateId) {
      this.getTokenPairDetail();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['rateId'] && !changes['rateId'].firstChange && this.rateId) {
      this.getTokenPairDetail();
    }
  }

  getTokenPairDetail(): void {
    this.loading = true;
    this.tokenPairService.getTokenPairDetail(this.rateId).subscribe({
      next: (res) => {
        if (res.code === 0) {
          const data = res.data;
          this.tokenPairInfo = {
            tokenPair: `${data.fromCurrency}/${data.toCurrency}`,
            fxType: 'Local FX',
            status: data.state,
            fxRate: `1 ${data.fromCurrency} = ${data.exchangeRate} ${data.toCurrency}`,
            fxRateUpdatedOn: data.updateTime,
            createdBy: data.createUser,
            createdOn: data.createTime
          };
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
      endDate: this.dateRange[1],
      rateId: this.rateId,
      pageSize: this.pageSize,
      pageIndex: this.pageIndex
    };

    this.tokenPairService.getFxRateHistory(params).subscribe({
      next: (res) => {
        if (res.code === 0) {
          this.historyList = res.data.rows.map(item => ({
            tokenPair: `${item.fromCurrency}/${item.toCurrency}`,
            fxRate: `1 ${item.fromCurrency} = ${item.exchangeRate} ${item.toCurrency}`,
            date: item.createTime
          }));
          this.total = res.data.page.total;
          this.pageIndex = res.data.page.pageNum;
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
