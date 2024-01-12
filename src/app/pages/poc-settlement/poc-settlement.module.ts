import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { SettlementComponent } from './settlement/settlement.component';
import { PocSettlementRoutingModule } from './poc-settlement-routing.module';
import { BillComponent } from './bill/bill.component';

@NgModule({
  declarations: [SettlementComponent, BillComponent],
  imports: [SharedModule, PocSettlementRoutingModule],
})
export class PocSettlementModule {}
