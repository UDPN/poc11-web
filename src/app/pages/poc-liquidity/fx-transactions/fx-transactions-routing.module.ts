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
import { InfoComponent } from './info/info.component';
import { ActionCode } from '@app/config/actionCode';

const routes: Routes = [
  {
    path: '',
    component: FxTransactionsComponent,
    data: {
      title: 'liquidityFxTransactions',
      key: 'liquidity-fx-transactions',
      shouldDetach: 'no'
    }
  },
  {
    path: 'info',
    component: InfoComponent,
    data: {
      title: 'walletInfo',
      key: 'wallet-info',
      authCode: ActionCode.TabsDetail,
      shouldDetach: 'no'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FxTransactionsRoutingModule {}
