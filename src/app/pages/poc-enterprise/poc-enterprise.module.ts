import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { PocEnterpriseRoutingModule } from './poc-enterprise-routing.module';
import { TimelineComponent } from './components/timeline.component';

@NgModule({
  declarations: [],
  imports: [SharedModule, PocEnterpriseRoutingModule]
})
export class PocEnterpriseModule {}
