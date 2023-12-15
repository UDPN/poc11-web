import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { ActivateSettlementComponent } from './activate-settlement.component';
import { ActivateSettlementRoutingModule } from './activate-settlement-routing.module';
import { AddPoolComponent } from '../components/add-pool/add-pool.component';
import { InfoComponent } from './info/info.component';


@NgModule({
  declarations: [ActivateSettlementComponent, AddPoolComponent, InfoComponent],
  imports: [
    CommonModule,
    SharedModule,
    ActivateSettlementRoutingModule
  ]
})
export class ActivateSettlementModule { }
