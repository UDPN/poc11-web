import {
  Component,
  TemplateRef,
  ViewChild,
  AfterViewInit,
  OnInit,
  ChangeDetectorRef,
  HostListener
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
import { timestampToDate, timestampToTime } from '@app/utils/tools';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { finalize } from 'rxjs';
import * as echarts from 'echarts';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit, AfterViewInit {
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
      title: 'Available Currency Pair',
      value: ''
    },
    {
      title: 'Currency Pair Pending Activation',
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
  walletBalanceList: any = [
    {
      currency: 'w-THB',
      walletList: [
        {
          walletAddress: '0x3234234234234234324',
          amount: '40,000'
        },
        {
          walletAddress: '0x3453453453463454353',
          amount: '30,000'
        }
      ]
    },
    {
      currency: 'w-EUR',
      walletList: [
        {
          walletAddress: '0x3234234234234234321',
          amount: '15,000'
        },
        {
          walletAddress: '0x3453453453463454352',
          amount: '23,000'
        }
      ]
    },
    {
      currency: 'w-USD',
      walletList: [
        {
          walletAddress: '0x3234234234234234332',
          amount: '10,000'
        },
        {
          walletAddress: '0x3453453453463454334',
          amount: '50,000'
        }
      ]
    },
    {
      currency: 'w-HKD',
      walletList: [
        {
          walletAddress: '0x3234234234234234317',
          amount: '40,000'
        },
        {
          walletAddress: '0x3453453453463454336',
          amount: '30,000'
        }
      ]
    }
  ];
  walletList: any = [];
  constructor(
    private pocHomeService: PocHomeService,
    private cdr: ChangeDetectorRef,
    private _commonService: CommonService,
    private fb: FormBuilder,
    private _defaultStoreService: DefaultStoreService
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

  defaultBalance() {
    let walletBalanceList: any = [];
    walletBalanceList = this.walletBalanceList;
    walletBalanceList.map((item: any, i: any) => {
      Object.assign(item, { value: item.walletList[0].amount });
    });
  }

  ngOnInit() {
    this.isFirstLogin();
    this.initTable();
    this.initSelect();
    // this.fetchNumbers();
    this.defaultBalance();
    this.validateForm = this.fb.group({
      pairedExchangeRate: [1]
    });
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

  ngAfterViewInit(): void {
    // this.getEcharts();
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
          this.xAxisLabel = 'Exchange Rate Dynamics In the Last 7 days';
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
                name:
                  item.sourceCurrency +
                  '->' +
                  item.targetCurrency,
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
        this.xAxisLabel1 = 'Transaction Volume In the Last 7 Days';
        let multi1: any = [];

        if (res.data.length > 0) {
          res.data.forEach((item: any) => {
            let series1: any = [];
            item.outTransactionVolumeInfoList.forEach((items: any) => {
              series1.push({
                name:
                  items.sourceCurrency +
                  '->' +
                  items.targetCurrency,
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
          title: 'Action',
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

  // getEcharts() {
  //   var dom = document.getElementById('chart-container');
  //   var myChart = echarts.init(dom, null, {
  //     renderer: 'canvas',
  //     useDirtyRect: false
  //   });
  //   var app = {};

  //   var option;

  //   let xAxisData: string[] = [];
  //   let data1: number[] = [];
  //   let data2: number[] = [];
  //   let data3: number[] = [];
  //   let data4: number[] = [];

  //   for (let i = 0; i < 10; i++) {
  //     xAxisData.push('Class' + i);
  //     data1.push(+(Math.random() * 2).toFixed(2));
  //     data2.push(+(Math.random() * 5).toFixed(2));
  //     data3.push(+(Math.random() + 0.3).toFixed(2));
  //     data4.push(+Math.random().toFixed(2));
  //   }

  //   var emphasisStyle = {
  //     itemStyle: {
  //       shadowBlur: 10,
  //       shadowColor: 'rgba(0,0,0,0.3)'
  //     }
  //   };
  //   option = {
  //     title: {
  //       text: 'CBDC Movements In the Last 7 Days',
  //       left: 'center',
  //       bottom: '0'
  //     },
  //     color: ['#A8385D', '#7AA3E5', '#A280A8', '#AAE3F5', '#ADCDCF', '#A95963'],
  //     legend: {
  //       data: ['bar', 'bar2', 'bar3', 'bar4'],
  //       right: '10%',
  //     },
  //     tooltip: {},
  //     xAxis: {
  //       data: xAxisData,
  //       name: '',
  //       axisLine: { onZero: false },
  //       splitLine: { show: false },
  //       splitArea: { show: false }
  //     },
  //     yAxis: {},
  //     grid: {
  //       bottom: 100
  //     },
  //     series: [
  //       {
  //         name: 'bar',
  //         type: 'bar',
  //         stack: 'one',
  //         emphasis: emphasisStyle,
  //         data: data1
  //       },
  //       {
  //         name: 'bar2',
  //         type: 'bar',
  //         stack: 'one',
  //         emphasis: emphasisStyle,
  //         data: data2
  //       },
  //       {
  //         name: 'bar3',
  //         type: 'bar',
  //         stack: 'two',
  //         emphasis: emphasisStyle,
  //         data: data3
  //       },
  //       {
  //         name: 'bar4',
  //         type: 'bar',
  //         stack: 'two',
  //         emphasis: emphasisStyle,
  //         data: data4
  //       }
  //     ],
  //   };

  //   // myChart.on('brushSelected', function (params: any) {
  //   //   var brushed = [];
  //   //   var brushComponent = params.batch[0];

  //   //   for (var sIdx = 0; sIdx < brushComponent.selected.length; sIdx++) {
  //   //     var rawIndices = brushComponent.selected[sIdx].dataIndex;
  //   //     brushed.push('[Series ' + sIdx + '] ' + rawIndices.join(', '));
  //   //   }

  //   //   myChart.setOption<echarts.EChartsOption>({
  //   //     title: {
  //   //       backgroundColor: '#333',
  //   //       text: 'SELECTED DATA INDICES: \n' + brushed.join('\n'),
  //   //       bottom: 0,
  //   //       right: '10%',
  //   //       width: 100,
  //   //       textStyle: {
  //   //         fontSize: 12,
  //   //         color: '#fff'
  //   //       }
  //   //     }
  //   //   });
  //   // });

  //   if (option && typeof option === 'object') {
  //     myChart.setOption(option);
  //   }
  // }

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
}
