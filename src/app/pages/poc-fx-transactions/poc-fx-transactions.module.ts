import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { PocFxTransactionsRoutingModule } from './poc-fx-transactions-routing.module';
import { FxTransactionsComponent } from './fx-transactions/fx-transactions.component';
import { InfoComponent } from './fx-transactions/info/info.component';

@NgModule({
  declarations: [FxTransactionsComponent, InfoComponent],
  imports: [SharedModule, PocFxTransactionsRoutingModule],
})
export class PocFxTransactionsModule {}
