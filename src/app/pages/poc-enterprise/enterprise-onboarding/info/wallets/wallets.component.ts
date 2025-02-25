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

  getStatusText(status: number): string {
    switch (status) {
      case 1:
        return 'Pending Review';
      case 2:
        return 'Review Rejected';
      case 3:
        return 'Review Approved';
      case 4:
        return 'Wallet Opening';
      case 5:
        return 'Active';
      case 6:
        return 'Submit Failed';
      case 7:
        return 'Under Review';
      case 8:
        return 'Frozen';
      default:
        return 'Unknown';
    }
  }

  getStatusColor(status: number): string {
    switch (status) {
      case 1:
        return 'warning';    // 待审核 - 黄色
      case 2:
        return 'error';      // 审核失败 - 红色
      case 3:
        return 'warning';    // 审核通过 - 黄色
      case 4:
        return 'processing'; // 钱包开通中 - 蓝色
      case 5:
        return 'success';    // 开通成功 - 绿色
      case 6:
        return 'error';      // 提交失败 - 红色
      case 7:
        return 'processing'; // 审核中 - 蓝色
      case 8:
        return 'default';    // 冻结 - 灰色
      default:
        return 'default';
    }
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