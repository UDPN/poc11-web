import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'information', pathMatch: 'full' },
  {
    path: 'information',
    data: { preload: true },
    loadChildren: () => import('./sp-infomation/sp-infomation.module').then(m => m.SpInfomationModule)
  },
  {
    path: 'details',
    data: { preload: true },
    loadChildren: () => import('./sp-details/sp-details.module').then(m => m.SpDetailsModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PocSpOnboardRoutingModule { }
