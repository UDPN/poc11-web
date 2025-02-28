/*
 * @Author: chenyuting
 * @Date: 2024-12-09 15:40:45
 * @LastEditors: chenyuting
 * @LastEditTime: 2024-12-10 10:52:10
 * @Description: 
 */
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { PocRemittanceRoutingModule } from './poc-remittance-routing.module';

@NgModule({
  declarations: [],
  imports: [SharedModule, PocRemittanceRoutingModule],
})
export class PocRemittanceModule {}
