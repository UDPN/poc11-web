import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { LiquidityPoolService, PoolInfoResponse } from '@app/core/services/http/poc-liquidity/liquidity-pool/liquidity-pool.service';

interface DisplayPoolInfo {
  liquidityPollAddress: string;
  token: string;
  walletBalance: string;
  authorizedAmount: string;
  minBalanceReq: string;
  status: number;
  createdBy: string;
  createdTime: number;
  txHash: string;
  txTime: number;
  tokenPairs: string[];
}

@Component({
  selector: 'app-basic',
  templateUrl: './basic.component.html',
  styleUrls: ['./basic.component.less']
})
export class BasicComponent implements OnInit, OnChanges {
  @Input() id: string = '';
  loading = false;
  poolInfo: DisplayPoolInfo = {
    liquidityPollAddress: '',
    token: '',
    walletBalance: '',
    authorizedAmount: '',
    minBalanceReq: '',
    status: 0,
    createdBy: '',
    createdTime: 0,
    txHash: '',
    txTime: 0,
    tokenPairs: []
  };

  constructor(
    private message: NzMessageService,
    private liquidityPoolService: LiquidityPoolService
  ) {}

  ngOnInit() {
    if (this.id) {
      this.getPoolInfo();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['id'] && !changes['id'].firstChange && changes['id'].currentValue) {
      this.getPoolInfo();
    }
  }

  getPoolInfo(): void {
    this.loading = true;

    this.liquidityPoolService.getPoolInfo(this.id).subscribe({
      next: (res: PoolInfoResponse) => {
        if (res.code === 0 && res.data) {
          const { data } = res;
          this.poolInfo = {
            liquidityPollAddress: data.liquidityPollAddress,
            token: data.token,
            walletBalance: `${Number(data.walletBalance).toLocaleString()} ${data.symbol}`,
            authorizedAmount: `${Number(data.authorizedAmount).toLocaleString()} ${data.symbol}`,
            minBalanceReq: `${Number(data.minBalance).toLocaleString()} ${data.symbol}`,
            status: data.status,
            createdBy: data.createdBy,
            createdTime: data.createdTime,
            txHash: data.txHash,
            txTime: data.txTime,
            tokenPairs: data.tokenPairInformationList.map(pair => `${pair.fromToken}/${pair.toToken}`)
          };
        } 
        this.loading = false;
      },
      error: (err) => {
        console.error('API Error:', err);
        this.loading = false;
      }
    });
  }

  getStatusColor(status: number): string {
    switch (status) {
      case 1:
        return 'success';
      case 0:
        return 'processing';
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
      case 1:
        return 'Active';
      case 0:
        return 'In Progress';
      case 2:
        return 'Failed';
      case 3:
        return 'Disabled';
      default:
        return 'Unknown';
    }
  }
}
