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
