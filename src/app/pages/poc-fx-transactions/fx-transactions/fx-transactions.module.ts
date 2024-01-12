import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { FxTransactionsRoutingModule } from './fx-transactions-routing.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedModule,
    FxTransactionsRoutingModule
  ]
})
export class FxTransactionsModule { }
