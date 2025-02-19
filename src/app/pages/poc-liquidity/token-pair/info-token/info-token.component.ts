import { AfterViewInit, Component, OnInit } from '@angular/core';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';

@Component({
  selector: 'app-info-token',
  templateUrl: './info-token.component.html',
  styleUrl: './info-token.component.less'
})
export class InfoTokenComponent implements OnInit, AfterViewInit {
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumbs: [],
    extra: '',
    desc: '',
    footer: ''
  };

  ngOnInit(): void {
    // Initialize any required data
  }

  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: 'Details',
      breadcrumbs: [
        { name: 'Liquidity Management' },
        { name: 'Token Pair Management', url: '/poc/poc-liquidity/token-pair' },
        { name: 'Details' }
      ],
      extra: '',
      desc: '',
      footer: ''
    };
  }
}
