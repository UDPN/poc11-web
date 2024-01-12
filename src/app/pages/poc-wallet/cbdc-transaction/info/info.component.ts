import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '@app/core/services/http/common/common.service';
import { PocCapitalPoolService } from '@app/core/services/http/poc-capital-pool/poc-capital-pool.service';
import { CbdcTransactionService } from '@app/core/services/http/poc-wallet/cbdc-transaction/cbdc-transaction.service';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.less']
})
export class InfoComponent implements OnInit {
  @ViewChild('transactionNoTpl', { static: true })
  transactionNoTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('transactionHashTpl', { static: true })
  transactionHashTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('fromTpl', { static: true })
  fromTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('toTpl', { static: true })
  toTpl!: TemplateRef<NzSafeAny>;
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumbs: [],
    extra: '',
    desc: '',
    footer: ''
  };
  info: any = {};
  constructor(
    public routeInfo: ActivatedRoute,
    private commonService: CommonService,
    private cdr: ChangeDetectorRef,
    private cbdcTransactionService: CbdcTransactionService,
  ) { }

  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: `Details`,
      breadcrumbs: [
        {
          name: 'Wallet Management'
        },
        {
          name: 'CBDC Transaction',
          url: '/poc/poc-wallet/cbdc-transaction'
        },
        { name: 'Details' }
      ],
      extra: '',
      desc: '',
      footer: ''
    };
  }

  ngOnInit() {
    this.routeInfo.queryParams.subscribe(params => {
      this.cbdcTransactionService.getInfo({ transferId: params['transferId'] }).subscribe(res => {
        this.info = res;
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      });
    });
  }
}
