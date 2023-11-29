import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { LoginModifyComponent } from './login-modify/login-modify.component';
import { NormalLoginComponent } from './login-modify/normal-login/normal-login.component';

@NgModule({
  declarations: [LoginComponent, LoginModifyComponent,NormalLoginComponent],
  imports: [SharedModule, LoginRoutingModule],
})
export class LoginModule {}
