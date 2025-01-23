/*
 * @Author: chenyuting
 * @Date: 2025-01-20 14:03:37
 * @LastEditors: chenyuting
 * @LastEditTime: 2025-01-23 13:38:14
 * @Description:
 */
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TopUpWithdrawService } from '@app/core/services/http/poc-enterprise/top-up-withdraw/top-up-withdraw.service';
import { WalletService } from '@app/core/services/http/poc-enterprise/wallet/wallet.service';
import { fnCheckForm } from '@app/utils/tools';
import { NzMessageService } from 'ng-zorro-antd/message';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.less'
})
export class TimelineComponent implements OnInit {
  @Input() info: any;
  @Input() type: string = '';
  @Input() status: any;
  rejectStatus: boolean = false;
  isLoading: boolean = false;
  validateForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private message: NzMessageService,
    private topUpWithdrawService: TopUpWithdrawService
  ) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      reason: [null, [Validators.required]]
    });
  }
  getStatus(value: number, approval?: boolean) {
    // 2: reject  3:approve
    if (value === 2) {
      this.rejectStatus = true;
    } else {
      this.rejectStatus = false;
      this.validateForm.reset();
      if (approval) {
        this.getApproval('approve');
      }
    }
  }

  getApproval(value: string) {
    if (value === 'reject') {
      if (!fnCheckForm(this.validateForm)) {
        return;
      }
    }
    if (this.type === 'top-up' || this.type === 'withdraw') {
      this.isLoading = true;
      const params = {
        accountCbdcId: this.info.accountCbdcId,
        approvedComments:
          value === 'reject' ? this.validateForm.get('reason')?.value : '',
        approvalStatus: value === 'reject' ? 3 : 2
      };
      const messageValue = value === 'reject' ? 'Reject' : 'Approve';
      this.topUpWithdrawService
        .getTopUpWithdrawApprove(params)
        .pipe(finalize(() => this.isLoading === false))
        .subscribe({
          next: (res) => {
            if (res) {
              this.message.success(`${messageValue} successfully!`, {
                nzDuration: 1000
              });
              window.location.reload();
            }
            this.isLoading = false;
            this.cdr.markForCheck();
          },
          error: (err) => {
            this.isLoading = false;
            this.cdr.markForCheck();
          }
        });
    } else {
      // transfer / fx purchasing approval
    }
  }
}
