import { Component, OnInit, Input, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { TokenPairService, TokenPairDetailResponse } from '@app/core/services/http/poc-liquidity/token-pair/token-pair.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';

interface DisplayTokenPairInfo {
  tokenPair: string;
  fxType: number | string;
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
export class InfoBasicComponent implements OnInit {
  @Input() rateId: number = 0;

  loading = false;
  historyLoading = false;
  tokenPairInfo: DisplayTokenPairInfo = {
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
  historyList: any[] = [];
  tableConfig!: AntTableConfig;

  constructor(
    private tokenPairService: TokenPairService,
    private message: NzMessageService,
    private cdr: ChangeDetectorRef,
  ) {

  }



  ngOnInit() {
    this.initTableConfig();
    this.getTokenPairDetail();
    this.getFxRateHistory();
  }


  initTableConfig() {
    this.tableConfig = {
      headers: [
        {
          title: 'Token Pair',
          field: 'tokenPair',
          width: 160
        },
        {
          title: 'FX Rate',
          field: 'fxRate',
          width: 160
        },
        {
          title: 'Date',
          field: 'date',
          width: 180,
          pipe: 'timeStamp'
        }
      ],
      total: 0,
      pageSize: 10,
      pageIndex: 1,
      loading: false,
      xScroll: 1300
    };
  }

  onPageSizeChange(pageSize: number): void {
    this.tableConfig.pageSize = pageSize;
    this.getFxRateHistory();
  }



  getTokenPairDetail(): void {
    this.loading = true;
    this.tokenPairService.getTokenPairDetail(this.rateId).subscribe({
      next: (res) => {
        if (res.code === 0) {
          const data = res.data;
          this.tokenPairInfo = {
            tokenPair: `${data.fromCurrency}/${data.toCurrency}`,
            fxType: data.fxType === 1 ? 'Local FX' : 'Network FX',
            status: data.state,
            fxRate: `1 ${data.fromCurrency} = ${data.exchangeRate} ${data.toCurrency}`,
            fxRateUpdatedOn: data.updateTime,
            createdBy: data.createUser,
            createdOn: data.createTime
          };
          this.cdr.detectChanges();
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

  getFxRateHistory(e?: NzTableQueryParams | number): void {
    if (typeof e === 'number') {
      this.tableConfig.pageIndex = e;
    } else if (e) {
      this.tableConfig.pageIndex = e.pageIndex;
    }

    this.tableConfig.loading = true;
    const params = {
      startDate: this.dateRange[0],
      endDate: this.dateRange[1],
      rateId: this.rateId,
      pageSize: this.tableConfig.pageSize,
      pageIndex: this.tableConfig.pageIndex
    };

    this.tokenPairService.getFxRateHistory(params).subscribe({
      next: (res) => {
        this.historyLoading = false;
        this.cdr.detectChanges();
        if (res.code === 0) {
          this.historyList = res.data.rows.map(item => ({
            tokenPair: `${item.fromCurrency}/${item.toCurrency}`,
            fxRate: `1 ${item.fromCurrency} = ${item.exchangeRate} ${item.toCurrency}`,
            date: item.createTime
          }));
          this.tableConfig.total = res.data.page.total;

        } else {
          this.historyList = [];
          this.tableConfig.total = 0;
        }
        this.tableConfig.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.tableConfig.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  resetSearch(): void {
    this.dateRange = [];
    this.tableConfig.pageIndex = 1;
    this.getFxRateHistory();
  }

  getStatusColor(status: number): string {
    switch (status) {
      case 0:
        return 'processing';
      case 1:
        return 'success';
      case 2:
        return 'error';
      case 3:
        return 'default';
      default:
        return 'default';
    }
  }

  getStatusText(status: number): string {
    switch (status) {
      case 0:
        return 'Processing';
      case 1:
        return 'Active';
      case 2:
        return 'Failed';
      case 3:
        return 'Inactive';
      default:
        return 'Unknown';
    }
  }
}
