/*
 * @Author: chenyuting
 * @Date: 2024-12-10 17:23:08
 * @LastEditors: chenyuting
 * @LastEditTime: 2024-12-13 13:43:23
 * @Description: 
 */
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
import { ExportComponent } from './export/export.component';
import { InfoComponent } from './info/info.component';



@NgModule({
  declarations: [StatementsComponent, InfoComponent, ExportComponent],
  imports: [CommonModule, SharedModule, StatementsRoutingModule]
})
export class StatementsModule {}
