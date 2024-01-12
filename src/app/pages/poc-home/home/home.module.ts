import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { SharedModule } from '@app/shared/shared.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedModule,
    HomeRoutingModule
  ]
})
export class HomeModule { }
