import { Component, Inject, OnInit } from '@angular/core';
import { NzModalRef, NZ_MODAL_DATA } from 'ng-zorro-antd/modal';
import { LiquidityPoolService } from '@app/core/services/http/poc-liquidity/liquidity-pool/liquidity-pool.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface ModalData {
  liquidityPoolAddress: string;
  token: string;
  liquidityPoolId: number;
  balance: string;
  minBalanceReq: string;
}

@Component({
  selector: 'app-reauthorize-modal',
  templateUrl: './reauthorize-modal.component.html',
  styleUrls: ['./reauthorize-modal.component.less']
})
export class ReauthorizeModalComponent implements OnInit {
  liquidityPoolAddress: string;
  token: string;
  liquidityPoolId: number;
  walletBalance: string = '';
  minBalanceReq: string = '';
  isLoading = false;
  validateForm!: FormGroup;
  isWalletBalanceInsufficient = false;

  constructor(
    private modal: NzModalRef,
    @Inject(NZ_MODAL_DATA) private data: ModalData,
    private liquidityPoolService: LiquidityPoolService,
    private message: NzMessageService,
    private fb: FormBuilder
  ) {
    this.liquidityPoolAddress = this.data.liquidityPoolAddress;
    this.token = this.data.token;
    this.liquidityPoolId = this.data.liquidityPoolId;
    this.walletBalance = this.data.balance;
    this.minBalanceReq = this.data.minBalanceReq;
    
    // 检查钱包余额是否小于最小余额要求
    this.isWalletBalanceInsufficient = Number(this.walletBalance) < Number(this.minBalanceReq);
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      currency: [{ value: this.token, disabled: true }],
      liquidityPoolAddress: [{ value: this.liquidityPoolAddress, disabled: true }],
      authorizedAmount: [
        { 
          value: this.walletBalance, 
          disabled: this.isWalletBalanceInsufficient 
        }, 
        [
          Validators.required,
          Validators.min(Number(this.minBalanceReq))
        ]
      ]
    });

    // 监听授权金额的变化
    this.validateForm.get('authorizedAmount')?.valueChanges.subscribe(value => {
      if (Number(value) < Number(this.minBalanceReq)) {
        this.validateForm.get('authorizedAmount')?.setErrors({ 
          min: { 
            min: this.minBalanceReq, 
            actual: value 
          } 
        });
      }
    });
  }

  handleCancel(): void {
    this.modal.destroy();
  }

  handleOk(): void {
    if (this.validateForm.valid && !this.isWalletBalanceInsufficient) {
      const authorizedAmount = this.validateForm.get('authorizedAmount')?.value;
      if (!authorizedAmount) {
        this.message.error('Please enter authorized amount');
        return;
      }

      if (Number(authorizedAmount) < Number(this.minBalanceReq)) {
        this.message.error('Authorized amount must be greater than or equal to minimum balance requirement');
        return;
      }

      this.isLoading = true;
      const params = {
        liquidityPoolId: this.liquidityPoolId,
        authorizedAmount: authorizedAmount
      };

      this.liquidityPoolService.reauthorize(params).subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res.code === 0) {
            this.modal.close(true);
          } else {
            this.message.error(res.message || 'Failed to reauthorize liquidity pool');
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.message.error(err.message || 'Failed to reauthorize liquidity pool');
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