/*
 * @Author: zhangxuefeng
 * @Date: 2023-10-17 13:27:53
 * @LastEditors: zhangxuefeng
 * @LastEditTime: 2023-10-21 12:18:33
 * @Description:
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'detail', pathMatch: 'full' },
  {
    path: 'form',
    loadChildren: () => import('./form/form.module').then((m) => m.FormModule)
  },
  {
    path: 'detail',
    loadChildren: () =>
      import('./detail/detail.module').then((m) => m.DetailModule)
  },
  {
    path: 'edit',
    loadChildren: () => import('./edit/edit.module').then((m) => m.EditModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InformationRoutingModule {}
