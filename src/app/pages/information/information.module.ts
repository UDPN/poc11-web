/*
 * @Author: zhangxuefeng
 * @Date: 2023-10-17 13:27:53
 * @LastEditors: zhangxuefeng
 * @LastEditTime: 2023-10-17 16:32:31
 * @Description:
 */
import { NgModule } from '@angular/core';

import { InformationRoutingModule } from './information-routing.module';
import { FormInformationComponent } from './form/form.component';
import { SharedModule } from '@app/shared/shared.module';
import { LogoTitleComponent } from './component/logo-title/logo-title.component';
import { DetailComponent } from './detail/detail.component';
import { EditComponent } from './edit/edit.component';

@NgModule({
  declarations: [
    FormInformationComponent,
    LogoTitleComponent,
    DetailComponent,
    EditComponent
  ],
  imports: [SharedModule, InformationRoutingModule]
})
export class InformationModule {}
