import { Component, OnInit } from '@angular/core';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TokenPairService } from '@app/core/services/http/poc-liquidity/token-pair/token-pair.service';

export interface OperateModalData {
  rateId: number;
  tokenPair: string;
  isActivate: boolean;
}

@Component({
  selector: 'app-operate-modal',
  templateUrl: './operate-modal.component.html',
  styleUrls: ['./operate-modal.component.less']
})
export class OperateModalComponent implements OnInit {
  rateId: number = 0;
  tokenPair: string = '';
  isActivate: any;
  comments: string = '';
  isLoading: boolean = false;

  constructor(
    private modal: NzModalRef,
    private message: NzMessageService,
    private tokenPairService: TokenPairService
  ) {}

  ngOnInit(): void {
    const data = this.modal.getConfig().nzData as OperateModalData;
    this.rateId = data.rateId;
    this.tokenPair = data.tokenPair;
    this.isActivate = data.isActivate;
  }

  handleOk(): void {
    if (!this.comments.trim()) {
      this.message.error('Please enter comments');
      return;
    }

    this.isLoading = true;
    this.tokenPairService.operateTokenPair({
      rateId: this.rateId,
      state: this.isActivate===1? 3 : 1,
      comments: this.comments.trim()
    }).subscribe({
      next: (response) => {
        if (response.code === 0) {
          this.message.success('Operation successful');
          this.modal.close(true);
        } 
      },
      error: (error) => {
        console.error('Operation failed:', error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  handleCancel(): void {
    this.modal.destroy();
  }
} 