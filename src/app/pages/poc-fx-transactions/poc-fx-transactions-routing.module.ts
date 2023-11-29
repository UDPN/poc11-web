import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'fx-transactions', pathMatch: 'full' },
  {
    path: 'fx-transactions',
    data: { preload: true },
    loadChildren: () => import('./fx-transactions/fx-transactions.module').then(m => m.FxTransactionsModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PocFxTransactionsRoutingModule { }
