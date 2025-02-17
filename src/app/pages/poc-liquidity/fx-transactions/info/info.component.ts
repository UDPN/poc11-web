/*
 * @Author: chenyuting
 * @Date: 2025-02-17 13:41:58
 * @LastEditors: chenyuting
 * @LastEditTime: 2025-02-17 14:22:59
 * @Description:
 */
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrl: './info.component.less'
})
export class InfoComponent implements OnInit {
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumbs: [],
    extra: '',
    desc: '',
    footer: ''
  };
  info: any = {};
  agreementUrl: any = '';
  constructor(
    public routeInfo: ActivatedRoute,
    // private pocFxTransactionsService: PocFxTransactionsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: `Details`,
      breadcrumbs: [
        {
          name: 'Liquidity Management'
        },
        {
          name: 'FX Transactions',
          url: '/poc/poc-liquidity/fx-transactions'
        },
        { name: 'Details' }
      ],
      extra: '',
      desc: '',
      footer: ''
    };
  }

  ngOnInit() {
    this.getInfo();
  }

  getInfo(): void {
    this.routeInfo.queryParams.subscribe((params) => {
      // this.pocFxTransactionsService
      //   .info({ transactionNo: params['transactionNo'] })
      //   .subscribe((res: any) => {
      //     this.info = res;
      //     this.cdr.markForCheck();
      //     return;
      //   });
    });
  }
}
