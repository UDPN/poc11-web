import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { ChangNumberToChinesePipe } from './chang-number-to-chinese.pipe';
import { ChangNumberToEnglishPipe } from './chang-number-to-english.pipe.pipe';
import { HtmlPipe } from './html.pipe';
import { MapPipe } from './map.pipe';
import { NumberLoopPipe } from './number-loop.pipe';
import { TableFiledPipe } from './table-filed.pipe';

const PIPES = [ChangNumberToChinesePipe,ChangNumberToEnglishPipe, NumberLoopPipe, HtmlPipe, MapPipe, TableFiledPipe];

@NgModule({
  declarations: [...PIPES],
  imports: [],
  exports: [...PIPES]
})
export class PipesModule {}
