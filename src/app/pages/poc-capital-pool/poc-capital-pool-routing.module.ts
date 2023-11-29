import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'capital-pool', pathMatch: 'full' },
  {
    path: 'capital-pool',
    data: { preload: true },
    loadChildren: () =>
      import('./capital-pool/capital-pool.module').then(
        (m) => m.CapitalPoolModule
      )
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PocCapitalPoolRoutingModule {}
