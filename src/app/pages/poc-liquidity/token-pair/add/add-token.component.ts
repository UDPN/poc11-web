import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { Location } from '@angular/common';
import { NzMessageService } from 'ng-zorro-antd/message';

interface TokenPair {
  label: string;
  value: string;
}

@Component({
  selector: 'app-add-token',
  templateUrl: './add-token.component.html',
  styleUrl: './add-token.component.less'
})
export class AddTokenComponent implements OnInit, AfterViewInit {
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

  tokenPairs: TokenPair[] = [
    { label: 'tUSD/tEUR', value: 'tUSD/tEUR' },
    { label: 'tUSD/tSAR', value: 'tUSD/tSAR' },
    { label: 'tUSD/tAED', value: 'tUSD/tAED' },
    { label: 'tSAR/tEUR', value: 'tSAR/tEUR' },
    { label: 'tSAR/tUSD', value: 'tSAR/tUSD' },
    { label: 'tSAR/tAED', value: 'tSAR/tAED' },
    { label: 'tAED/tEUR', value: 'tAED/tEUR' },
    { label: 'tAED/tUSD', value: 'tAED/tUSD' },
    { label: 'tAED/tSAR', value: 'tAED/tSAR' }
  ];

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      fxType: ['Local FX', [Validators.required]],
      selectedTokens: [[], [Validators.required]]
    });
  }

  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: 'New Local FX Token Pair',
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
      console.log('submit', this.validateForm.value);
      // TODO: Implement form submission
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

  updateAllChecked(checked: boolean): void {
    this.allChecked = checked;
    this.indeterminate = false;
    const selectedValues = checked ? this.tokenPairs.map(pair => pair.value) : [];
    this.validateForm.get('selectedTokens')?.setValue(selectedValues);
  }

  isChecked(value: string): boolean {
    const selectedTokens = this.validateForm.get('selectedTokens')?.value || [];
    return selectedTokens.includes(value);
  }

  onItemChecked(value: string, checked: boolean): void {
    const selectedTokens = [...(this.validateForm.get('selectedTokens')?.value || [])];
    if (checked) {
      selectedTokens.push(value);
    } else {
      const index = selectedTokens.indexOf(value);
      if (index !== -1) {
        selectedTokens.splice(index, 1);
      }
    }
    this.validateForm.get('selectedTokens')?.setValue(selectedTokens);
    this.updateCheckboxState(selectedTokens);
  }

  updateCheckboxState(selectedValues: string[]): void {
    const totalCount = this.tokenPairs.length;
    const selectedCount = selectedValues.length;

    this.allChecked = totalCount === selectedCount;
    this.indeterminate = selectedCount > 0 && selectedCount < totalCount;
  }
}
