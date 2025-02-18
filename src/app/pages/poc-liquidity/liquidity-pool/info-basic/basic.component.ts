import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { LiquidityPoolService, LiquidityPoolInfo } from '@app/core/services/http/poc-liquidity/liquidity-pool/liquidity-pool.service';

@Component({
  selector: 'app-basic',
  templateUrl: './basic.component.html',
  styleUrls: ['./basic.component.less']
})
export class BasicComponent implements OnInit, OnChanges {
  @Input() id: string = '';
  loading = false;
  poolInfo: LiquidityPoolInfo = {
    liquidityPoolAddress: '',
    token: '',
    walletBalance: '',
    authorizedAmount: '',
    availableAmount: '',
    minBalanceReq: '',
    status: '',
    createdBy: '',
    createdOn: 0,
    transactionHash: '',
    transactionTime: 0,
    tokenPairs: [],
    belowMinimumWallet: false,
    belowMinimumAuthorized: false
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
    console.log('Fetching pool info for ID:', this.id);

    this.liquidityPoolService.getPoolInfo(this.id).subscribe({
      next: (res) => {
        console.log('API Response:', res);
        if (res.code === 0 && res.data) {
          this.poolInfo = {
            liquidityPoolAddress: res.data.liquidityPoolAddress || '',
            token: res.data.token || '',
            walletBalance: res.data.walletBalance || '',
            authorizedAmount: res.data.authorizedAmount || '',
            availableAmount: res.data.availableAmount || '',
            minBalanceReq: res.data.minBalanceReq || '',
            status: res.data.status || '',
            createdBy: res.data.createdBy || '',
            createdOn: res.data.createdOn || 0,
            transactionHash: res.data.transactionHash || '',
            transactionTime: res.data.transactionTime || 0,
            tokenPairs: res.data.tokenPairs || [],
            belowMinimumWallet: res.data.belowMinimumWallet || false,
            belowMinimumAuthorized: res.data.belowMinimumAuthorized || false
          };
          console.log('Processed poolInfo:', this.poolInfo);
        } else {
          this.message.error(res.message || 'Failed to get pool information');
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('API Error:', err);
        this.message.error(err.message || 'Failed to get pool information');
        this.loading = false;
      }
    });
  }
}
