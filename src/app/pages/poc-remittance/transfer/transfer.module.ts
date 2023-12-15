import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { TransferRoutingModule } from './transfer-routing.module';
import { TransferComponent } from './transfer.component';

@NgModule({
  declarations: [TransferComponent],
  imports: [CommonModule, SharedModule, TransferRoutingModule]
})
export class TransferModule {}
