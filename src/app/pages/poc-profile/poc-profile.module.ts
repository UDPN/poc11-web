import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { PocProfileRoutingModule } from './poc-profile-routing.module';
import { ForeignExchangeApplyComponent } from './foreign-exchange-apply/foreign-exchange-apply.component';

@NgModule({
  declarations: [ForeignExchangeApplyComponent],
  imports: [SharedModule, PocProfileRoutingModule],
})
export class PocProfileModule {}
