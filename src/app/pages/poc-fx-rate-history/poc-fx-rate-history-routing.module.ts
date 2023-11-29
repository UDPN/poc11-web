import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'fx-rate-history', pathMatch: 'full' },
  {
    path: 'fx-rate-history',
    data: { preload: true },
    loadChildren: () => import('./fx-rate-history/fx-rate-history.module').then(m => m.FxRateHistoryModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PocFxRateHistoryRoutingModule { }
