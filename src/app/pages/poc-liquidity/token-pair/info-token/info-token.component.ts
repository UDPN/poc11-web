import { AfterViewInit, Component, OnInit } from '@angular/core';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { ActivatedRoute } from '@angular/router';

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

  rateId: number = 0;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['rateId']) {
        this.rateId = Number(params['rateId']);
      }
    });
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
