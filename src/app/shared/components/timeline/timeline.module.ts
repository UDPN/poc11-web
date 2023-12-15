import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PipesModule } from '@shared/pipes/pipes.module';
import { SHARED_ZORRO_MODULES } from '@shared/shared-zorro.module';
import { TimelineComponent } from './timeline.component';

@NgModule({
  declarations: [TimelineComponent],
  imports: [CommonModule, SHARED_ZORRO_MODULES, PipesModule],
  exports: [TimelineComponent]
})
export class TimelineModule {}
