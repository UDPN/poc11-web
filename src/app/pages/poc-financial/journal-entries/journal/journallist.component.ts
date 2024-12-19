import { Component, OnInit, ChangeDetectorRef, AfterViewInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JournalService } from '@app/core/services/http/poc-financial/journal/journal.service';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { DatePipe } from '@angular/common';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-journallist',
  templateUrl: './journallist.component.html'
})
export class JournallistComponent implements OnInit, AfterViewInit {
  @ViewChild('headerContent', { static: false })
  headerContent!: TemplateRef<NzSafeAny>;
  @ViewChild('headerExtra', { static: false })
  headerExtra!: TemplateRef<NzSafeAny>;
  @ViewChild('actionTpl', { static: true })
  actionTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('txTypeTpl', { static: true })
  txTypeTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('debitTpl', { static: true })
  debitTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('creditTpl', { static: true })
  creditTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('traceIdTpl', { static: true })
  traceIdTpl!: TemplateRef<NzSafeAny>;
  tableConfig!: AntTableConfig;
  dataList: any[] = [];
  searchParam: any = {
    ruleId: '',
    dateTime: [],
    traceId: '',
    txType: ''
  };
  tableQueryParams: NzTableQueryParams = {
    pageIndex: 1,
    pageSize: 10,
    sort: [],
    filter: []
  };
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumb: [],
    extra: '',
    desc: '',
    footer: ''
  };

  transactionTypes = [
    { value: '', label: 'All' },
    { value: '1', label: 'Top-Up' },
    { value: '2', label: 'Withdraw' },
    { value: '3', label: 'Transfer' },
    { value: '4', label: 'FX Purchasing' }
  ];

  constructor(
    private route: ActivatedRoute,
    private journalService: JournalService,
    private cdr: ChangeDetectorRef,
    private date: DatePipe,
    private message: NzMessageService
  ) {}
  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: ``,
      breadcrumb: ['Financial Management', 'Statements and Reports'],
      extra: this.headerExtra,
      desc: this.headerContent,
      footer: ''
    };
  }

  ngOnInit() {
    this.initTable();
    this.route.queryParams.subscribe(params => {
      if (params['ruleId']) {
        this.searchParam.ruleId = params['ruleId'];
        this.getDataList(this.tableQueryParams);
      }
    });
  }

  private initTable(): void {
    this.tableConfig = {
      headers: [
        {
          title: 'Transaction ID',
          field: 'traceId',
          tdTemplate: this.traceIdTpl,
          width: 180
        },
        {
          title: 'Date',
          field: 'dateTime',
          pipe: 'timeStamp',
          width: 180
        },
        {
          title: 'Transaction Type',
          field: 'txType',
          tdTemplate: this.txTypeTpl,
          width: 120
        },
        {
          title: 'Blockchain',
          field: 'blockchain',
          width: 120
        },
        {
          title: 'Account Code',
          field: 'subjectCode',
          width: 120
        },
        {
          title: 'Account Name',
          field: 'subjectTitle',
          width: 180
        },
        {
          title: 'Particulars',
          field: 'particularsAccount',
          width: 180
        },
        {
          title: 'Debit',
          field: 'txAmount',
          tdTemplate: this.debitTpl,
          width: 120
        },
        {
          title: 'Credit',
          field: 'txAmount',
          tdTemplate: this.creditTpl,
          width: 120
        },
        {
          title: 'Actions',
          tdTemplate: this.actionTpl,
          fixed: true,
          fixedDir: 'right',
          width: 100
        }
      ],
      total: 0,
      loading: false,
      pageSize: 10,
      pageIndex: 1
    };
  }

  getDataList(e?: NzTableQueryParams): void {
    this.tableConfig.loading = true;
    this.tableChangeDectction();

    const params = {
      pageSize: this.tableConfig.pageSize!,
      pageNum: e?.pageIndex || this.tableConfig.pageIndex!,
      filters: this.searchParam
    };

    this.journalService.fetchTxList(params.pageNum, params.pageSize, params.filters)
      .subscribe({
        next: (_: any) => {
          if (_.code === 0) {
            this.dataList = _.data.rows;
            this.dataList.forEach((item: any, i: any) => {
              Object.assign(item, { key: (params.pageNum - 1) * 10 + i + 1 });
            });
            this.tableConfig.total = _.data.page.total;
            this.tableConfig.pageIndex = params.pageNum;
          }
          this.tableConfig.loading = false;
          this.tableChangeDectction();
        },
        error: () => {
          this.tableConfig.loading = false;
          this.tableChangeDectction();
        }
      });
  }

  tableChangeDectction(): void {
    this.dataList = [...this.dataList];
    this.cdr.detectChanges();
  }

  changePageSize(e: number): void {
    this.tableConfig.pageSize = e;
  }

  resetForm(): void {
    this.searchParam = {
      ruleId: this.searchParam.ruleId,
      dateTime: [],
      traceId: '',
      txType: ''
    };
    this.getDataList(this.tableQueryParams);
  }

  showTxDetails(row: any) {
    console.log('Show transaction details:', row);
  }

  getTransactionTypeName(type: number): string {
    const typeMap: { [key: number]: string } = {
      1: 'Top-up',
      2: 'Withdraw',
      3: 'Transfer In',
      4: 'Transfer Out'
    };
    return typeMap[type] || String(type);
  }

  copyTraceId(traceId: string, event: MouseEvent): void {
    event.stopPropagation();
    
    const tempInput = document.createElement('input');
    tempInput.value = traceId;
    document.body.appendChild(tempInput);
    
    tempInput.select();
    try {
      document.execCommand('copy');
      this.message.success('Copied successfully');
    } catch (err) {
      this.message.error('Copy failed');
      console.error('Copy failed:', err);
    }
    
    document.body.removeChild(tempInput);
  }
}
