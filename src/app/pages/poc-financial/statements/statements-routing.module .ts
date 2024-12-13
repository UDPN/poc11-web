/*
 * @Author: chenyuting
 * @Date: 2024-12-10 10:57:23
 * @LastEditors: chenyuting
 * @LastEditTime: 2024-12-13 13:41:32
 * @Description: 
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StatementsComponent } from './statements.component';
import { InfoComponent } from './info/info.component';
import { ActionCode } from '@app/config/actionCode';
import { ExportComponent } from './export/export.component';

const routes: Routes = [
  {
    path: '',
    component: StatementsComponent,
    data: { title: 'Statements', key: 'statements', shouldDetach: 'no' }
  },
  {
    path: 'info',
    component: InfoComponent,
    data: { newTab: 'true', authCode: ActionCode.TabsDetail, title: 'statementsInfo', key: 'statements-info', shouldDetach: 'no' }
  },
  {
    path: 'export',
    component: ExportComponent,
    data: { newTab: 'true', authCode: ActionCode.TabsDetail, title: 'statementsExport', key: 'statements-export', shouldDetach: 'no' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatementsRoutingModule { }
