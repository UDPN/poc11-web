/*
 * @Author: chenyuting
 * @Date: 2025-01-15 13:41:47
 * @LastEditors: chenyuting
 * @LastEditTime: 2025-01-15 13:44:40
 * @Description:
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { WalletComponent } from './wallet.component';
import { WalletRoutingModule } from './wallet-routing.module';
import { InfoComponent } from './info/info.component';

@NgModule({
  declarations: [WalletComponent, InfoComponent],
  imports: [CommonModule, SharedModule, WalletRoutingModule]
})
export class WalletModule {}
