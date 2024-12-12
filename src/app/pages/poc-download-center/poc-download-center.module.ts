/*
 * @Author: chenyuting
 * @Date: 2024-12-11 10:31:52
 * @LastEditors: chenyuting
 * @LastEditTime: 2024-12-11 10:35:37
 * @Description: 
 */
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { DownloadCenterComponent } from './download-center/download-center.component';
import { PocDownloadCenterRoutingModule } from './poc-download-center-routing.module';

@NgModule({
  declarations: [DownloadCenterComponent],
  imports: [SharedModule, PocDownloadCenterRoutingModule],
})
export class PocDownloadCenterModule {}