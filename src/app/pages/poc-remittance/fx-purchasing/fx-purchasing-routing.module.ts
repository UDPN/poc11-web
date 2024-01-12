/*
 * @Author: zhangxuefeng
 * @Date: 2023-10-17 10:48:53
 * @LastEditors: zhangxuefeng
 * @LastEditTime: 2023-10-30 14:43:50
 * @Description:
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FxPurchasingComponent } from './fx-purchasing.component';

const routes: Routes = [
  {
    path: '',
    component: FxPurchasingComponent,
    data: { title: 'fxPurchasing', key: 'fx-purchasing', shouldDetach: 'no' }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FxPurchasingRoutingModule {}
