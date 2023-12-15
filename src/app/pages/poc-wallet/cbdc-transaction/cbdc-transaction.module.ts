import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { CbdcTransactionComponent } from './cbdc-transaction.component';
import { CbdcTransactionRoutingModule } from './cbdc-transaction-routing.module';
import { InfoComponent } from './info/info.component';

@NgModule({
  declarations: [CbdcTransactionComponent, InfoComponent],
  imports: [CommonModule, SharedModule, CbdcTransactionRoutingModule]
})
export class CbdcTransactionModule {}
