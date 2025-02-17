import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LiquidityPoolComponent } from './liquidity-pool.component';

const routes: Routes = [
  {
    path: '',
    component: LiquidityPoolComponent,
    data: { title: 'liquidityPool', key: 'liquidity-pool', shouldDetach: 'no' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LiquidityPoolRoutingModule {}
