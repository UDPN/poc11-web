import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { PocSpOnboardRoutingModule } from './poc-onboard-routing.module';
import { SpInfomationComponent } from './sp-infomation/sp-infomation.component';
import { SpDetailsComponent } from './sp-details/sp-details.component';

@NgModule({
  declarations: [SpInfomationComponent, SpDetailsComponent],
  imports: [SharedModule, PocSpOnboardRoutingModule],
})
export class PocSpOnboardModule {}
