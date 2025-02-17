/*
 * @Author: chenyuting
 * @Date: 2025-02-17 09:52:26
 * @LastEditors: chenyuting
 * @LastEditTime: 2025-02-17 10:23:22
 * @Description:
 */
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { PocLiquidityRoutingModule } from './poc-liquidity-routing.module';

@NgModule({
  declarations: [],
  imports: [SharedModule, PocLiquidityRoutingModule]
})
export class PocLiquidityModule {}
