import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UModalComponent } from './u-modal.component';
import { PipesModule } from '@app/shared/pipes/pipes.module';
import { SHARED_ZORRO_MODULES } from '@app/shared/shared-zorro.module';



@NgModule({
  declarations: [UModalComponent],
  imports: [
    CommonModule, SHARED_ZORRO_MODULES, PipesModule
  ],
  exports:[UModalComponent]
})
export class UModalModule { }
