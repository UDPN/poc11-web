import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'settlement', pathMatch: 'full' },
  {
    path: 'settlement',
    data: { preload: true },
    loadChildren: () => import('./settlement/settlement.module').then(m => m.SettlementModule)
  },
  {
    path: 'billing',
    data: { preload: true },
    loadChildren: () => import('./bill/bill.module').then(m => m.BillModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PocSettlementRoutingModule { }
