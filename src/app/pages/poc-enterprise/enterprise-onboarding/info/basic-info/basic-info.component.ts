import { Component, Input, OnInit } from '@angular/core';
import { EnterpriseOnboardingService } from '@app/core/services/http/poc-enterprise/enterprise-onboarding/enterprise-onboarding.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-basic-info',
  templateUrl: './basic-info.component.html',
  styleUrls: ['./basic-info.component.less']
})
export class BasicInfoComponent implements OnInit {
  @Input() enterpriseId: number = 0;
  @Input() status: number = 0;
  enterpriseDetail: any = {};
  loading: boolean = false;

  constructor(
    private enterpriseService: EnterpriseOnboardingService,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    this.getEnterpriseDetail();
  }

  getEnterpriseDetail() {
    this.loading = true;
    this.enterpriseService
      .getEnterpriseDetail({
        enterpriseId: this.enterpriseId,
        status: this.status
      })
      .subscribe({
        next: (res) => {
          this.loading = false;
          if (res.code === 0) {
            this.enterpriseDetail = res.data;
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
} 