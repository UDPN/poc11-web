/*
 * @Author: zhangxuefeng
 * @Date: 2023-10-17 10:48:53
 * @LastEditors: zhangxuefeng
 * @LastEditTime: 2023-10-30 14:54:20
 * @Description:
 */
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { PocCapitalPoolRoutingModule } from './poc-capital-pool-routing.module';
import { CapitalPoolComponent } from './capital-pool/capital-pool.component';

@NgModule({
  declarations: [],
  imports: [SharedModule, PocCapitalPoolRoutingModule]
})
export class PocCapitalPoolModule {}
