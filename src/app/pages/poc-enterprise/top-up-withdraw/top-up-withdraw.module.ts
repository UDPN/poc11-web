/*
 * @Author: chenyuting
 * @Date: 2025-01-15 13:41:47
 * @LastEditors: chenyuting
 * @LastEditTime: 2025-01-23 09:52:52
 * @Description:
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { TopUpWithdrawComponent } from './top-up-withdraw.component';
import { TopUpWithdrawRoutingModule } from './top-up-withdraw-routing.module';
import { InfoComponent } from './info/info.component';
import { TimelineComponent } from './components/timeline/timeline.component';

@NgModule({
  declarations: [TopUpWithdrawComponent, InfoComponent, TimelineComponent],
  imports: [CommonModule, SharedModule, TopUpWithdrawRoutingModule]
})
export class TopUpWithdrawModule {}
