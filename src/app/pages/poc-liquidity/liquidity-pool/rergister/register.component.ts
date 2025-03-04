import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { LiquidityPoolService, RegisterPoolEntry } from '@core/services/http/poc-liquidity/liquidity-pool/liquidity-pool.service';
import { TokenListItem, TokenWalletResponse } from '@core/services/http/poc-liquidity/liquidity-pool/liquidity-pool.service';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.less']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  isLoading = false;
  tokenList: TokenListItem[] = [];
  showAddButton = false;
  walletList: Array<{ address: string; balance: string }> = [];
  walletLists: { [key: number]: Array<{ walletAddress: string }> } = {};
  pageHeaderInfo: Partial<PageHeaderType> = {
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
  isFirstRegistration: boolean = true;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private message: NzMessageService,
    private modal: NzModalService,
    private liquidityPoolService: LiquidityPoolService
  ) {
    this.registerForm = this.fb.group({
      poolEntries: this.fb.array([])
    });
  }

  ngOnInit() {
    this.checkRegistrationStatus();
  }

  private checkRegistrationStatus() {
    this.liquidityPoolService.checkRegistration().subscribe({
      next: (response) => {
        if (response.code === 0) {
          this.isFirstRegistration = response.data.firstRegistration;
          this.loadTokens();
          this.loadWallets();
        } else {
          this.message.error(response.message || 'Failed to check registration status');
        }
      },
      error: (error) => {
        console.error('Error checking registration status:', error);
      }
    });
  }

  private loadWallets() {
    // 模拟钱包列表数据
    this.walletList = [
      { address: '0xc46d8cb40719614575db28c147610ec2718771b5', balance: '1000000000.00' },
      { address: '0x4740a8cb40719614575db28c147610ec2718771b5', balance: '1000000000.00' }
    ];
  }

  createWallet() {
    // 实现创建钱包的逻辑
    this.message.info('Create wallet functionality will be implemented');
  }

  get poolEntries() {
    return this.registerForm.get('poolEntries') as FormArray;
  }

  private loadTokens() {
    this.liquidityPoolService.getTokenList().subscribe({
      next: (response) => {
        if (response.code === 0) {
          this.tokenList = response.data;
          
          // Initialize with entries based on registration status
          const initialEntries = this.isFirstRegistration ? Math.min(2, this.tokenList.length) : 1;
          for (let i = 0; i < initialEntries; i++) {
            this.addPoolEntry();
            // 默认选择前两个token
            if (i < 2 && this.tokenList[i]) {
              const entry = this.poolEntries.at(i);
              this.selectTokenAndLoadWallet(this.tokenList[i].tokenId, i);
            }
          }
          
          this.updateAddButtonVisibility();
        } else {
          this.message.error(response.message || 'Failed to load tokens');
        }
      },
      error: (error) => {
        this.message.error('Failed to load tokens');
        console.error('Error loading tokens:', error);
      }
    });
  }

  private selectTokenAndLoadWallet(tokenId: string, index: number) {
    const entry = this.poolEntries.at(index);
    entry.patchValue({ tokenId: tokenId });
    this.onTokenSelect(tokenId, index);

    // 加载对应token的钱包地址
    this.liquidityPoolService.getTokenWallets(tokenId).subscribe({
      next: (response: TokenWalletResponse) => {
        if (response.code === 0) {
          // 存储当前 entry 的钱包列表
          this.walletLists[index] = response.data;
          if (response.data.length > 0) {
            entry.patchValue({
              liquidityPoolAddress: response.data[0].walletAddress
            });
          }
        }
      },
      error: (error: Error) => {
        console.error('Error loading wallet addresses:', error);
      }
    });
  }

  // 获取特定 entry 的钱包列表
  getWalletList(index: number): Array<{ walletAddress: string }> {
    return this.walletLists[index] || [];
  }

  private updateAddButtonVisibility() {
    // 只有当当前条数小于token总数时才显示Add按钮
    this.showAddButton = this.poolEntries.length < this.tokenList.length;
  }

  createPoolEntry() {
    return this.fb.group({
      tokenId: [null, [Validators.required]],
      liquidityPoolAddress: [null, [Validators.required]],
      minBalanceReq: [{ value: '', disabled: true }],
      preAuthorizedDebit: [true]
    });
  }

  addPoolEntry() {
    if (this.poolEntries.length < 5) {
      this.poolEntries.push(this.createPoolEntry());
      this.updateAddButtonVisibility();
    }
  }

  removePoolEntry(index: number) {
    const minEntries = this.isFirstRegistration ? 2 : 1;
    if (this.poolEntries.length > minEntries) {
      this.poolEntries.removeAt(index);
      this.updateAddButtonVisibility();
    }
  }

  isTokenDisabled(tokenId: string, currentIndex: number): boolean {
    // Check if the token is already selected in other entries
    return this.poolEntries.controls.some((control, index) => 
      index !== currentIndex && control.get('tokenId')?.value === tokenId
    );
  }

  onTokenSelect(tokenId: string, index: number) {
    const entry = this.poolEntries.at(index);
    const selectedToken = this.tokenList.find(token => token.tokenId === tokenId);
    
    if (selectedToken) {
      // Format minBalance with thousand separators
      const formattedMinBalance = Number(selectedToken.minBalance).toLocaleString();
      entry.patchValue({
        minBalanceReq: `${formattedMinBalance} ${selectedToken.tokenName}`
      });

      // 当手动选择token时也加载对应的钱包地址
      this.liquidityPoolService.getTokenWallets(tokenId).subscribe({
        next: (response: TokenWalletResponse) => {
          if (response.code === 0) {
            // 存储当前 entry 的钱包列表
            this.walletLists[index] = response.data;
            if (response.data.length > 0) {
              entry.patchValue({
                liquidityPoolAddress: response.data[0].walletAddress
              });
            }
          }
        },
        error: (error: Error) => {
          console.error('Error loading wallet addresses:', error);
        }
      });
    }
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.modal.confirm({
        nzTitle: 'Confirm Registration',
        nzContent: 'Are you sure you want to register these liquidity pools?',
        nzOnOk: () => {
          this.isLoading = true;
          
          // 准备请求数据
          const entries: RegisterPoolEntry[] = this.poolEntries.controls.map(control => ({
            tokenId: control.get('tokenId')?.value,
            walletAddress: control.get('liquidityPoolAddress')?.value
          }));

          // 调用注册接口
          this.liquidityPoolService.register(entries).subscribe({
            next: (response) => {
              this.isLoading = false;
              if (response.code === 0) {
                this.message.success('Registration successful');
                this.router.navigate(['/poc/poc-liquidity/liquidity-pool']);
              } else {
                this.message.error(response.message || 'Registration failed');
              }
            },
            error: (error) => {
              this.isLoading = false;
              console.error('Registration error:', error);
            }
          });
        }
      });
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
    this.router.navigate(['/poc-liquidity/liquidity-pool/list']);
  }
}
