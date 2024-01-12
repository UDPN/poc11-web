/*
 * @Author: zhangxuefeng
 * @Date: 2023-10-17 13:41:05
 * @LastEditors: zhangxuefeng
 * @LastEditTime: 2023-10-17 16:40:23
 * @Description:
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormInformationComponent } from './form.component';
const routes: Routes = [
  {
    path: '',
    component: FormInformationComponent,
    data: {
      title: 'informationForm',
      key: 'information-form',
      shouldDetach: 'no'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormRoutingModule {}
