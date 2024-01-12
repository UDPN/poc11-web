import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { PocFxRateHistoryRoutingModule } from './poc-fx-rate-history-routing.module';
import { FxRateHistoryComponent } from './fx-rate-history/fx-rate-history.component';

@NgModule({
  declarations: [FxRateHistoryComponent],
  imports: [SharedModule, PocFxRateHistoryRoutingModule],
})
export class PocFxRateHistoryModule {}
