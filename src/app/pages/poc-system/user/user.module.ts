import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { AddComponent } from './add/add.component';
import { InfoComponent } from './info/info.component';
import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';


@NgModule({
  declarations: [UserComponent, AddComponent, InfoComponent],
  imports: [
    SharedModule,
    UserRoutingModule
  ]
})
export class UserModule { }
