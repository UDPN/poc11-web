/*
 * @Author: chenyuting
 * @Date: 2024-12-11 10:31:37
 * @LastEditors: chenyuting
 * @LastEditTime: 2024-12-11 10:38:08
 * @Description: 
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'download-center', pathMatch: 'full' },
  {
    path: 'download-center',
    data: { preload: true },
    loadChildren: () => import('./download-center/download-center.module').then(m => m.DownloadCenterModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PocDownloadCenterRoutingModule { }