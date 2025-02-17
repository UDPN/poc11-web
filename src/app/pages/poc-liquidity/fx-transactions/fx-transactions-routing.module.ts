/*
 * @Author: chenyuting
 * @Date: 2025-02-17 10:18:22
 * @LastEditors: chenyuting
 * @LastEditTime: 2025-02-17 10:20:08
 * @Description:
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FxTransactionsComponent } from './fx-transactions.component';

const routes: Routes = [
  {
    path: '',
    component: FxTransactionsComponent,
    data: {
      title: 'liquidityFxTransactions',
      key: 'liquidity-fx-transactions',
      shouldDetach: 'no'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FxTransactionsRoutingModule {}
