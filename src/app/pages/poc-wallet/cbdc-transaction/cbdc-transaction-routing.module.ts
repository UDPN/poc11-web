/*
 * @Author: zhangxuefeng
 * @Date: 2023-10-17 10:48:53
 * @LastEditors: chenyuting
 * @LastEditTime: 2025-01-06 12:29:38
 * @Description:
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActionCode } from '@app/config/actionCode';
import { CbdcTransactionComponent } from './cbdc-transaction.component';
import { InfoComponent } from './info/info.component';

const routes: Routes = [
  {
    path: '',
    component: CbdcTransactionComponent,
    data: {
      title: 'CbdcTransaction',
      key: 'cbdc-transaction',
      authCode: ActionCode.TabsDetail,
      shouldDetach: 'no'
    }
  },
  {
    path: 'info',
    component: InfoComponent,
    data: {
      title: 'CapitalPoolInfo',
      key: 'capital-pool-info',
      authCode: ActionCode.TabsDetail,
      shouldDetach: 'no'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CbdcTransactionRoutingModule {}
