/*
 * @Author: chenyuting
 * @Date: 2024-12-10 10:56:38
 * @LastEditors: chenyuting
 * @LastEditTime: 2024-12-10 11:12:01
 * @Description: 
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { StatementsRoutingModule } from './statements-routing.module ';
import { StatementsComponent } from './statements.component';



@NgModule({
  declarations: [StatementsComponent],
  imports: [CommonModule, SharedModule, StatementsRoutingModule]
})
export class StatementsModule {}
