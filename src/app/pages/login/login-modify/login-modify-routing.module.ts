import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginModifyComponent } from './login-modify.component';

const routes: Routes = [{ path: '', data: { key: 'login-modify', shouldDetach: 'no' }, component: LoginModifyComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginModifyRoutingModule { }
