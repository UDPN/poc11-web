import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginGuard } from '@app/core/services/common/guard/login.guard';

import { LoginComponent } from './login.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    data: { key: 'login', shouldDetach: 'no' },
    canActivateChild: [LoginGuard],
    children: [
      { path: '', redirectTo: '/login/login-modify', pathMatch: 'full' },
      {
        path: 'login-modify',
        loadChildren: () => import('./login-modify/login-modify-routing.module').then(m => m.LoginModifyRoutingModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule {}
