import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { Location } from '@angular/common';
import { NzMessageService } from 'ng-zorro-antd/message';

interface TokenPairData {
  tokenPair: string;
  fxRate: string;
  updatedOn: string;
  checked: boolean;
}

@Component({
  selector: 'app-add-net',
  templateUrl: './add-net.component.html',
  styleUrl: './add-net.component.less'
})
export class AddNetComponent implements OnInit, AfterViewInit {
  validateForm!: FormGroup;
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumbs: [],
    extra: '',
    desc: '',
    footer: ''
  };

  allChecked = false;
  indeterminate = false;
  tokenPairList: TokenPairData[] = [
    { tokenPair: 'tUSD/tEUR', fxRate: '0.96', updatedOn: 'Mar 9, 2024, 10:23:12 UTC+08:00', checked: false },
    { tokenPair: 'tUSD/tSAR', fxRate: '3.75', updatedOn: 'Mar 9, 2024, 10:23:12 UTC+08:00', checked: false },
    { tokenPair: 'tUSD/tAED', fxRate: '3.67', updatedOn: 'Mar 9, 2024, 10:23:12 UTC+08:00', checked: false },
    { tokenPair: 'tSAR/tEUR', fxRate: '0.26', updatedOn: 'Mar 9, 2024, 10:23:12 UTC+08:00', checked: false },
    { tokenPair: 'tSAR/tUSD', fxRate: '0.27', updatedOn: 'Mar 9, 2024, 10:23:12 UTC+08:00', checked: false },
    { tokenPair: 'tSAR/tAED', fxRate: '0.98', updatedOn: 'Mar 9, 2024, 10:23:12 UTC+08:00', checked: false },
    { tokenPair: 'tAED/tEUR', fxRate: '0.98', updatedOn: 'Mar 9, 2024, 10:23:12 UTC+08:00', checked: false },
    { tokenPair: 'tAED/tUSD', fxRate: '0.27', updatedOn: 'Mar 9, 2024, 10:23:12 UTC+08:00', checked: false },
    { tokenPair: 'tAED/tSAR', fxRate: '1.27', updatedOn: 'Mar 9, 2024, 10:23:12 UTC+08:00', checked: false }
  ];

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      fxType: ['Network FX', [Validators.required]],
      selectedTokens: [[], [Validators.required]]
    });
  }

  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: 'New Network FX Token Pair',
      breadcrumbs: [
        { name: 'Liquidity Management' },
        { name: 'Token Pair Management', url: '/poc/poc-liquidity/token-pair' },
        { name: 'New' }
      ],
      extra: '',
      desc: '',
      footer: ''
    };
  }

  onBack(): void {
    this.location.back();
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      const selectedTokens = this.tokenPairList
        .filter(item => item.checked)
        .map(item => item.tokenPair);
      
      if (selectedTokens.length === 0) {
        this.message.error('Please select at least one token pair');
        return;
      }

      console.log('submit', { ...this.validateForm.value, selectedTokens });
      this.message.success('Submitted successfully');
      this.location.back();
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsTouched();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  updateAllChecked(): void {
    this.indeterminate = false;
    this.allChecked = !this.allChecked;
    this.tokenPairList = this.tokenPairList.map(item => ({
      ...item,
      checked: this.allChecked
    }));
    this.updateSingleChecked();
  }

  updateSingleChecked(): void {
    const allChecked = this.tokenPairList.every(item => item.checked);
    const allUnchecked = this.tokenPairList.every(item => !item.checked);
    this.allChecked = allChecked;
    this.indeterminate = !allChecked && !allUnchecked;
  }
}
