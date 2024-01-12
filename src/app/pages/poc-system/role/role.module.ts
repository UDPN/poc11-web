import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { AddComponent } from './add/add.component';
import { InfoComponent } from './info/info.component';
import { RoleRoutingModule } from './role-routing.module';
import { RoleComponent } from './role.component';


@NgModule({
  declarations: [RoleComponent, AddComponent, InfoComponent],
  imports: [
    SharedModule,
    RoleRoutingModule
  ]
})
export class RoleModule { }
