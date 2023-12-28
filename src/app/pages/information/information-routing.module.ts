/*
 * @Author: zhangxuefeng
 * @Date: 2023-10-17 13:27:53
 * @LastEditors: zhangxuefeng
 * @LastEditTime: 2023-12-28 19:41:01
 * @Description:
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InfomationGuard } from '@app/core/services/common/guard/information.guard';
import { DeatilsGuard } from '@app/core/services/common/guard/informationDeatil.guard';

const routes: Routes = [
  { path: '', redirectTo: 'detail', pathMatch: 'full' },
  {
    path: 'form',
    canActivate: [InfomationGuard],
    loadChildren: () => import('./form/form.module').then((m) => m.FormModule)
  },
  {
    path: 'detail',
    canActivate: [DeatilsGuard],
    loadChildren: () =>
      import('./detail/detail.module').then((m) => m.DetailModule)
  },
  {
    path: 'edit',
    canActivate: [InfomationGuard],
    loadChildren: () => import('./edit/edit.module').then((m) => m.EditModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InformationRoutingModule {}
