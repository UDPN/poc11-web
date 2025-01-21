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
    this.routeInfo.queryParams.subscribe((params: any) => {
      if (JSON.stringify(params) !== '{}') {
        this.tempStatus = false;
        // this.getInfo(params['userId']);
      }
    });
    this.validateForm = this.fb.group({
      enterpriseCode: [null],
      enterpriseName: [null, [this.enterpriseNameValidator]],
      contactName: [null, [this.contactNameValidator]],
      email: [null, [Validators.required, Validators.email]],
      enterpriseBank: [null, [this.enterpriseBankValidator]],
      enterpriseAccount: [null],
      generateWallet: ['1', [Validators.required]],
      approvalValue: [null, [Validators.required]],
      description: [null]
    });
  }

  enterpriseNameValidator = (
    control: UntypedFormControl
  ): { [s: string]: boolean } => {
    if (!/^[A-Za-z0-9]{0,50}$/.test(control.value)) {
      return { regular: true, error: true };
    }
    return {};
  };

  contactNameValidator = (
    control: UntypedFormControl
  ): { [s: string]: boolean } => {
    if (!/^[A-Za-z0-9]{0,50}$/.test(control.value)) {
      return { regular: true, error: true };
    }
    return {};
  };

  enterpriseBankValidator = (
    control: UntypedFormControl
  ): { [s: string]: boolean } => {
    if (!/^[A-Za-z0-9]{0,50}$/.test(control.value)) {
      return { regular: true, error: true };
    }
    return {};
  };

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
        txApprovalThreshold: Number(formValue.approvalValue),
        walletApproval: Number(formValue.generateWallet)
      };

      this.enterpriseService.saveEnterprise(submitData).subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res.code === 0) {
            this.message.success('Enterprise saved successfully');
            this.router.navigate(['/poc/poc-enterprise/enterprise-onboarding']);
          } else {
            this.message.error(res.message || 'Save failed');
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.message.error(err.message || 'Save failed');
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
