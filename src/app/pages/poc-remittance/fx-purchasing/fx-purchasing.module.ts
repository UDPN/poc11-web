import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { FxPurchasingComponent } from './fx-purchasing.component';
import { FxPurchasingRoutingModule } from './fx-purchasing-routing.module';

@NgModule({
  declarations: [FxPurchasingComponent],
  imports: [CommonModule, SharedModule, FxPurchasingRoutingModule]
})
export class FxPurchasingModule {}
