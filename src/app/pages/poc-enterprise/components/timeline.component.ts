/*
 * @Author: chenyuting
 * @Date: 2025-01-20 14:03:37
 * @LastEditors: chenyuting
 * @LastEditTime: 2025-01-21 17:36:53
 * @Description:
 */
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
  @Input() type: any;
  rejectStatus: boolean = false;
  isLoading: boolean = false;
  validateForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private walletService: WalletService,
    private message: NzMessageService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.validateForm = this.fb.group({
      reason: [null, [Validators.required]]
    });
  }
  getStatus(value: number, approval?: boolean) {
    // 1: reject  2:approve
    if (value === 1) {
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
    this.isLoading = true;
    const params = {
      bankAccountId: this.info.bankAccountId,
      remarks: value === 'reject' ? this.validateForm.get('reason')?.value : '',
      result: value === 'reject' ? 2 : 1
    };
    const messageValue = value === 'reject' ? 'Reject' : 'Approve';
    if (this.type === 'type') {
      this.walletService
        .approve(params)
        .pipe(finalize(() => this.isLoading === false))
        .subscribe({
          next: (res) => {
            if (res) {
              this.message.success(`${messageValue} successfully!`, {
                nzDuration: 1000
              });
            }
            this.isLoading === false;
            this.router.navigate(['/poc/poc-enterprise/wallet/info'], {
              queryParams: { bankAccountId: this.info.bankAccountId }
            });
            this.cdr.markForCheck();
          },
          error: (err) => {
            this.isLoading === false;
            this.cdr.markForCheck();
          }
        });
    }
  }
}
