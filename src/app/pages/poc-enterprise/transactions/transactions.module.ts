/*
 * @Author: chenyuting
 * @Date: 2025-01-15 13:41:47
 * @LastEditors: chenyuting
 * @LastEditTime: 2025-02-26 15:41:05
 * @Description:
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { TransactionsComponent } from './transactions.component';
import { TransactionsRoutingModule } from './transactions-routing.module';
import { InfoComponent } from './info/info.component';
import { TimelineComponent } from './components/timeline/timeline.component';

@NgModule({
  declarations: [TransactionsComponent, InfoComponent, TimelineComponent],
  imports: [CommonModule, SharedModule, TransactionsRoutingModule]
})
export class TransactionsModule {}
