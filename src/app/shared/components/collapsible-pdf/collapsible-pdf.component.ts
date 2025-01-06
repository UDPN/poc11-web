import { Component, Input, OnInit } from '@angular/core';
import { trigger, state, style } from '@angular/animations';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-collapsible-pdf',
  templateUrl: './collapsible-pdf.component.html',
  styleUrls: ['./collapsible-pdf.component.less'],
  animations: [
    trigger('collapseAnimation', [
      state('expanded', style({
        width: '800px',
        height: '800px',
        borderRadius: '8px',
        top: '50%',
        left: '50%',
        right: 'auto',
        transform: 'translate(-50%, -50%)'
      })),
      state('collapsed', style({
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        top: '80px',
        left: 'auto',
        right: '20px',
        transform: 'none'
      }))
    ])
  ]
})
export class CollapsiblePdfComponent implements OnInit {
  @Input() set pdfUrl(value: string) {
    if (value) {
      const url = value + '#toolbar=0&navpanes=0&scrollbar=0';
      this._pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
  }
  
  _pdfUrl: SafeResourceUrl = '';
  isExpanded: boolean = true;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    // Get expanded state from session storage
    const storedState = sessionStorage.getItem('pdfViewerExpanded');
    this.isExpanded = storedState === null ? true : storedState === 'true';
  }

  toggleExpand(): void {
    this.isExpanded = !this.isExpanded;
    // Save state to session storage
    sessionStorage.setItem('pdfViewerExpanded', this.isExpanded.toString());
  }
} 