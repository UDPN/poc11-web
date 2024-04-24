import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'fx-rate', pathMatch: 'full' },
  {
    path: 'fx-rate',
    data: { preload: true },
    loadChildren: () => import('./fx-rate/fx-rate.module').then(m => m.FxRateModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PocFxRateRoutingModule { }
