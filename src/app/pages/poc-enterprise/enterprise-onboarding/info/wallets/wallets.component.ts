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
        return 'Saved';
      case 3:
        return 'Withdrawn';
      case 5:
        return 'Pending Review';
      case 10:
        return 'Under Review';
      case 15:
        return 'Review Rejected';
      case 20:
        return 'Review Approved/Pending Chain';
      case 30:
        return 'Chain Processing';
      case 35:
        return 'Chain Success';
      case 40:
        return 'Chain Failed';
      case 45:
        return 'Deleted';
      default:
        return 'Unknown';
    }
  }

  getStatusColor(status: number): string {
    switch (status) {
      case 1:
        return 'default';  // 灰色
      case 3:
        return 'default';  // 灰色
      case 5:
        return 'warning';  // 黄色
      case 10:
        return 'processing';  // 蓝色
      case 15:
        return 'error';  // 红色
      case 20:
        return 'warning';  // 黄色
      case 30:
        return 'processing';  // 蓝色
      case 35:
        return 'success';  // 绿色
      case 40:
        return 'error';  // 红色
      case 45:
        return 'default';  // 灰色
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