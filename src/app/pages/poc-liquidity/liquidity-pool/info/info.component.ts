import { AfterViewInit, Component, OnInit } from '@angular/core';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.less']
})
export class InfoComponent implements OnInit, AfterViewInit {
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumbs: [],
    extra: '',
    desc: '',
    footer: ''
  };

  id: string = '';

  constructor(
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['liquidityPoolId']) {
        this.id = params['liquidityPoolId'];
      }
    });
  }

  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: 'Details',
      breadcrumbs: [
        { name: 'Liquidity Management' },
        { name: 'Liquidity Pool Management', url: '/poc/poc-liquidity/liquidity-pool' },
        { name: 'Details' }
      ],
      extra: '',
      desc: '',
      footer: ''
    };
  }

  onBack(): void {
    this.location.back();
  }
}
