import { AfterViewInit, Component, OnInit } from '@angular/core';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { Location } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { LiquidityPoolService } from '@app/core/services/http/poc-liquidity/liquidity-pool/liquidity-pool.service';

interface TokenOption {
  key: string;
  value: string;
}

interface WalletOption {
  address: string;
  balance: string;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.less']
})
export class RegisterComponent implements OnInit, AfterViewInit {
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumbs: [],
    extra: '',
    desc: '',
    footer: ''
  };

  registerForm = this.fb.group({
    poolEntries: this.fb.array([])
  });
  tokenList: TokenOption[] = [];
  walletList: WalletOption[] = [];
  isLoading = false;

  constructor(
    private location: Location,
    private fb: FormBuilder,
    private message: NzMessageService,
    private liquidityPoolService: LiquidityPoolService
  ) {
    this.addPoolEntry(); // Add initial entry
    this.addPoolEntry(); // Add second entry (requirement)
  }

  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: 'Register',
      breadcrumbs: [
        { name: 'Liquidity Management' },
        { name: 'Liquidity Pool Management', url: '/poc/poc-liquidity/liquidity-pool' },
        { name: 'Register' }
      ],
      extra: '',
      desc: '',
      footer: ''
    };
  }

  ngOnInit() {
    this.getTokenList();
    this.getWalletList();
  }

  get poolEntries(): FormArray {
    return this.registerForm.get('poolEntries') as FormArray;
  }

  addPoolEntry(): void {
    const poolEntry = this.fb.group({
      token: ['', [Validators.required]],
      liquidityPoolAddress: ['', [Validators.required]],
      minBalanceReq: ['1000000000.00', [Validators.required]],
      preAuthorizedDebit: [true]
    });
    this.poolEntries.push(poolEntry);
  }

  removePoolEntry(index: number): void {
    this.poolEntries.removeAt(index);
  }

  getTokenList(): void {
    this.liquidityPoolService.getTokenList().subscribe({
      next: (res) => {
        if (res.code === 0) {
          this.tokenList = res.data;
        } else {
          this.message.error(res.message || 'Failed to get token list');
        }
      },
      error: (err) => {
        this.message.error(err.message || 'Failed to get token list');
      }
    });
  }

  getWalletList(): void {
    // Simulated wallet list - replace with actual API call
    this.walletList = [
      { address: '0xc46d8cb40719614575db28c147610ec2718771b5', balance: '1000000000.00' },
      { address: '0x4740a8cb40719614575db28c147610ec2718771b5', balance: '1000000000.00' }
    ];
  }

  createWallet(): void {
    // Implement wallet creation logic
    this.message.info('Create wallet functionality will be implemented');
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      console.log('Form values:', this.registerForm.value);
      // Implement submission logic
      setTimeout(() => {
        this.isLoading = false;
        this.message.success('Registration successful');
        this.location.back();
      }, 1000);
    } else {
      Object.values(this.registerForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsTouched();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  onBack() {
    this.location.back();
  }
}
