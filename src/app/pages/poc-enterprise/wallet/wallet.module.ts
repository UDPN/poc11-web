/*
 * @Author: chenyuting
 * @Date: 2025-01-15 13:41:47
 * @LastEditors: chenyuting
 * @LastEditTime: 2025-01-20 16:50:48
 * @Description:
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { WalletComponent } from './wallet.component';
import { WalletRoutingModule } from './wallet-routing.module';
import { InfoComponent } from './info/info.component';
import { TimelineComponent } from '../components/timeline.component';
import { BasicInfoComponent } from './components/basic-info.component';

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
