/*
 * @Author: zhangxuefeng
 * @Date: 2023-10-17 10:48:53
 * @LastEditors: zhangxuefeng
 * @LastEditTime: 2023-10-30 14:43:50
 * @Description:
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActionCode } from '@app/config/actionCode';
import { CbdcWalletComponent } from './cbdc-wallet.component';
import { InfoComponent } from './info/info.component';
import { AddComponent } from './add/add.component';

const routes: Routes = [
  {
    path: '',
    component: CbdcWalletComponent,
    data: { title: 'CbdcWallet', key: 'cbdc-wallet', shouldDetach: 'no' }
  },
  {
    path: 'info',
    component: InfoComponent,
    data: {
      title: 'CbdcWalletInfo',
      key: 'cbdc-wallet-info',
      authCode: ActionCode.TabsDetail,
      shouldDetach: 'no'
    }
  },
  {
    path: 'add',
    component: AddComponent,
    data: {
      title: 'CbdcWalletAdd',
      key: 'cbdc-wallet-add',
      authCode: ActionCode.TabsDetail,
      shouldDetach: 'no'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CbdcWalletRoutingModule {}
