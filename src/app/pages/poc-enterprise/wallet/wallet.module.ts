/*
 * @Author: chenyuting
 * @Date: 2025-01-15 13:41:47
 * @LastEditors: chenyuting
 * @LastEditTime: 2025-01-22 17:57:18
 * @Description:
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { WalletComponent } from './wallet.component';
import { WalletRoutingModule } from './wallet-routing.module';
import { InfoComponent } from './info/info.component';
import { BasicInfoComponent } from './components/basic-info/basic-info.component';
import { TimelineComponent } from './components/timeline/timeline.component';

@NgModule({
  declarations: [
    WalletComponent,
    InfoComponent,
    TimelineComponent,
    BasicInfoComponent
  ],
  imports: [CommonModule, SharedModule, WalletRoutingModule]
})
export class WalletModule {}
