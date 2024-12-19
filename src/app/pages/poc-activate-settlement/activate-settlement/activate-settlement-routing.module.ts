/*
 * @Author: chenyuting
 * @Date: 2024-12-09 15:40:52
 * @LastEditors: chenyuting
 * @LastEditTime: 2024-12-18 15:02:49
 * @Description: 
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivateSettlementComponent } from './activate-settlement.component';
import { InfoComponent } from './info/info.component';
import { ActionCode } from '@app/config/actionCode';

const routes: Routes = [
  {
    path: '', component: ActivateSettlementComponent, data: { title: 'activateSettlement', key: 'activate-settlement', shouldDetach: 'no' }
  },
  {
    path: 'info', component: InfoComponent, data: { title: 'CapitalPoolInfo', key: 'capital-pool-info', authCode: ActionCode.TabsDetail, shouldDetach: 'no' }
  },
  // { path: '**', redirectTo: '/poc/poc-activate-settlement/activate-settlement/info' }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActivateSettlementRoutingModule { }
