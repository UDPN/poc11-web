/*
 * @Author: chenyuting
 * @Date: 2025-02-17 09:58:35
 * @LastEditors: chenyuting
 * @LastEditTime: 2025-02-17 10:25:57
 * @Description:
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { FxTransactionsRoutingModule } from './fx-transactions-routing.module';
import { FxTransactionsComponent } from './fx-transactions.component';

@NgModule({
  declarations: [FxTransactionsComponent],
  imports: [CommonModule, SharedModule, FxTransactionsRoutingModule]
})
export class FxTransactionsModule {}
