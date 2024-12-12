/*
 * @Author: chenyuting
 * @Date: 2024-12-11 13:48:47
 * @LastEditors: chenyuting
 * @LastEditTime: 2024-12-11 13:49:39
 * @Description: 
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'bank-account', pathMatch: 'full' },
  {
    path: 'bank-account',
    data: { preload: true },
    loadChildren: () => import('./bank-account/bank-account.module').then(m => m.BankAccountModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PocBankAccountRoutingModule { }