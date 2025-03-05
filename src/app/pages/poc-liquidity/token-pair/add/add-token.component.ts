import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { Location } from '@angular/common';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TokenPairService } from '@app/core/services/http/poc-liquidity/token-pair/token-pair.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Router } from '@angular/router';

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
  loading = false;
  submitting = false;

  tokenPairs: TokenPair[] = [];

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private message: NzMessageService,
    private tokenPairService: TokenPairService,
    private modal: NzModalService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      fxType: ['Local FX', [Validators.required]],
      selectedTokens: [[], [Validators.required]]
    });
    this.loadTokenPairs();
  }

  loadTokenPairs(): void {
    this.loading = true;
    this.tokenPairService.saveLocalTokenPairList().subscribe({
      next: (res) => {
        if (res.code === 0) {
          this.tokenPairs = res.data.map(pair => ({
            label: `${pair.fromCurrency}/${pair.toCurrency}`,
            value: `${pair.fromCurrency}/${pair.toCurrency}`
          }));
        } else {
          this.message.error(res.message || 'Failed to load token pairs');
        }
        this.loading = false;
      },
      error: (error) => {
        this.message.error('Failed to load token pairs');
        this.loading = false;
      }
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
    if (this.submitting) {
      return;
    }

    if (!this.validateForm.valid) {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsTouched();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }

    const selectedTokens = this.validateForm.get('selectedTokens')?.value || [];
    if (selectedTokens.length === 0) {
      this.message.error('Please select at least one token pair');
      return;
    }

    this.modal.confirm({
      nzTitle: 'Confirm',
      nzContent: 'Are you sure you want to submit?',
      nzOnOk: () => {
        this.submitting = true;

        const tokenPairRequests = selectedTokens.map((pair: string) => {
          const [fromCurrency, toCurrency] = pair.split('/');
          return {
            fromCurrency,
            toCurrency
          };
        });

        this.tokenPairService.saveLocalTokenPair(tokenPairRequests).subscribe({
          next: (res) => {
            if (res.code === 0) {
              this.message.success('Submitted successfully');
              this.router.navigate(['/poc/poc-liquidity/token-pair']);
            } else {
              this.message.error(res.message || 'Failed to submit');
            }
          },
          error: (error) => {
            console.error('Failed to submit');
          },
          complete: () => {
            this.submitting = false;
          }
        });
      }
    });
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
