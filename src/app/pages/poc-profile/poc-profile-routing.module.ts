import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'foreign-exchange-apply', pathMatch: 'full' },
  {
    path: 'foreign-exchange-apply',
    data: { preload: true },
    loadChildren: () => import('./foreign-exchange-apply/foreign-exchange-apply.module').then(m => m.ForeignExchangeApplyModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PocProfileRoutingModule { }
