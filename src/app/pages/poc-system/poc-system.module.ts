import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { PocSystemRoutingModule } from './poc-system-routing.module';


@NgModule({
  imports: [SharedModule, PocSystemRoutingModule],
})
export class PocSystemModule {}
