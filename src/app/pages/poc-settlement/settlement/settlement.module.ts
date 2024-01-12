import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { SettlementRoutingModule } from './settlement-routing.module';import { InfoComponent } from './info/info.component';
import { AddComponent } from './add/add.component';

@NgModule({
  declarations: [InfoComponent, AddComponent],
  imports: [
    CommonModule,
    SharedModule,
    SettlementRoutingModule
  ]
})
export class SettlementModule { }
