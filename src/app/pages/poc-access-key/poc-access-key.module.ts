import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { PocAccessKeyRoutingModule } from './poc-access-key-routing.module';
import { AccessKeyComponent } from './access-key/access-key.component';

@NgModule({
  declarations: [AccessKeyComponent],
  imports: [SharedModule, PocAccessKeyRoutingModule]
})
export class PocAccessKeyModule {}
