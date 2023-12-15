import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { TransactionRecordRoutingModule } from './transaction-record-routing.module';
import { TransactionRecordComponent } from './transaction-record.component';
import { InfoComponent } from './info/info.component';

@NgModule({
  declarations: [TransactionRecordComponent, InfoComponent],
  imports: [CommonModule, SharedModule, TransactionRecordRoutingModule]
})
export class TransactionRecordModule {}
