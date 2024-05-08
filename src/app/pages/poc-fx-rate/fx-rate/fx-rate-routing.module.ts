/*
 * @Author: chenyuting
 * @Date: 2024-04-18 15:13:38
 * @LastEditors: chenyuting
 * @LastEditTime: 2024-04-18 15:16:21
 * @Description: 
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActionCode } from '@app/config/actionCode';
import { FxRateComponent } from './fx-rate.component';

const routes: Routes = [{ path: '', component: FxRateComponent, data: { newTab: 'true', authCode: ActionCode.TabsDetail, title: 'FxRate', key: 'fx-rate', shouldDetach: 'no' } }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FxRateRoutingModule { }
