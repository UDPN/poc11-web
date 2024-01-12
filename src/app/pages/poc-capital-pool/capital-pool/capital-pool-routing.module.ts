/*
 * @Author: zhangxuefeng
 * @Date: 2023-10-17 10:48:53
 * @LastEditors: zhangxuefeng
 * @LastEditTime: 2023-10-30 14:43:50
 * @Description:
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CapitalPoolComponent } from './capital-pool.component';
import { ActionCode } from '@app/config/actionCode';
import { AddComponent } from './add/add.component';
import { InfoComponent } from './info/info.component';
import { ReduceComponent } from './reduce/reduce.component';

const routes: Routes = [
  {
    path: '',
    component: CapitalPoolComponent,
    data: { title: 'CapitalPool', key: 'capital-pool', shouldDetach: 'no' }
  },
  {
    path: 'add',
    component: AddComponent,
    data: {
      title: 'CapitalPoolAdd',
      key: 'capital-pool-add',
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
  },
  {
    path: 'reduce',
    component: ReduceComponent,
    data: {
      title: 'CapitalPoolReduce',
      key: 'capital-pool-reduce',
      authCode: ActionCode.TabsDetail,
      shouldDetach: 'no'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CapitalPoolRoutingModule {}
