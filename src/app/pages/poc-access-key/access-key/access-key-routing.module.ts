/*
 * @Author: chenyuting
 * @Date: 2024-12-09 15:40:52
 * @LastEditors: chenyuting
 * @LastEditTime: 2024-12-27 13:41:47
 * @Description:
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccessKeyComponent } from './access-key.component';

const routes: Routes = [
  {
    path: '',
    component: AccessKeyComponent,
    data: { title: 'AccessKey', key: 'accessKey', shouldDetach: 'no' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccessKeyRoutingModule {}
