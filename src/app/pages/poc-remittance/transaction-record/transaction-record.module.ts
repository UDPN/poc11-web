import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { TransactionRecordRoutingModule } from './transaction-record-routing.module';
import { TransactionRecordComponent } from './transaction-record.component';
import { InfoComponent } from './info/info.component';
import { TimelineComponent } from './components/timeline/timeline.component';

@NgModule({
  declarations: [TransactionRecordComponent, InfoComponent, TimelineComponent],
  imports: [CommonModule, SharedModule, TransactionRecordRoutingModule]
})
export class TransactionRecordModule {}
