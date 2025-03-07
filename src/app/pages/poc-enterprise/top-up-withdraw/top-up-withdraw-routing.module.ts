/*
 * @Author: zhangxuefeng
 * @Date: 2023-10-17 10:48:53
 * @LastEditors: chenyuting
 * @LastEditTime: 2025-01-15 14:11:13
 * @Description:
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActionCode } from '@app/config/actionCode';
import { InfoComponent } from './info/info.component';
import { TopUpWithdrawComponent } from './top-up-withdraw.component';

const routes: Routes = [
  {
    path: '',
    component: TopUpWithdrawComponent,
    data: {
      title: 'topUpWithdraw',
      key: 'top-up-withdraw',
      shouldDetach: 'no'
    }
  },
  {
    path: 'info',
    component: InfoComponent,
    data: {
      title: 'topUpWithdrawInfo',
      key: 'top-up-withdraw-info',
      authCode: ActionCode.TabsDetail,
      shouldDetach: 'no'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TopUpWithdrawRoutingModule {}
