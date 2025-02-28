/*
 * @Author: chenyuting
 * @Date: 2025-01-20 14:59:21
 * @LastEditors: chenyuting
 * @LastEditTime: 2025-01-22 17:57:29
 * @Description:
 */
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { PocEnterpriseRoutingModule } from './poc-enterprise-routing.module';

@NgModule({
  declarations: [],
  imports: [SharedModule, PocEnterpriseRoutingModule]
})
export class PocEnterpriseModule {}
