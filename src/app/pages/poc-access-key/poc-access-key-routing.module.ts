/*
 * @Author: chenyuting
 * @Date: 2024-12-27 13:37:29
 * @LastEditors: chenyuting
 * @LastEditTime: 2024-12-27 13:39:29
 * @Description:
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'access-key', pathMatch: 'full' },
  {
    path: 'access-key',
    data: { preload: true },
    loadChildren: () =>
      import('./access-key/access-key.module').then((m) => m.AccessKeyModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PocAccessKeyRoutingModule {}
