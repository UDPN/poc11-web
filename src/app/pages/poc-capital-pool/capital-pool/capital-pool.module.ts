/*
 * @Author: zhangxuefeng
 * @Date: 2023-10-17 10:48:53
 * @LastEditors: zhangxuefeng
 * @LastEditTime: 2023-10-30 14:53:56
 * @Description:
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { CapitalPoolRoutingModule } from './capital-pool-routing.module';
import { AddPoolComponent } from './components/add-pool/add-pool.component';
import { AddComponent } from './add/add.component';
import { InfoComponent } from './info/info.component';
import { ApplicationComponent } from './application/application.component';
import { CapitalPoolComponent } from './capital-pool.component';
import { ReduceComponent } from './reduce/reduce.component';

@NgModule({
  declarations: [CapitalPoolComponent, AddComponent, AddPoolComponent, InfoComponent, ApplicationComponent, ReduceComponent],
  imports: [CommonModule, SharedModule, CapitalPoolRoutingModule]
})
export class CapitalPoolModule {}
