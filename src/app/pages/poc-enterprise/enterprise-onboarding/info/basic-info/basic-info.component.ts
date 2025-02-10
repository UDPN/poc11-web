import { Component, Input, OnInit } from '@angular/core';
import { EnterpriseOnboardingService } from '@app/core/services/http/poc-enterprise/enterprise-onboarding/enterprise-onboarding.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { Location } from '@angular/common';

interface EnterpriseDetail {
  accessKey: string;
  accessAddress: string;
  approvalTime: number;
  approvalUser: string;
  contactEmail: string;
  contactName: string;
  createTime: number;
  createUser: string;
  enterpriseCode: string;
  enterpriseName: string;
  enterpriseFlatAccount: string;
  enterpriseFlatBank: string;
  operationType: number;
  remarks: string;
  status: number;
  tokenList: { tokenName: string }[];
  txApprovalThreshold: number;
  txHash: string;
  txTime: number;
  walletApproval: number;
}

@Component({
  selector: 'app-basic-info',
  templateUrl: './basic-info.component.html',
  styleUrls: ['./basic-info.component.less']
})
export class BasicInfoComponent implements OnInit {
  @Input() enterpriseId: number = 0;
  @Input() status: number = 0;
  loading = false;
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumbs: [],
    extra: '',
    desc: '',
    footer: ''
  };
  enterpriseDetail: EnterpriseDetail = {
    accessKey: '',
    accessAddress: '',
    approvalTime: 0,
    approvalUser: '',
    contactEmail: '',
    contactName: '',
    createTime: 0,
    createUser: '',
    enterpriseCode: '',
    enterpriseName: '',
    enterpriseFlatAccount: '',
    enterpriseFlatBank: '',
    operationType: 0,
    remarks: '',
    status: 0,
    tokenList: [],
    txApprovalThreshold: 0,
    txHash: '',
    txTime: 0,
    walletApproval: 0
  };

  constructor(
    private enterpriseService: EnterpriseOnboardingService,
    private message: NzMessageService,
    private location: Location
  ) {}

  ngOnInit() {
    this.initPageHeader();
    this.getEnterpriseDetail();
  }

  initPageHeader(): void {
    this.pageHeaderInfo = {
      title: 'Enterprise Details',
      breadcrumbs: [
        { name: 'Enterprise Management' },
        { name: 'Enterprise Onboarding', url: '/poc/poc-enterprise/enterprise-onboarding' },
        { name: 'Details' }
      ],
      extra: '',
      desc: '',
      footer: ''
    };
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

  getOperationTypeText(type: number): string {
    switch (type) {
      case 1:
        return 'Onboard';
      case 2:
        return 'Edit';
      case 3:
        return 'Enable';
      case 4:
        return 'Deactivate';
      default:
        return 'Unknown';
    }
  }

  getStatusText(status: number): string {
    switch (status) {
      case 0:
        return 'Opening';
      case 1:
        return 'Enable';
      case 2:
        return 'Deactivate';
      case 3:
        return 'Rejected';
      default:
        return 'Unknown';
    }
  }

  getStatusColor(status: number): string {
    switch (status) {
      case 0:
        return 'processing';
      case 1:
        return 'success';
      case 2:
      case 3:
        return 'error';
      default:
        return 'default';
    }
  }
} 