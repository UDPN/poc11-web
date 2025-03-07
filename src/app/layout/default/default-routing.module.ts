import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { JudgeAuthGuard } from '@core/services/common/guard/judgeAuth.guard';
import { JudgeLoginGuard } from '@core/services/common/guard/judgeLogin.guard';
import { DefaultComponent } from './default.component';
import { DeatilsGuardChild } from '@app/core/services/common/guard/informationChild.guard';

const routes: Routes = [
  {
    path: '',
    component: DefaultComponent,
    data: { shouldDetach: 'no', preload: true },
    canActivateChild: [JudgeLoginGuard, JudgeAuthGuard, DeatilsGuardChild],
    children: [
      { path: '', redirectTo: 'poc-home', pathMatch: 'full' },
      {
        path: 'poc-home',
        data: { preload: true },
        loadChildren: () =>
          import('../../pages/poc-home/poc-home.module').then(
            (m) => m.PocHomeModule
          )
      },
      {
        path: 'poc-profile',
        data: { preload: true },
        loadChildren: () =>
          import('../../pages/poc-profile/poc-profile.module').then(
            (m) => m.PocProfileModule
          )
      },
      {
        path: 'poc-fx-rate-history',
        data: { preload: true },
        loadChildren: () =>
          import(
            '../../pages/poc-fx-rate-history/poc-fx-rate-history.module'
          ).then((m) => m.PocFxRateHistoryModule)
      },
      {
        path: 'poc-bank',
        data: { preload: true },
        loadChildren: () =>
          import('../../pages/poc-bank/poc-bank.module').then(
            (m) => m.PocBankModule
          )
      },
      {
        path: 'poc-fx-rate',
        data: { preload: true },
        loadChildren: () =>
          import('../../pages/poc-fx-rate/poc-fx-rate.module').then(
            (m) => m.PocFxRateModule
          )
      },
      {
        path: 'poc-fx-transactions',
        data: { preload: true },
        loadChildren: () =>
          import(
            '../../pages/poc-fx-transactions/poc-fx-transactions.module'
          ).then((m) => m.PocFxTransactionsModule)
      },
      {
        path: 'poc-capital-pool',
        data: { preload: true },
        loadChildren: () =>
          import('../../pages/poc-capital-pool/poc-capital-pool.module').then(
            (m) => m.PocCapitalPoolModule
          )
      },
      {
        path: 'poc-settlement',
        data: { preload: true },
        loadChildren: () =>
          import('../../pages/poc-settlement/poc-settlement.module').then(
            (m) => m.PocSettlementModule
          )
      },
      {
        path: 'poc-system',
        data: { preload: true },
        loadChildren: () =>
          import('../../pages/poc-system/poc-system.module').then(
            (m) => m.PocSystemModule
          )
      },
      {
        path: 'poc-activate-settlement',
        data: { preload: true },
        loadChildren: () =>
          import(
            '../../pages/poc-activate-settlement/poc-activate-settlement.module'
          ).then((m) => m.PocActivateSettlementModule)
      },
      {
        path: 'poc-wallet',
        data: { preload: true },
        loadChildren: () =>
          import('../../pages/poc-wallet/poc-wallet.module').then(
            (m) => m.PocWalletModule
          )
      },
      {
        path: 'poc-remittance',
        data: { preload: true },
        loadChildren: () =>
          import('../../pages/poc-remittance/poc-remittance.module').then(
            (m) => m.PocRemittanceModule
          )
      },
      {
        path: 'poc-onboard',
        data: { preload: true },
        loadChildren: () =>
          import('../../pages/poc-onboard/poc-onboard.module').then(
            (m) => m.PocSpOnboardModule
          )
      },
      {
        path: 'poc-financial',
        data: { preload: true },
        loadChildren: () =>
          import('../../pages/poc-financial/poc-financial.module').then(
            (m) => m.PocFinancialModule
          )
      },
      {
        path: 'poc-download-center',
        data: { preload: true },
        loadChildren: () =>
          import(
            '../../pages/poc-download-center/poc-download-center.module'
          ).then((m) => m.PocDownloadCenterModule)
      },
      {
        path: 'poc-bank-account',
        data: { preload: true },
        loadChildren: () =>
          import('../../pages/poc-bank-account/poc-bank-account.module').then(
            (m) => m.PocBankAccountModule
          )
      },
      {
        path: 'poc-notifications',
        data: { preload: true },
        loadChildren: () =>
          import('../../pages/poc-notifications/poc-notifications.module').then(
            (m) => m.PocNotificationsModule
          )
      },
      {
        path: 'poc-access-key',
        data: { preload: true },
        loadChildren: () =>
          import('../../pages/poc-access-key/poc-access-key.module').then(
            (m) => m.PocAccessKeyModule
          )
      },
      {
        path: 'poc-enterprise',
        data: { preload: true },
        loadChildren: () =>
          import('../../pages/poc-enterprise/poc-enterprise.module').then(
            (m) => m.PocEnterpriseModule
          )
      },
      {
        path: 'poc-liquidity',
        data: { preload: true },
        loadChildren: () =>
          import('../../pages/poc-liquidity/poc-liquidity.module').then(
            (m) => m.PocLiquidityModule
          )
      },
      {
        path: 'system',
        loadChildren: () =>
          import('../../pages/system/system.module').then((m) => m.SystemModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DefaultRoutingModule {}
