/*
 * @Author: chenyuting
 * @Date: 2024-12-11 10:31:17
 * @LastEditors: chenyuting
 * @LastEditTime: 2024-12-11 10:34:04
 * @Description: 
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { DownloadCenterRoutingModule } from './download-center-routing.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedModule,
    DownloadCenterRoutingModule
  ]
})
export class DownloadCenterModule { }