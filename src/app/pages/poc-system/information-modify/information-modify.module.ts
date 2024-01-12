import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { InformationModifyRoutingModule } from './information-modify-routing.module';
import { InformationModifyComponent } from './information-modify.component';


@NgModule({
  declarations: [InformationModifyComponent],
  imports: [
    CommonModule,
    SharedModule,
    InformationModifyRoutingModule
  ]
})
export class InformationModifyModule { }
