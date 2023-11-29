/*
 * @Author: zhangxuefeng
 * @Date: 2023-10-23 11:03:54
 * @LastEditors: zhangxuefeng
 * @LastEditTime: 2023-10-30 15:33:15
 * @Description:
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { ForeignExchangeApplyRoutingModule } from './foreign-exchange-apply-routing.module';
import { InfoComponent } from './info/info.component';
import { AddComponent } from './add/add.component';

import { CurrencyForeignFixComponent } from './components/currencyForeignFix/currency-foreign-fix.component';
import { CurrencyCapitalFixComponent } from './components/currencyCapitalFix/currency-capital-fix.component';
import { ReduceComponent } from './reduce/reduce.component';

@NgModule({
  declarations: [
    InfoComponent,
    AddComponent,
    CurrencyForeignFixComponent,
    CurrencyCapitalFixComponent,
    ReduceComponent
  ],
  imports: [CommonModule, SharedModule, ForeignExchangeApplyRoutingModule]
})
export class ForeignExchangeApplyModule {}
