import { Component, Inject } from '@angular/core';
import { NzModalRef, NZ_MODAL_DATA, NzModalService } from 'ng-zorro-antd/modal';
import { LiquidityPoolService } from '@app/core/services/http/poc-liquidity/liquidity-pool/liquidity-pool.service';
import { NzMessageService } from 'ng-zorro-antd/message';

interface ModalData {
  liquidityPoolAddress: string;
  token: string;
  liquidityPoolId: number;
  status: number;
}

@Component({
  selector: 'app-activate-modal',
  templateUrl: './activate-modal.component.html',
  styleUrls: ['./activate-modal.component.less']
})
export class ActivateModalComponent {
  liquidityPoolAddress: string;
  token: string;
  liquidityPoolId: number;
  status: number;
  comments: string = '';
  isLoading = false;

  constructor(
    private modal: NzModalRef,
    @Inject(NZ_MODAL_DATA) private data: ModalData,
    private liquidityPoolService: LiquidityPoolService,
    private message: NzMessageService,
    private modalService: NzModalService
  ) {
    this.liquidityPoolAddress = this.data.liquidityPoolAddress;
    this.token = this.data.token;
    this.liquidityPoolId = this.data.liquidityPoolId;
    this.status = this.data.status;
  }

  handleCancel(): void {
    this.modal.destroy();
  }

  handleOk(): void {
    if (!this.comments) {
      this.message.error('Please enter comments');
      return;
    }

    this.isLoading = true;
    const params = {
      liquidityPoolId: this.liquidityPoolId,
      liquidityPoolStatus: this.status === 1 ? 3 : 1, // 如果当前是激活状态则切换到未激活，反之亦然
      remarks: this.comments
    };

    this.liquidityPoolService.modifyStatus(params).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.code === 0) {
          this.modal.close(this.comments);
        } 
      },
      error: (err) => {
        this.isLoading = false;
        console.log(err.message || 'Failed to modify liquidity pool status');
      }
    });

  }
} 