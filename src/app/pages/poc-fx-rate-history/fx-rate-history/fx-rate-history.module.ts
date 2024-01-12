import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { FxRateHistoryRoutingModule } from './fx-rate-history-routing.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedModule,
    FxRateHistoryRoutingModule
  ]
})
export class FxRateHistoryModule { }
