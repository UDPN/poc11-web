import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '@app/core/services/http/common/common.service';
import { PocCapitalPoolService } from '@app/core/services/http/poc-capital-pool/poc-capital-pool.service';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';

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
  tableConfig!: AntTableConfig;
  dataList: NzSafeAny[] = [];
  constructor(
    public routeInfo: ActivatedRoute,
    private pocCapitalPoolService: PocCapitalPoolService,
    private commonService: CommonService,
    private cdr: ChangeDetectorRef
  ) { }

  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: `Details`,
      breadcrumbs: [
        {
          name: 'Capital Pool Management',
          url: '/poc/poc-capital-pool/capital-pool'
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
    this.initTable();
  }

  getInfo(): void {
    this.routeInfo.queryParams.subscribe((params) => {
      this.pocCapitalPoolService
        .getInfo({ businessApplicationCode: params['businessApplicationCode'] })
        .subscribe((res: any) => {
          this.info = res;
          this.dataList = res.outPlatformCurrencyInformations;
          sessionStorage.setItem('status', '1');
          this.cdr.markForCheck();
          return;
        });
    });
  }

  private initTable(): void {
    this.tableConfig = {
      headers: [
        {
          title: 'Currency',
          field: 'platformCurrency',
          width: 250
        },
        {
          title: 'Account/Wallet',
          field: 'capitalPoolAddress',
          width: 220
        }
      ],
      total: 0,
      showCheckbox: false,
      loading: false,
      pageSize: 10,
      pageIndex: 1,
    };
  }
}
