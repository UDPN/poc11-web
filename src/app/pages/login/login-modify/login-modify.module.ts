import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginModifyRoutingModule } from './login-modify-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { LoginModifyComponent } from './login-modify.component';


@NgModule({
  declarations: [],
  imports: [
    SharedModule,
    LoginModifyRoutingModule
  ]
})
export class LoginModifyModule { }
