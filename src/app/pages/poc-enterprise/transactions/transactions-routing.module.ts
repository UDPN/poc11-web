/*
 * @Author: zhangxuefeng
 * @Date: 2023-10-17 10:48:53
 * @LastEditors: chenyuting
 * @LastEditTime: 2025-01-15 14:16:46
 * @Description:
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActionCode } from '@app/config/actionCode';
import { InfoComponent } from './info/info.component';
import { TransactionsComponent } from './transactions.component';

const routes: Routes = [
  {
    path: '',
    component: TransactionsComponent,
    data: {
      title: 'Transactions',
      key: 'transactions',
      shouldDetach: 'no'
    }
  },
  {
    path: 'info',
    component: InfoComponent,
    data: {
      title: 'transactionsInfo',
      key: 'transactions-info',
      authCode: ActionCode.TabsDetail,
      shouldDetach: 'no'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionsRoutingModule {}
