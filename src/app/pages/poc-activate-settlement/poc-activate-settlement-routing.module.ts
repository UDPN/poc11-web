import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'activate-settlement', pathMatch: 'full' },
  {
    path: 'activate-settlement',
    data: { preload: true },
    loadChildren: () =>
      import('./activate-settlement/activate-settlement.module').then(
        (m) => m.ActivateSettlementModule
      )
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PocActivateSettlementRoutingModule {}
