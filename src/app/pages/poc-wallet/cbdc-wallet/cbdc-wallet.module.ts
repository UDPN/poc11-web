import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { CbdcWalletRoutingModule } from './cbdc-wallet-routing.module';
import { CbdcWalletComponent } from './cbdc-wallet.component';
import { InfoComponent } from './info/info.component';
import { AddComponent } from './add/add.component';

@NgModule({
  declarations: [CbdcWalletComponent, InfoComponent, AddComponent],
  imports: [CommonModule, SharedModule, CbdcWalletRoutingModule]
})
export class CbdcWalletModule {}
