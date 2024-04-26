/*
 * @Author: chenyuting
 * @Date: 2024-04-18 15:12:10
 * @LastEditors: chenyuting
 * @LastEditTime: 2024-04-18 15:12:49
 * @Description: 
 */
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { PocFxRateRoutingModule } from './poc-fx-rate-routing.module';
import { FxRateComponent } from './fx-rate/fx-rate.component';

@NgModule({
  declarations: [FxRateComponent],
  imports: [SharedModule, PocFxRateRoutingModule],
})
export class PocFxRateModule {}
