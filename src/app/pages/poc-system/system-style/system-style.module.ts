import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { SystemStyleComponent } from './system-style.component';
import { SystemStyleRoutingModule } from './system-style-routing.module';


@NgModule({
  declarations: [SystemStyleComponent],
  imports: [
    SharedModule,
    SystemStyleRoutingModule
  ]
})
export class SystemStyleModule { }
