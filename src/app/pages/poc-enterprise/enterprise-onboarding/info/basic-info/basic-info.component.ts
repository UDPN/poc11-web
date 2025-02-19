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
  enterpriseId: number;
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
    walletApproval: 0,
    enterpriseId: 0
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
            this.enterpriseDetail.enterpriseId = this.enterpriseId;
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

  copy(text: string): void {
    if (!text) {
      return;
    }

    // 创建一个临时文本区域
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);

    try {
      // 首先尝试使用现代的 Clipboard API
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(
          () => {
            this.message.success('Copied successfully');
          },
          () => {
            // 如果 Clipboard API 失败，回退到传统方法
            this.fallbackCopyToClipboard(textArea);
          }
        );
      } else {
        // 在不支持 Clipboard API 的环境中使用传统方法
        this.fallbackCopyToClipboard(textArea);
      }
    } finally {
      // 清理临时元素
      document.body.removeChild(textArea);
    }
  }

  private fallbackCopyToClipboard(textArea: HTMLTextAreaElement): void {
    try {
      // 选择文本
      textArea.select();
      textArea.setSelectionRange(0, 99999); // 对于移动设备

      // 执行复制命令
      const successful = document.execCommand('copy');
      if (successful) {
        this.message.success('Copied successfully');
      } else {
        this.message.error('Copy failed');
      }
    } catch (err) {
      this.message.error('Copy failed');
    }
  }

  downloadSecretKey(): void {
    if (!this.enterpriseDetail.enterpriseId) {
      this.message.error('Enterprise ID is required');
      return;
    }

    this.enterpriseService.downloadSecretKey(this.enterpriseDetail.enterpriseId)
      .subscribe({
        next: (response: Blob) => {
          // 创建一个链接元素
          const downloadLink = document.createElement('a');
          const url = window.URL.createObjectURL(response);
          downloadLink.href = url;
          
          // 设置文件名
          downloadLink.download = `openapi_key_${this.enterpriseDetail.enterpriseCode}.txt`;
          
          // 添加到文档并触发点击
          document.body.appendChild(downloadLink);
          downloadLink.click();
          
          // 清理
          document.body.removeChild(downloadLink);
          window.URL.revokeObjectURL(url);
          
          this.message.success('Downloaded successfully');
        },
        error: (err) => {
          this.message.error('Download failed');
          console.error('Download error:', err);
        }
      });
  }
} 