import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { FxRateRoutingModule } from './fx-rate-routing.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedModule,
    FxRateRoutingModule
  ]
})
export class FxRateModule { }
