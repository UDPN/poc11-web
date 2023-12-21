import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'user', pathMatch: 'full' },
  {
    path: 'user',
    data: { preload: true },
    loadChildren: () => import('./user/user.module').then(m => m.UserModule)
  },
  {
    path: 'role',
    loadChildren: () => import('./role/role.module').then(m => m.RoleModule)
  },
  {
    path: 'information-modify',
    data: { preload: true },
    loadChildren: () => import('./information-modify/information-modify.module').then(m => m.InformationModifyModule)
  },
  {
    path: 'system-style',
    data: { preload: true },
    loadChildren: () => import('./system-style/system-style.module').then(m => m.SystemStyleModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PocSystemRoutingModule { }
