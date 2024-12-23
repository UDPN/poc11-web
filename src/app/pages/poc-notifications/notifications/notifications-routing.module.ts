/*
 * @Author: chenyuting
 * @Date: 2024-12-09 15:40:52
 * @LastEditors: chenyuting
 * @LastEditTime: 2024-12-23 11:27:36
 * @Description: 
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActionCode } from '@app/config/actionCode';
import { NotificationsComponent } from './notifications.component';

const routes: Routes = [
  {
    path: '', component: NotificationsComponent, data: { title: 'notifications', key: 'notifications', shouldDetach: 'no' }
  },
//   {
//     path: 'info', component: InfoComponent, data: { title: 'CapitalPoolInfo', key: 'capital-pool-info', authCode: ActionCode.TabsDetail, shouldDetach: 'no' }
//   },
  // { path: '**', redirectTo: '/poc/poc-activate-settlement/activate-settlement/info' }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificationsRoutingModule { }
