import { Component, Input, OnInit } from '@angular/core';
import { EnterpriseOnboardingService } from '@app/core/services/http/poc-enterprise/enterprise-onboarding/enterprise-onboarding.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-wallets',
  templateUrl: './wallets.component.html',
  styleUrls: ['./wallets.component.less']
})
export class WalletsComponent implements OnInit {
  @Input() enterpriseId: number = 0;
  loading = false;
  total = 0;
  pageSize = 10;
  pageIndex = 1;
  walletList: any[] = [];

  constructor(
    private enterpriseService: EnterpriseOnboardingService,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    this.loadWalletList();
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    this.pageIndex = params.pageIndex;
    this.pageSize = params.pageSize;
    this.loadWalletList();
  }

  loadWalletList(): void {
    this.loading = true;
    const params = {
      data: {
        enterpriseId: this.enterpriseId
      },
      page: {
        pageNum: this.pageIndex,
        pageSize: this.pageSize
      }
    };

    this.enterpriseService.getUserWalletList(params).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.code === 0) {
          this.walletList = res.data.rows;
          this.total = res.data.page.total;
        } else {
          this.message.error(res.message || 'Failed to get wallet list');
        }
      },
      error: (err) => {
        this.loading = false;
        this.message.error(err.message || 'Failed to get wallet list');
      }
    });
  }
} 