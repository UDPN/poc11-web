import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'transfer', pathMatch: 'full' },
  {
    path: 'transfer',
    data: { preload: true },
    loadChildren: () => import('./transfer/transfer.module').then(m => m.TransferModule)
  },
  {
    path: 'fx-purchasing',
    data: { preload: true },
    loadChildren: () => import('./fx-purchasing/fx-purchasing.module').then(m => m.FxPurchasingModule)
  },
  {
    path: 'transaction-record',
    data: { preload: true },
    loadChildren: () => import('./transaction-record/transaction-record.module').then(m => m.TransactionRecordModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PocRemittanceRoutingModule { }
