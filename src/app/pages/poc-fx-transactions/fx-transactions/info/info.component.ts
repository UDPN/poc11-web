import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '@app/core/services/http/common/common.service';
import { PocFxTransactionsService } from '@app/core/services/http/poc-fx-transactions/poc-fx-transactions.service';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.less']
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
    private pocFxTransactionsService: PocFxTransactionsService,
    private commonService: CommonService,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: `Detail`,
      breadcrumbs: [
        {
          name: 'FX Transactions',
          url: '/poc/poc-fx-transactions/fx-transactions'
        },
        { name: 'Detail' }
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
      this.pocFxTransactionsService
        .info({ transactionNo: params['transactionNo'] })
        .subscribe((res: any) => {
          this.info = res;
          this.cdr.markForCheck();
          return;
        });
    });
  }

}
