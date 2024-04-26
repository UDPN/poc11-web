/*
 * @Author: chenyuting
 * @Date: 2024-04-18 15:12:10
 * @LastEditors: chenyuting
 * @LastEditTime: 2024-04-18 15:22:47
 * @Description: 
 */
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { BankComponent } from './bank/bank.component';
import { PocBankRoutingModule } from './poc-bank-routing.module';

@NgModule({
  declarations: [BankComponent],
  imports: [SharedModule, PocBankRoutingModule],
})
export class PocBankModule {}
