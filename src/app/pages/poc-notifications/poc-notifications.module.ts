/*
 * @Author: chenyuting
 * @Date: 2024-12-23 11:22:04
 * @LastEditors: chenyuting
 * @LastEditTime: 2024-12-23 11:25:54
 * @Description: 
 */

import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { PocNotificationsRoutingModule } from './poc-notifications-routing.module';

@NgModule({
  declarations: [],
  imports: [SharedModule, PocNotificationsRoutingModule]
})
export class PocNotificationsModule {}
