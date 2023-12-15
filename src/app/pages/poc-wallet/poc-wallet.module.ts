/*
 * @Author: zhangxuefeng
 * @Date: 2023-10-17 10:48:53
 * @LastEditors: zhangxuefeng
 * @LastEditTime: 2023-10-30 14:54:20
 * @Description:
 */
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { PocWalletRoutingModule } from './poc-wallet-routing.module';

@NgModule({
  declarations: [],
  imports: [SharedModule, PocWalletRoutingModule]
})
export class PocWalletModule {}
