/*
 * @Author: chenyuting
 * @Date: 2025-01-15 13:30:30
 * @LastEditors: chenyuting
 * @LastEditTime: 2025-01-15 14:17:09
 * @Description:
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'enterprise-onboarding', pathMatch: 'full' },
  {
    path: 'enterprise-onboarding',
    data: { preload: true },
    loadChildren: () =>
      import('./enterprise-onboarding/enterprise-onboarding.module').then(
        (m) => m.EnterpriseOnboardingModule
      )
  },
  {
    path: 'wallet',
    data: { preload: true },
    loadChildren: () =>
      import('./wallet/wallet.module').then((m) => m.WalletModule)
  },
  {
    path: 'top-up-withdraw',
    data: { preload: true },
    loadChildren: () =>
      import('./top-up-withdraw/top-up-withdraw.module').then(
        (m) => m.TopUpWithdrawModule
      )
  },
  {
    path: 'transactions',
    data: { preload: true },
    loadChildren: () =>
      import('./transactions/transactions.module').then(
        (m) => m.TransactionsModule
      )
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PocEnterpriseRoutingModule {}
