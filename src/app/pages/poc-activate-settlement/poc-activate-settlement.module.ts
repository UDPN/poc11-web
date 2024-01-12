/*
 * @Author: zhangxuefeng
 * @Date: 2023-10-17 10:48:53
 * @LastEditors: zhangxuefeng
 * @LastEditTime: 2023-10-30 14:54:20
 * @Description:
 */
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { PocActivateSettlementRoutingModule } from './poc-activate-settlement-routing.module';
import { PocCapitalPoolModule } from '../poc-capital-pool/poc-capital-pool.module';
import { PocCapitalPoolRoutingModule } from '../poc-capital-pool/poc-capital-pool-routing.module';

@NgModule({
  declarations: [],
  imports: [SharedModule, PocActivateSettlementRoutingModule]
})
export class PocActivateSettlementModule {}
