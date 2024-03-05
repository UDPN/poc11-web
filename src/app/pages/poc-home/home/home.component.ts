import {
  Component,
  TemplateRef,
  ViewChild,
  AfterViewInit,
  OnInit,
  ChangeDetectorRef,
  HostListener,
  OnDestroy
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '@app/core/services/http/common/common.service';
import { LoginService } from '@app/core/services/http/login/login.service';
import { PocHomeService } from '@app/core/services/http/poc-home/poc-home.service';
import { ThemeService } from '@app/core/services/store/common-store/theme.service';
import { SearchCommonVO } from '@app/core/services/types';
import { DefaultStoreService } from '@app/layout/default/store/default.service';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import {
  thousandthMark,
  timestampToDate,
  timestampToTime
} from '@app/utils/tools';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { finalize } from 'rxjs';
import * as echarts from 'echarts';
import { InformationService } from '@app/core/services/http/information/information.service';
import { SocketService } from '@app/core/services/common/socket.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { WindowService } from '@app/core/services/common/window.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('headerContent', { static: false })
  headerContent!: TemplateRef<NzSafeAny>;
  @ViewChild('headerExtra', { static: false })
  headerExtra!: TemplateRef<NzSafeAny>;
  @ViewChild('operationTpl', { static: true })
  operationTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('currencyTpl', { static: true })
  currencyTpl!: TemplateRef<NzSafeAny>;
  solutionCenterList: any = [];
  url: any = '';
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisHeight: number = 100;
  yAxisWidth: number = 100;
  xAxisLabel: string = '';
  yAxisLabel: string = '';
  xAxisLabel1: string = '';
  yAxisLabel1: string = '';
  timeline: boolean = true;
  multi: any[] = [];
  multi1: any[] = [];
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = true;
  showLegend: boolean = true;
  getScreenWidth: any;
  walletForm!: FormGroup;
  nzOption: any[] = [];
  value: string[] = [];

  testSeries: any[] = [];

  // colorScheme: Color = {
  //   domain: ['#5AA454', '#E44D25', '#7aa3e5', '#a8385d', '#aae3f5'],
  //   name: '',
  //   selectable: false,
  //   group: ScaleType.Linear
  // };
  view: [number, number] = [1200, 400];
  pairedList: any = [];
  listParam: any = {
    sourceCurrency: '',
    sourcePlatform: '',
    targetCurrency: '',
    targetPlatform: ''
  };
  exchangeRate: any = [
    {
      title: 'Activated Currency Pair',
      value: ''
    },
    {
      title: 'Currency Pair Pending Approval',
      value: ''
    }
    // {
    //   title: 'Unavailable Currency Pair'
    // }
  ];
  nonactivatedCurrency: any = [];
  pendingCurrency: any = [];
  approveCurrency: any = [];
  approveCurrencyCount: any = '';
  pendingCurrencyCount: any = '';
  nonactivatedCurrencyCount: any = '';
  nonactivatedRate: any = [];
  pendingRate: any = [];
  nonactivatedRateCount: any = '';
  pendingRateCount: any = '';
  approveList: any = [];
  validateForm!: FormGroup;
  currencyForm!: FormGroup;
  walletBalanceList: any = [];
  walletList: any = [];
  bankType: any = '';
  currencyList: any = [];
  constructor(
    private pocHomeService: PocHomeService,
    private cdr: ChangeDetectorRef,
    private _commonService: CommonService,
    private fb: FormBuilder,
    private _defaultStoreService: DefaultStoreService,
    public _informationService: InformationService,
    private socketService: SocketService,
    private notification: NzNotificationService,
    private windowService: WindowService
  ) { }
  tableConfig!: AntTableConfig;
  dataList: NzSafeAny[] = [];
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumb: [],
    extra: '',
    desc: '',
    footer: ''
  };
  walletAddress: any = [];
  @HostListener('window:resize', ['$event'])
  ngOnInit() {
    this.isFirstLogin();
    // this.fetchNumbers();
    this._informationService.detail().subscribe((res: any) => {
      if (res) {
        this.bankType = res.bankType;
        this.defaultBalance();
        this.getCurrencyList();
        if (this.bankType === 2) {
          this.initTable();
          this.initSelect();
        }
        this.cdr.markForCheck();
      }
    });
    this.validateForm = this.fb.group({
      pairedExchangeRate: [1]
    });
    this.currencyForm = this.fb.group({
      currency: ['']
    });
    const fn = () => {
      const myChart: any = echarts.init(
        document.getElementById('chart-container')
      );
      myChart.resize();
    };

    window.addEventListener('resize', fn);
    this.getScreenWidth = window.innerWidth;
    if (this.getScreenWidth > 900) {
      this.legend = true;
      this.view = [this.getScreenWidth - 400, 400];
    } else if (this.getScreenWidth > 500 && this.getScreenWidth < 900) {
      this.legend = false;
      this.view = [this.getScreenWidth - 200, 400];
    } else {
      this.legend = false;
      this.view = [300, 300];
    }
  }
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
    if (this.getScreenWidth > 900) {
      this.legend = true;
      this.showLegend = true;
      this.view = [this.getScreenWidth - 400, 400];
    } else if (this.getScreenWidth > 500 && this.getScreenWidth < 900) {
      this.legend = false;
      this.showLegend = false;
      this.view = [this.getScreenWidth - 200, 400];
    } else {
      this.legend = false;
      this.showLegend = false;
      this.view = [300, 300];
    }
  }

  tableChangeDectction(): void {
    this.dataList = [...this.dataList];
    this.cdr.detectChanges();
  }

  tableLoading(isLoading: boolean): void {
    this.tableConfig.loading = isLoading;
    this.tableChangeDectction();
  }
  private isFirstLogin(): void {
    this.pocHomeService.isFirstLogin().subscribe((res) => {
      this._defaultStoreService.setShowChangePassWordStore(res.data.firstLogin);
    });
  }

  defaultBalance(value?: any) {
    this.pocHomeService.walletBalance({}).subscribe((res) => {
      let temObj: any = {};
      for (let i = 0; i < res.length; i++) {
        let item = res[i];
        if (!temObj[item['currency']]) {
          temObj[item['currency']] = [item];
        } else {
          temObj[item['currency']].push(item);
        }
      }
      let resArr: any = [];
      Object.keys(temObj).forEach((key) => {
        resArr.push({
          currency: key,
          walletList: temObj[key]
        });
      });
      this.walletBalanceList = resArr;
      let walletBalanceList: any = [];
      walletBalanceList = this.walletBalanceList;
      walletBalanceList.map((item: any, i: any) => {
        let unit: any = '';
        let totalBance: any = '';
        if (item.currency === 'w-THB') {
          unit = '฿';
        } else if (item.currency === 'w-EUR') {
          unit = '€';
        } else if (item.currency === 'w-USD') {
          unit = '$';
        } else if (item.currency === 'w-AED') {
          unit = 'د.إ';
        } else if (item.currency === 'w-CNY') {
          unit = '¥';
        } else if (item.currency === 'w-HKD') {
          unit = 'HK$';
        }
        const array: any = [];
        item.walletList.map((items: any, i: any) => {
          array.push(items.balance);
          totalBance = eval(array.join('+'));
          Object.assign(items, { index: i + 1 });
        });
        Object.assign(item, {
          value:
            item.walletList[0].balance.toString() +
            '-' +
            item.walletList[0].index.toString(),
          unit,
          totalBance
        });
      });
      this.walletBalanceList = walletBalanceList;
    });
  }

  getCurrencyList() {
    this.pocHomeService.getCurrencyList().subscribe((res) => {
      if (res) {
        this.currencyList = res;
        this.currencyForm.get('currency')?.setValue(res[0]);
      }
    });
  }

  // selectWalletAddress(currency: any) {
  //   this.walletBalanceList.map((item: any) => {
  //     if (item.currency === currency) {
  //       this.defaultBalance(currency);
  //     }
  //   })
  // }

  getMovements(currency?: any) {
    this.pocHomeService.getMovements({ currency }).subscribe((res) => {
      if (res) {
        res.daysList = res.daysList.map((item: any) => {
          return timestampToDate(item);
        });
        let length = res.daysList;
        length = res.daysList.map((item: any) => {
          return 0;
        });
        const params = {
          topUpAmount: res.topUpAmountList,
          withdrawAmount: res.withdrawAmountList,
          transferOutAmount: res.transferOutAmountList,
          transferInAmount: res.transferInAmountList,
          days: res.daysList,
          length
        };
        this.getEcharts(params);
      }
    });
  }

  ngAfterViewInit(): void {
    this.currencyForm
      .get('currency')
      ?.valueChanges.subscribe((item: number) => {
        this.getMovements(item);
      });
    this.fetchNumbers();
    this.pageHeaderInfo = {
      title: ``,
      breadcrumb: ['Dashboard'],
      extra: this.headerExtra,
      desc: this.headerContent,
      footer: ''
    };
  }

  initSelect() {
    this._commonService
      .commonApi({
        dropDownTypeCode: 'drop_down_exchange_rate_info',
        csePCode: 'FXSP_EXCHANGE_RATE_VAILD'
      })
      .subscribe((res) => {
        this.pairedList = res.dataInfo;
        this.pairedList.map((item: any, i: any) => {
          Object.assign(item, { key: i + 1 });
        });
        this.listParam = {
          sourceCurrency: this.pairedList[0]?.sourceCurrency,
          sourcePlatform: this.pairedList[0]?.sourcePlatform,
          targetCurrency: this.pairedList[0]?.targetCurrency,
          targetPlatform: this.pairedList[0]?.targetPlatform
        };
        this.fetchNumber(this.listParam);
      });
    this.pocHomeService.approveCurrency().subscribe((res) => {
      if (res.data !== null) {
        this.approveCurrency = res.data.outCapitalPoolSearchesList;
        this.approveCurrencyCount = res.data.count;
        this.cdr.markForCheck();
      }
    });
    this.pocHomeService.pendingCurrency().subscribe((res) => {
      this.pendingCurrency = res.data.outPendingCurrencyList;
      this.pendingCurrencyCount = res.data.count;
      this.cdr.markForCheck();
    });
    this.pocHomeService.nonactivatedCurrency().subscribe((res) => {
      this.nonactivatedCurrency = res.data.platformCurrency;
      this.nonactivatedCurrencyCount = res.data.count;
      this.cdr.markForCheck();
    });

    this.pocHomeService.nonactivatedRate().subscribe((res) => {
      this.nonactivatedRate = res.data.unopenedRateList;
      // this.exchangeRate[2].value = res.data.unopenedRateList.length;
      this.cdr.markForCheck();
    });
    this.pocHomeService.pendingRate().subscribe((res) => {
      this.pendingRate = res.data.outPendingRateListList;
      this.exchangeRate[1].value = res.data.count;
      this.cdr.markForCheck();
    });
    this.pocHomeService.fetchHomeList().subscribe((res) => {
      this.approveList = res.data.outLatestExchangeRateInfoList;
      this.exchangeRate[0].value = res.data.count;
      this.cdr.markForCheck();
    });
  }

  changePageSize(e: number): void {
    this.tableConfig.pageSize = e;
  }

  // getDataList(e?: NzTableQueryParams): void {
  //   this.tableConfig.loading = true;
  //   this.pocHomeService
  //     .fetchHomeList()
  //     .pipe(
  //       finalize(() => {
  //         this.tableLoading(false);
  //       })
  //     )
  //     .subscribe((_: any) => {
  //       this.approveList = _.data.outLatestExchangeRateInfoList;
  //       this.dataList = _.data.outLatestExchangeRateInfoList;
  //       this.exchangeRate[0].value = _.data.outLatestExchangeRateInfoList.length;
  //       this.tableConfig.total = _?.resultPageInfo?.total;
  //       this.tableLoading(false);
  //       this.cdr.markForCheck();
  //     });
  // }

  fetchNumber(data?: any) {
    this.pocHomeService
      .dynamics(data ? data : this.listParam)
      .subscribe((res) => {
        if (res) {
          this.xAxisLabel = '';
          let multi: any = [];

          if (res.data.length > 0) {
            res.data.forEach((item: any) => {
              let series: any = [];
              item.historyExchangeRateInfoList.forEach((items: any) => {
                series.push({
                  name: timestampToDate(items.date),
                  value: items.exchangeRate
                    .toString()
                    .replace(/\d{1,3}(?=(\d{3})+(\.|$))/gy, '$&,')
                });
              });
              multi.push({
                name: item.sourceCurrency + '->' + item.targetCurrency,
                series: series
              });
              this.multi = multi;
              Object.assign(this, { multi });
            });
          } else {
            this.multi = multi;
            Object.assign(this, { multi });
          }
        }
        this.cdr.markForCheck();
      });
  }

  fetchNumbers() {
    this.pocHomeService.volume().subscribe((res) => {
      if (res) {
        this.xAxisLabel1 = '';
        let multi1: any = [];

        if (res.data.length > 0) {
          res.data.forEach((item: any) => {
            let series1: any = [];
            item.outTransactionVolumeInfoList.forEach((items: any) => {
              series1.push({
                name: items.sourceCurrency + '->' + items.targetCurrency,
                value: items.transactionNumber
                  .toString()
                  .replace(/\d{1,3}(?=(\d{3})+(\.|$))/gy, '$&,')
              });
            });
            multi1.push({
              name: timestampToDate(item.transactionDate),
              series: series1
            });
            this.testSeries = series1;
            this.multi1 = multi1;
            Object.assign(this, { multi1 });
          });
        } else {
          this.multi1 = multi1;
          Object.assign(this, { multi1 });
        }
      }
      this.cdr.markForCheck();
    });
  }

  onQuery() {
    this.pairedList.map((item: any) => {
      if (this.validateForm.get('pairedExchangeRate')?.value === item.key) {
        this.listParam.sourceCurrency = item.sourceCurrency;
        this.listParam.sourcePlatform = item.sourcePlatform;
        this.listParam.targetCurrency = item.targetCurrency;
        this.listParam.targetPlatform = item.targetPlatform;
      }
    });
    this.fetchNumber(this.listParam);
  }

  private initTable(): void {
    this.tableConfig = {
      headers: [
        {
          title: 'Transaction Currency',
          tdTemplate: this.currencyTpl,
          width: 120
        },
        {
          title: 'Currency Pair ID',
          field: 'chainRateId',
          pipe: 'nullValue',
          width: 320
        },
        {
          title: 'Exchange Rate',
          field: 'exchangeRate',
          pipe: 'nullValue',
          width: 120
        },
        {
          title: 'Date',
          field: 'date',
          pipe: 'timeStamp',
          notNeedEllipsis: true,
          width: 120
        },
        {
          title: 'Actions',
          tdTemplate: this.operationTpl,
          fixed: true,
          fixedDir: 'right',
          showAction: false,
          width: 180
        }
      ],
      total: 0,
      showCheckbox: false,
      loading: false,
      pageSize: 10,
      pageIndex: 1
    };
  }

  getEcharts(param: any) {
    var dom = document.getElementById('chart-container');
    var myChart = echarts.init(dom, null, {
      renderer: 'canvas',
      useDirtyRect: false
    });
    var app = {};
    var option;
    var emphasisStyle = {
      itemStyle: {
        shadowBlur: 10,
        shadowColor: 'rgba(0,0,0,0.3)'
      }
    };
    option = {
      title: {
        text: ''
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          let tips = params[0].axisValue;
          params.forEach((item: any) => {
            tips +=
              '<br /> ' +
              item.marker +
              item.seriesName +
              ': ' +
              (item.value === 0 ? 0 : thousandthMark(item.value));
          });
          return tips;
        }
      },
      legend: {
        // data: ['Top-up', 'Transfer In', 'Withdraw', 'Transfer Out'],
        data: [
          {
            name: 'Top-up',
            icon: 'circle'
          },
          {
            name: 'Transfer In',
            icon: 'circle'
          },
          {
            name: 'Withdraw',
            icon: 'circle'
          },
          {
            name: 'Transfer Out',
            icon: 'circle'
          }
        ],
        right: '10%'
      },
      xAxis: {
        type: 'category',
        data: param.days
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: 'Top-up',
          type: 'line',
          data: param.topUpAmount
        },
        {
          name: 'Transfer In',
          type: 'line',
          data: param.transferInAmount
        },
        {
          name: 'Withdraw',
          type: 'line',
          data: param.withdrawAmount
        },
        {
          name: 'Transfer Out',
          type: 'line',
          data: param.transferOutAmount
        }
      ]
    };
    // myChart.on('brushSelected', function (params: any) {
    //   var brushed = [];
    //   var brushComponent = params.batch[0];

    //   for (var sIdx = 0; sIdx < brushComponent.selected.length; sIdx++) {
    //     var rawIndices = brushComponent.selected[sIdx].dataIndex;
    //     brushed.push('[Series ' + sIdx + '] ' + rawIndices.join(', '));
    //   }

    //   myChart.setOption<echarts.EChartsOption>({
    //     title: {
    //       backgroundColor: '#333',
    //       text: 'SELECTED DATA INDICES: \n' + brushed.join('\n'),
    //       bottom: 0,
    //       right: '10%',
    //       width: 100,
    //       textStyle: {
    //         fontSize: 12,
    //         color: '#fff'
    //       }
    //     }
    //   });
    // });

    if (option && typeof option === 'object') {
      myChart.setOption(option);
    }
  }

  panels = [
    {
      active: true,
      // name: 'This is panel header 1',
      disabled: false
    },
    {
      active: false,
      disabled: false
      // name: 'This is panel header 2'
    }
  ];

  ngOnDestroy(): void {
    window.addEventListener('resize', () => { });
  }
}
