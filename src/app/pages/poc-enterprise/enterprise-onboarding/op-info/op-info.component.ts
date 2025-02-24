import { AfterViewInit, Component, OnInit } from '@angular/core';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { ActivatedRoute } from '@angular/router';
import { EnterpriseOnboardingService } from '@app/core/services/http/poc-enterprise/enterprise-onboarding/enterprise-onboarding.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-op-info',
  templateUrl: './op-info.component.html',
  styleUrl: './op-info.component.less'
})
export class OpInfoComponent implements OnInit, AfterViewInit {
  enterpriseId: number = 0;
  status: number = 0;
  detailInfo: any = {};
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private enterpriseService: EnterpriseOnboardingService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.enterpriseId = Number(params['enterpriseId']);
      this.status = Number(params['status']);
      this.getEnterpriseDetail();
    });
  }

  getEnterpriseDetail(): void {
    this.loading = true;
    this.enterpriseService.getEnterpriseDetail({
      enterpriseId: this.enterpriseId,
      status: this.status
    }).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.code === 0) {
          this.detailInfo = res.data;
        } else {
          this.message.error(res.message || 'Failed to get enterprise detail');
        }
      },
      error: (err) => {
        this.loading = false;
        this.message.error(err.message || 'Failed to get enterprise detail');
      }
    });
  }

  getStatusText(status: number): string {
    switch (status) {
      case 30:
        return 'Pending Approval';
      case 35:
        return 'Approved';
      case 15:
        return 'Rejected';
      default:
        return 'Unknown';
    }
  }

  getStatusTagColor(status: number): string {
    switch (status) {
      case 30:
        return 'warning';
      case 35:
        return 'success';
      case 15:
        return 'error';
      default:
        return 'default';
    }
  }

  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumbs: [],
    extra: '',
    desc: '',
    footer: ''
  };

  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: 'Approval',
      breadcrumbs: [
        { name: 'Enterprise Management' },
        {
          name: 'Enterprise Onboarding',
          url: '/poc/poc-enterprise/enterprise-onboarding/info'
        },
        { name: 'Approval' }
      ],
      extra: '',
      desc: '',
      footer: ''
    };
  }
}
