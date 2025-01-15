/*
 * @Author: zhangxuefeng
 * @Date: 2023-10-17 10:48:53
 * @LastEditors: chenyuting
 * @LastEditTime: 2025-01-15 13:44:03
 * @Description:
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActionCode } from '@app/config/actionCode';
import { InfoComponent } from './info/info.component';
import { WalletComponent } from './wallet.component';

const routes: Routes = [
  {
    path: '',
    component: WalletComponent,
    data: {
      title: 'Wallet',
      key: 'wallet',
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
export class WalletRoutingModule {}
