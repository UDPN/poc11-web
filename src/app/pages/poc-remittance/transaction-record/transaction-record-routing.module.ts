/*
 * @Author: zhangxuefeng
 * @Date: 2023-10-17 10:48:53
 * @LastEditors: chenyuting
 * @LastEditTime: 2025-01-06 14:48:55
 * @Description:
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransactionRecordComponent } from './transaction-record.component';
import { InfoComponent } from './info/info.component';
import { ActionCode } from '@app/config/actionCode';

const routes: Routes = [
  {
    path: '',
    component: TransactionRecordComponent,
    data: {
      title: 'transactionRecord',
      key: 'transaction-record',
      authCode: ActionCode.TabsDetail,
      shouldDetach: 'no'
    }
  },
  {
    path: 'info',
    component: InfoComponent,
    data: {
      title: 'transactionRecord',
      key: 'transaction-record-info',
      authCode: ActionCode.TabsDetail,
      shouldDetach: 'no'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionRecordRoutingModule {}
