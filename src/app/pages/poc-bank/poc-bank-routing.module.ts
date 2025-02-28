/*
 * @Author: chenyuting
 * @Date: 2024-12-09 15:40:45
 * @LastEditors: chenyuting
 * @LastEditTime: 2024-12-11 10:32:56
 * @Description: 
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'bank', pathMatch: 'full' },
  {
    path: 'bank',
    data: { preload: true },
    loadChildren: () => import('./bank/bank.module').then(m => m.BankModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PocBankRoutingModule { }
