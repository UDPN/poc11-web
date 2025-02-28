import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { Location } from '@angular/common';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TokenPairService } from '@app/core/services/http/poc-liquidity/token-pair/token-pair.service';
import { DatePipe } from '@angular/common';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Router } from '@angular/router';

interface TokenPairData {
  tokenPair: string;
  fxRate: string;
  updatedOn: string;
  checked: boolean;
  fromCurrency?: string;
  toCurrency?: string;
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
  tokenPairList: TokenPairData[] = [];
  loading = false;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private message: NzMessageService,
    private tokenPairService: TokenPairService,
    private datePipe: DatePipe,
    private modal: NzModalService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      fxType: ['Network FX', [Validators.required]],
      selectedTokens: [[], [Validators.required]]
    });
    
    this.loadTokenPairList();
  }

  loadTokenPairList(): void {
    this.loading = true;
    this.tokenPairService.getNetworkTokenPairList().subscribe({
      next: (res) => {
        if (res.code === 0) {
          this.tokenPairList = res.data.map(item => ({
            tokenPair: `${item.fromCurrency}/${item.toCurrency}`,
            fxRate: item.exchangeRate.toString(),
            updatedOn: this.datePipe.transform(item.updateTime, 'MMM d, y, HH:mm:ss') + ' UTC+08:00',
            checked: false,
            fromCurrency: item.fromCurrency,
            toCurrency: item.toCurrency
          }));
        } else {
          this.message.error(res.message || 'Failed to load token pair list');
        }
        this.loading = false;
      },
      error: (err) => {
        this.message.error(err.message || 'Failed to load token pair list');
        this.loading = false;
      }
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

  updateAllChecked(): void {
    this.indeterminate = false;
    this.allChecked = !this.allChecked;
    this.tokenPairList = this.tokenPairList.map(item => ({
      ...item,
      checked: this.allChecked
    }));
    this.updateSingleChecked();
    this.updateFormSelectedTokens();
  }

  updateSingleChecked(): void {
    const allChecked = this.tokenPairList.every(item => item.checked);
    const allUnchecked = this.tokenPairList.every(item => !item.checked);
    this.allChecked = allChecked;
    this.indeterminate = !allChecked && !allUnchecked;
    this.updateFormSelectedTokens();
  }

  updateFormSelectedTokens(): void {
    const selectedTokens = this.tokenPairList
      .filter(item => item.checked)
      .map(item => item.tokenPair);
    this.validateForm.patchValue({ selectedTokens });
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      const selectedTokens = this.tokenPairList.filter(item => item.checked);
      
      if (selectedTokens.length === 0) {
        this.message.error('Please select at least one token pair');
        return;
      }

      this.modal.confirm({
        nzTitle: 'Confirm',
        nzContent: 'Are you sure you want to submit?',
        nzOnOk: () => {
          this.submitting = true;
          const params = selectedTokens.map(item => ({
            fromCurrency: item.fromCurrency!,
            toCurrency: item.toCurrency!
          }));

          this.tokenPairService.saveNetworkTokenPair(params).subscribe({
            next: (res) => {
              this.submitting = false;
              if (res.code === 0) {
                this.message.success('Submitted successfully');
                this.router.navigate(['/poc/poc-liquidity/token-pair']);
              } else {
                this.message.error(res.message || 'Failed to save token pairs');
              }
            },
            error: (err) => {
              this.submitting = false;
              this.message.error(err.message || 'Failed to save token pairs');
            }
          });
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
