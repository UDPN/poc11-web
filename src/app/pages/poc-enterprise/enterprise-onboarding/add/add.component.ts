/*
 * @Author: chenyuting
 * @Date: 2025-01-15 16:49:19
 * @LastEditors: chenyuting
 * @LastEditTime: 2025-01-20 11:29:06
 * @Description:
 */
import { AfterViewInit, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  UntypedFormControl,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { Location } from '@angular/common';
import { EnterpriseOnboardingService } from '@app/core/services/http/poc-enterprise/enterprise-onboarding/enterprise-onboarding.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrl: './add.component.less'
})
export class AddComponent implements OnInit, AfterViewInit {
  tempStatus: boolean = true;
  validateForm!: FormGroup;
  isLoading: boolean = false;
  enterpriseId: number = 0;
  status: number = 0;
  tokenList: any[] = [];

  // 添加千分位格式化方法
  formatNumber(value: number): string {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  // 移除千分位
  parseNumber(value: string): number {
    return Number(value.replace(/,/g, ''));
  }

  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumbs: [],
    extra: '',
    desc: '',
    footer: ''
  };

  constructor(
    private routeInfo: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    private enterpriseService: EnterpriseOnboardingService,
    private message: NzMessageService,
    private router: Router
  ) {}

  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: this.tempStatus === true ? 'Onboard' : 'Edit',
      breadcrumbs: [
        { name: 'Enterprise Management' },
        {
          name: 'Enterprise Onboarding',
          url: '/poc/poc-enterprise/enterprise-onboarding'
        },
        { name: this.tempStatus === true ? 'Onboard' : 'Edit' }
      ],
      extra: '',
      desc: '',
      footer: ''
    };
  }

  ngOnInit() {
    this.initForm();
    this.getTokenList();
    this.routeInfo.queryParams.subscribe((params: any) => {
      if (params.enterpriseId && params.status) {
        this.tempStatus = false;
        this.enterpriseId = Number(params.enterpriseId);
        this.status = Number(params.status);
        this.getEnterpriseDetail();
      } else {
        this.getEnterpriseCode();
      }
    });
  }

  initForm(): void {
    this.validateForm = this.fb.group({
      enterpriseCode: [null],
      enterpriseName: [null, ],
      contactName: [null, ],
      email: [null, [Validators.required, Validators.email]],
      enterpriseBank: [null, ],
      enterpriseAccount: [null],
      generateWallet: ['1', [Validators.required]],
      approvalValue: [this.formatNumber(5000), [Validators.required]],
      description: [null]
    });

    // 监听 approvalValue 的值变化
    this.validateForm.get('approvalValue')?.valueChanges.subscribe(value => {
      if (value) {
        const numericValue = this.parseNumber(value);
        const formattedValue = this.formatNumber(numericValue);
        if (value !== formattedValue) {
          this.validateForm.patchValue({
            approvalValue: formattedValue
          }, { emitEvent: false });
        }
      }
    });
  }

  // 获取企业详情
  getEnterpriseDetail(): void {
    this.enterpriseService
      .getEnterpriseDetail({
        enterpriseId: this.enterpriseId,
        status: this.status
      })
      .subscribe({
        next: (res) => {
          if (res.code === 0 && res.data) {
            const detail = res.data;
            this.validateForm.patchValue({
              enterpriseCode: detail.enterpriseCode,
              enterpriseName: detail.enterpriseName,
              contactName: detail.contactName,
              email: detail.contactEmail,
              description: detail.remarks,
              // 其他字段需要根据实际返回数据映射
              enterpriseBank: detail.enterpriseFlatBank,  // 需要后端确认字段
              enterpriseAccount: detail.enterpriseFlatAccount, // 需要后端确认字段
              generateWallet: String(detail.walletApproval), // 需要后端确认字段
              approvalValue: this.formatNumber(detail.txApprovalThreshold || 5000)
            });
          } 
        },
        error: (err) => {
          console.error(err.message || 'Failed to get enterprise detail');
        }
      });
  }

  // 获取 Enterprise Code
  getEnterpriseCode(): void {
    this.enterpriseService.getEnterpriseCode().subscribe({
      next: (res) => {
        if (res.code === 0 && res.data) {
          this.validateForm.patchValue({
            enterpriseCode: res.data
          });
        }
      },
      error: (err) => {
        console.error(err.message || 'Failed to get Enterprise Code');
      }
    });
  }

  // 获取 Token 列表
  getTokenList(): void {
    this.enterpriseService.getTokenList().subscribe({
      next: (res) => {
        if (res.code === 0) {
          this.tokenList = res.data || [];
        } 
      },
      error: (err) => {
        console.error(err.message || 'Failed to get token list');
      }
    });
  }

  // enterpriseNameValidator = (
  //   control: UntypedFormControl
  // ): { [s: string]: boolean } => {
  //   if (!/^[A-Za-z0-9\s]{0,50}$/.test(control.value)) {
  //     return { regular: true, error: true };
  //   }
  //   return {};
  // };

  // contactNameValidator = (
  //   control: UntypedFormControl
  // ): { [s: string]: boolean } => {
  //   if (!/^[A-Za-z0-9\s]{0,50}$/.test(control.value)) {
  //     return { regular: true, error: true };
  //   }
  //   return {};
  // };

  // enterpriseBankValidator = (
  //   control: UntypedFormControl
  // ): { [s: string]: boolean } => {
  //   if (!/^[A-Za-z0-9\s]{0,50}$/.test(control.value)) {
  //     return { regular: true, error: true };
  //   }
  //   return {};
  // };

  onBack() {
    this.location.back();
  }

  onSubmit() {
    if (this.validateForm.valid) {
      this.isLoading = true;
      const formValue = this.validateForm.value;
      
      const submitData = {
        contactEmail: formValue.email,
        contactName: formValue.contactName,
        description: formValue.description || '',
        enterpriseFlatAccount: formValue.enterpriseAccount || '',
        enterpriseFlatBank: formValue.enterpriseBank || '',
        enterpriseName: formValue.enterpriseName,
        txApprovalThreshold: this.parseNumber(formValue.approvalValue),
        walletApproval: Number(formValue.generateWallet),
        enterpriseCode: formValue.enterpriseCode
      };

      // 根据是否有 enterpriseId 判断是新增还是编辑
      const request = this.enterpriseId
        ? this.enterpriseService.editEnterprise({ ...submitData, enterpriseId: this.enterpriseId })
        : this.enterpriseService.saveEnterprise(submitData);

      request.subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res.code === 0) {
            this.message.success(
              `Enterprise ${this.enterpriseId ? 'updated' : 'saved'} successfully`
            );
            this.router.navigate(['/poc/poc-enterprise/enterprise-onboarding']);
          } else {
            console.error(res.message || `${this.enterpriseId ? 'Update' : 'Save'} failed`);
          }
        },
        error: (err) => {
          this.isLoading = false;
          console.error(err.message || `${this.enterpriseId ? 'Update' : 'Save'} failed`);
        }
      });
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsTouched();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
