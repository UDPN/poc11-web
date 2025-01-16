/*
 * @Author: chenyuting
 * @Date: 2025-01-15 13:41:47
 * @LastEditors: chenyuting
 * @LastEditTime: 2025-01-15 14:11:52
 * @Description:
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { TransactionsComponent } from './transactions.component';
import { TransactionsRoutingModule } from './transactions-routing.module';
import { InfoComponent } from './info/info.component';

@NgModule({
  declarations: [TransactionsComponent, InfoComponent],
  imports: [CommonModule, SharedModule, TransactionsRoutingModule]
})
export class TransactionsModule {}
