/*
 * @Author: chenyuting
 * @Date: 2025-02-17 09:52:26
 * @LastEditors: chenyuting
 * @LastEditTime: 2025-02-17 10:01:18
 * @Description:
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'transfer', pathMatch: 'full' },
  {
    path: 'liquidity-pool',
    data: { preload: true },
    loadChildren: () =>
      import('./liquidity-pool/liquidity-pool.module').then(
        (m) => m.LiquidityPoolModule
      )
  },
  {
    path: 'token-pair',
    data: { preload: true },
    loadChildren: () =>
      import('./token-pair/token-pair.module').then((m) => m.TokenPairModule)
  },
  {
    path: 'fx-transactions',
    data: { preload: true },
    loadChildren: () =>
      import('./fx-transactions/fx-transactions.module').then(
        (m) => m.FxTransactionsModule
      )
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PocLiquidityRoutingModule {}
