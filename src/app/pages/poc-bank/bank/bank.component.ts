/*
 * @Author: chenyuting
 * @Date: 2024-12-10 17:23:08
 * @LastEditors: chenyuting
 * @LastEditTime: 2025-01-05 14:47:23
 * @Description:
 */
import {
  Component,
  TemplateRef,
  ViewChild,
  AfterViewInit,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '@app/core/services/http/common/common.service';
import { LoginService } from '@app/core/services/http/login/login.service';
import { PocBankService } from '@app/core/services/http/poc-bank/poc-bank.service';
import { PocFxRateHistoryService } from '@app/core/services/http/poc-fx-rate-history/poc-fx-rate-history.service';
import { PocHomeService } from '@app/core/services/http/poc-home/poc-home.service';
import { CbdcWalletService } from '@app/core/services/http/poc-wallet/cbdc-wallet/cbdc-wallet.service';
import { ThemeService } from '@app/core/services/store/common-store/theme.service';
import { SearchCommonVO } from '@app/core/services/types';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { finalize } from 'rxjs';

interface SearchParam {
  commercialBankName: string;
  bic: string;
  createTime: any;
  currency: any;
  countryInfoId: any;
}
interface ListParam {
  formRatePlatform: string;
  formRateCurrency: string;
  toRatePlatform: string;
  toRateCurrency: string;
}

@Component({
  selector: 'app-bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.less']
})
export class BankComponent implements OnInit, AfterViewInit {
  @ViewChild('headerContent', { static: false })
  headerContent!: TemplateRef<NzSafeAny>;
  @ViewChild('headerExtra', { static: false })
  headerExtra!: TemplateRef<NzSafeAny>;
  @ViewChild('walletAddressTpl', { static: true })
  walletAddressTpl!: TemplateRef<NzSafeAny>;
  searchParam: Partial<SearchParam> = {
    createTime: [],
    commercialBankName: '',
    bic: '',
    currency: ''
  };
  listParam: Partial<ListParam> = {
    formRatePlatform: '',
    formRateCurrency: '',
    toRatePlatform: '',
    toRateCurrency: ''
  };
  currencyList: any = [];
  regionList: any = [];
  tableQueryParams: NzTableQueryParams = {
    pageIndex: 1,
    pageSize: 10,
    sort: [],
    filter: []
  };
  compareList: any = [];
  constructor(
    private pocBankService: PocBankService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    public routeInfo: ActivatedRoute,
    public _commonService: CommonService,
    private cbdcWalletService: CbdcWalletService
  ) {}
  tableConfig!: AntTableConfig;
  dataList: NzSafeAny[] = [];
  visible = false;
  currency = '';
  commercialBankName = '';
  walletAddressList = [];
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumb: [],
    extra: '',
    desc: '',
    footer: ''
  };

  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: ``,
      breadcrumb: ['Bank Query'],
      extra: this.headerExtra,
      desc: this.headerContent,
      footer: ''
    };
  }

  ngOnInit() {
    this.initTable();
    this.getCurrency();
    this.getRegion();
  }

  open(
    commercialBankName: string,
    currency: string,
    walletAddressList: any
  ): void {
    this.visible = true;
    this.commercialBankName = commercialBankName;
    this.currency = currency;
    this.walletAddressList = walletAddressList;
  }

  close(): void {
    this.visible = false;
  }

  tableChangeDectction(): void {
    this.dataList = [...this.dataList];
    this.cdr.detectChanges();
  }

  tableLoading(isLoading: boolean): void {
    this.tableConfig.loading = isLoading;
    this.tableChangeDectction();
  }

  resetForm(): void {
    this.searchParam = {};
    this.listParam = {};
    this.searchParam.currency = '';
    this.searchParam.countryInfoId = '';
    this.getDataList(this.tableQueryParams);
  }

  getCurrency() {
    this.cbdcWalletService.getCentralBankQuery().subscribe((res) => {
      this.currencyList = res;
    });
  }

  getRegion() {
    this.cbdcWalletService.getRegion().subscribe((res) => {
      this.regionList = res;
    });
  }

  changePageSize(e: number): void {
    this.tableConfig.pageSize = e;
  }
  getDataList(e?: NzTableQueryParams): void {
    this.tableConfig.loading = true;
    const params: SearchCommonVO<any> = {
      pageSize: this.tableConfig.pageSize!,
      pageNum: e?.pageIndex || this.tableConfig.pageIndex!,
      filters: this.searchParam
    };
    this.pocBankService
      .fetchList(params.pageNum, params.pageSize, params.filters)
      .pipe(
        finalize(() => {
          this.tableLoading(false);
        })
      )
      .subscribe((_: any) => {
        this.dataList = _.data?.rows;
        this.tableConfig.total = _.data.page.total;
        this.tableConfig.pageIndex = params.pageNum;
        this.tableLoading(false);
        this.cdr.markForCheck();
      });
  }

  private initTable(): void {
    this.tableConfig = {
      headers: [
        {
          title: 'Commercial Bank Name',
          field: 'commercialBankName',
          notNeedEllipsis: true,
          width: 200
        },
        {
          title: 'Region',
          field: 'region',
          notNeedEllipsis: true,
          width: 200
        },
        {
          title: 'BIC',
          field: 'commercialBic',
          notNeedEllipsis: true,
          width: 200
        },
        {
          title: 'Custodian Bank',
          field: 'centralBankName',
          notNeedEllipsis: true,
          width: 200
        },
        {
          title: 'Currency',
          field: 'currency',
          notNeedEllipsis: true,
          width: 120
        },
        {
          title: 'Number of Wallets',
          field: 'walletAddressNumber',
          tdTemplate: this.walletAddressTpl,
          notNeedEllipsis: true,
          width: 120
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
