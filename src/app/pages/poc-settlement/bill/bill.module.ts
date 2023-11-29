import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { BillRoutingModule } from './bill-routing.module';
import { InfoComponent } from './info/info.component';
import { TransactionInfoComponent } from './components/transaction-info/transaction-info.component';


@NgModule({
  declarations: [InfoComponent, TransactionInfoComponent],
  imports: [
    CommonModule,
    SharedModule,
    BillRoutingModule
  ]
})
export class BillModule { }
