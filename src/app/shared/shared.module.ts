import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { BizComponentsModule } from './biz-components/biz-components.module';
import { CardTableWrapModule } from './components/card-table-wrap/card-table-wrap.module';
import { ComponentsModule } from './components/components.module';
import { DirectivesModule } from './directives/directives.module';
import { PipesModule } from './pipes/pipes.module';
import { SHARED_ZORRO_MODULES } from './shared-zorro.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { QuillModule } from 'ngx-quill';

const MODULES = [CommonModule, FormsModule, ReactiveFormsModule, NgxChartsModule, PipesModule, ComponentsModule, DirectivesModule, CardTableWrapModule, BizComponentsModule,TranslateModule, QuillModule, ...SHARED_ZORRO_MODULES];

@NgModule({
  imports: [...MODULES],
  exports: [...MODULES],
  providers: [
    DatePipe
  ],
})
export class SharedModule {}
