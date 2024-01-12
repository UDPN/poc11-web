import {
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ForeignExchangeApplyService } from '@app/core/services/http/poc-profile/foreign-exchange-apply/foreign-exchange-apply.service';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.less']
})
export class InfoComponent implements OnInit {
  @ViewChild('currencyTpl', { static: true })
  currencyTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('sourceCurrencyTpl', { static: true })
  sourceCurrencyTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('targetCurrencyTpl', { static: true })
  targetCurrencyTpl!: TemplateRef<NzSafeAny>;
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumbs: [],
    extra: '',
    desc: '',
    footer: ''
  };
  info: any = {};
  setTableConfig!: AntTableConfig;
  sourceTableConfig!: AntTableConfig;
  targetTableConfig!: AntTableConfig;
  settlementList: NzSafeAny[] = [];
  foreignList: NzSafeAny[] = [];
  constructor(
    public routeInfo: ActivatedRoute,
    private foreignExchangeApplyService: ForeignExchangeApplyService,
    private cdr: ChangeDetectorRef
  ) { }
  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: `Detail`,
      breadcrumbs: [
        {
          name: 'Foreign Exchange Management',
          url: '/poc/poc-profile/foreign-exchange-apply'
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
    this.settlementInitTable();
    this.foreignInitTable();
  }

  changePageSize(e: number): void {
    this.setTableConfig.pageSize = e;
  }

  changePageSizes(e: number): void {
    this.sourceTableConfig.pageSize = e;
    this.targetTableConfig.pageSize = e;
  }

  getInfo(): void {
    this.routeInfo.queryParams.subscribe((params) => {
      this.foreignExchangeApplyService
        .getInfo({ businessApplicationCode: params['applicationNo'] })
        .subscribe((res: any) => {
          this.info = res;
          this.settlementList = res.outSettlementInformations;
          this.foreignList = res.outExchangeInformations;
          this.cdr.markForCheck();
          return;
        });
    });
  }

  private settlementInitTable(): void {
    this.setTableConfig = {
      headers: [
        {
          title: 'Currency',
          field: 'currency',
          width: 220
        },
        {
          title: 'Capital Pool Address',
          field: 'capitalPoolAddress',
          width: 220
        }
      ],
      total: 0,
      showCheckbox: false,
      loading: false,
      pageSize: 10,
      pageIndex: 1
    };
  }

  private foreignInitTable(): void {
    this.sourceTableConfig = {
      headers: [
        {
          title: 'Base Currency',
          field: 'sourceCurrency',
          width: 220
        }
      ],
      total: 0,
      showCheckbox: false,
      loading: false,
      pageSize: 10,
      pageIndex: 1
    };
    this.targetTableConfig = {
      headers: [
        {
          title: 'Quote Currency',
          field: 'targetCurrency',
          width: 220
        }
      ],
      total: 0,
      showCheckbox: false,
      loading: false,
      pageSize: 10,
      pageIndex: 1
    };
  }
}
