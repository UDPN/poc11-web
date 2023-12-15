import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'cbdc-wallet', pathMatch: 'full' },
  {
    path: 'cbdc-wallet',
    data: { preload: true },
    loadChildren: () =>
      import('./cbdc-wallet/cbdc-wallet.module').then(
        (m) => m.CbdcWalletModule
      )
  },
  {
    path: 'cbdc-transaction',
    data: { preload: true },
    loadChildren: () =>
      import('./cbdc-transaction/cbdc-transaction.module').then(
        (m) => m.CbdcTransactionModule
      )
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PocWalletRoutingModule { }
