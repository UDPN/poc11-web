/*
 * @Author: chenyuting
 * @Date: 2025-01-15 13:41:47
 * @LastEditors: chenyuting
 * @LastEditTime: 2025-01-16 16:24:11
 * @Description:
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { TopUpWithdrawComponent } from './top-up-withdraw.component';
import { TopUpWithdrawRoutingModule } from './top-up-withdraw-routing.module';
import { InfoComponent } from './info/info.component';

@NgModule({
  declarations: [TopUpWithdrawComponent, InfoComponent],
  imports: [CommonModule, SharedModule, TopUpWithdrawRoutingModule]
})
export class TopUpWithdrawModule {}
