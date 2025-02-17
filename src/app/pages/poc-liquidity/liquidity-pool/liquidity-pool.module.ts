import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { LiquidityPoolComponent } from './liquidity-pool.component';
import { LiquidityPoolRoutingModule } from './liquidity-pool-routing.module';

@NgModule({
  declarations: [LiquidityPoolComponent],
  imports: [CommonModule, SharedModule, LiquidityPoolRoutingModule]
})
export class LiquidityPoolModule {}
