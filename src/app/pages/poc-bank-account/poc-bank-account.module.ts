/*
 * @Author: chenyuting
 * @Date: 2024-12-11 13:48:24
 * @LastEditors: chenyuting
 * @LastEditTime: 2024-12-11 13:52:55
 * @Description: 
 */
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { PocBankAccountRoutingModule } from './poc-bank-account-routing.module';
import { BankAccountComponent } from './bank-account/bank-account.component';

@NgModule({
  declarations: [BankAccountComponent],
  imports: [SharedModule, PocBankAccountRoutingModule],
})
export class PocBankAccountModule {}