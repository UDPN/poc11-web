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
import { ActivatedRoute } from '@angular/router';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { Location } from '@angular/common';

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
    private fb: FormBuilder
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
      email: [null, [Validators.required]],
      enterpriseBank: [null, [this.enterpriseBankValidator]],
      enterpriseAccount: [null],
      generateWallet: [null, [Validators.required]],
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
    console.log(this.validateForm.value, 'value');
  }
}
