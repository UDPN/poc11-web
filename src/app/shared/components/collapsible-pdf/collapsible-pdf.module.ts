import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CollapsiblePdfComponent } from './collapsible-pdf.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [CollapsiblePdfComponent],
  imports: [
    CommonModule,
    NzIconModule,
  ],
  exports: [CollapsiblePdfComponent]
})
export class CollapsiblePdfModule { } 