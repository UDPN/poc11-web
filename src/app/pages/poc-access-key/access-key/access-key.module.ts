/*
 * @Author: chenyuting
 * @Date: 2024-12-27 13:40:11
 * @LastEditors: chenyuting
 * @LastEditTime: 2024-12-27 14:01:09
 * @Description:
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { AccessKeyRoutingModule } from './access-key-routing.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, SharedModule, AccessKeyRoutingModule]
})
export class AccessKeyModule {}
