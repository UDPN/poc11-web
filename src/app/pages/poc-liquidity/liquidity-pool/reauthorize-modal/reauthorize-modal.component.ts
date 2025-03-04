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
  authorizedAmount: string;
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
  authorizedAmount: string = '';
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
    this.authorizedAmount = this.data.authorizedAmount;
    // 检查钱包余额是否小于最小余额要求
    this.isWalletBalanceInsufficient = Number(this.walletBalance) < Number(this.minBalanceReq);
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      currency: [{ value: this.token, disabled: true }],
      liquidityPoolAddress: [{ value: this.liquidityPoolAddress, disabled: true }],

      increasedAuthorizedAmount: [0] // 默认值为0
    });


    this.validateForm.get('increasedAuthorizedAmount')?.valueChanges.subscribe(() => {
      this.checkWalletBalance();
    });
  }

  private checkWalletBalance(): void {

    const increasedAuthorizedAmount = Number(this.validateForm.get('increasedAuthorizedAmount')?.value) || 0;
    console.log(increasedAuthorizedAmount);
    this.isWalletBalanceInsufficient = (Number(this.authorizedAmount) + increasedAuthorizedAmount) < Number(this.minBalanceReq);
    console.log(this.isWalletBalanceInsufficient);
  }

  handleCancel(): void {
    this.modal.destroy();
  }

  handleOk(): void {
    if (this.validateForm.valid && !this.isWalletBalanceInsufficient) {
      const authorizedAmountss = this.validateForm.get('increasedAuthorizedAmount')?.value;
      if (!authorizedAmountss) {
        // this.message.error('Please enter authorized amount');
        return;
      }


      this.isLoading = true;
      const params = {
        liquidityPoolId: this.liquidityPoolId,
        authorizedAmount: this.validateForm.get('increasedAuthorizedAmount')?.value
      };

      this.liquidityPoolService.reauthorize(params).subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res.code === 0) {
            this.modal.close(true);
          }
        },
        error: (err) => {
          this.isLoading = false;
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