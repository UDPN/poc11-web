/*
 * @Author: chenyuting
 * @Date: 2025-02-17 13:41:58
 * @LastEditors: chenyuting
 * @LastEditTime: 2025-02-19 15:58:48
 * @Description:
 */
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ThemeOptionsKey } from '@app/config/constant';
import { WindowService } from '@app/core/services/common/window.service';
import { LiquidityFxTransactionsService } from '@app/core/services/http/poc-liquidity/fx-transactions/fx-transactions.service';
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
  color: string = '';
  transactionSummary: any = {};
  sourceTokenInformation: any = {};
  targetTokenInformation: any = {};
  agreementUrl: any = '';
  constructor(
    public routeInfo: ActivatedRoute,
    private liquidityFxTransactionsService: LiquidityFxTransactionsService,
    private cdr: ChangeDetectorRef,
    private windowService: WindowService
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
    const themeOptionsKey: any = this.windowService.getStorage(ThemeOptionsKey);
    this.color = JSON.parse(themeOptionsKey).color;
    this.getInfo();
  }

  getInfo(): void {
    this.routeInfo.queryParams.subscribe((params) => {
      this.liquidityFxTransactionsService
        .getInfo({ transferId: params['transferId'] })
        .subscribe((res: any) => {
          this.info = res;
          this.transactionSummary = res.transactionSummary;
          this.sourceTokenInformation = res.sourceTokenInformation;
          this.targetTokenInformation = res.targetTokenInformation;
          this.cdr.markForCheck();
          return;
        });
    });
  }
}
