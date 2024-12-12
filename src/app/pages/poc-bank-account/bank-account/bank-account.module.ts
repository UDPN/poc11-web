/*
 * @Author: chenyuting
 * @Date: 2024-12-11 13:46:14
 * @LastEditors: chenyuting
 * @LastEditTime: 2024-12-11 13:51:27
 * @Description: 
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { BankAccountRoutingModule } from './bank-account-routing.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedModule,
    BankAccountRoutingModule
  ]
})
export class BankAccountModule { }