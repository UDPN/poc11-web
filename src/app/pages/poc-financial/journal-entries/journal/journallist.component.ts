import { Component, OnInit, ChangeDetectorRef, AfterViewInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  @ViewChild('accountCodeTpl', { static: true })
  accountCodeTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('accountNameTpl', { static: true })
  accountNameTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('particularsTpl', { static: true })
  particularsTpl!: TemplateRef<NzSafeAny>;
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
    private message: NzMessageService,
    private router: Router
  ) {}
  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: ``,
      breadcrumb: ['Financial Management', 'Journal Entries'],
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
          field: 'blockchainName',
          width: 120
        },
        {
          title: 'Account Code',
          field: 'transactions',
          tdTemplate: this.accountCodeTpl,
          width: 120
        },
        {
          title: 'Account Name',
          field: 'transactions',
          tdTemplate: this.accountNameTpl,
          width: 180
        },
        {
          title: 'Particulars',
          field: 'transactions',
          tdTemplate: this.particularsTpl,
          width: 180
        },
        {
          title: 'Debit',
          field: 'transactions',
          tdTemplate: this.debitTpl,
          width: 120
        },
        {
          title: 'Credit',
          field: 'transactions',
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
      pageIndex: 1,
      showCheckbox: false
    };
  }

  getDataList(e?: NzTableQueryParams | number): void {
    this.tableConfig.loading = true;
    this.tableChangeDectction();

    const params = {
      pageSize: this.tableConfig.pageSize!,
      pageNum: typeof e === 'number' ? e : (e?.pageIndex || this.tableConfig.pageIndex!),
      filters: this.searchParam
    };

    this.journalService.fetchTxList(params.pageNum, params.pageSize, params.filters)
      .subscribe({
        next: (response: any) => {
          if (response.code === 0) {
            // 按 txHash 分组数据
            const groupedData = new Map<string, any[]>();
            response.data.rows.forEach((item: any) => {
              if (!groupedData.has(item.txHash)) {
                groupedData.set(item.txHash, []);
              }
              groupedData.get(item.txHash)?.push(item);
            });

            // 转换为显示所需的格式
            this.dataList = Array.from(groupedData.values()).map((group, index) => {
              // 确保每组至少有一条记录
              const firstRecord = group[0];
              
              // 按照 loanType 排序交易记录
              const sortedTransactions = group.sort((a, b) => {
                // 首先按照 loanType 排序
                if (a.loanType !== b.loanType) {
                  return a.loanType - b.loanType;
                }
                // 如果 loanType 相同，按照 subjectCode 排序
                return a.subjectCode.localeCompare(b.subjectCode);
              });

              // 创建合并后的记录
              const mergedRecord = {
                key: (params.pageNum - 1) * 10 + index + 1,
                traceId: firstRecord.traceId,
                dateTime: firstRecord.dateTime,
                txType: firstRecord.txType,
                blockchainName: firstRecord.blockchainName,
                ruleId: firstRecord.ruleId,
                transactions: sortedTransactions.map(item => ({
                  subjectCode: item.subjectCode,
                  subjectTitle: item.subjectTitle,
                  particularsAccount: item.particularsAccount,
                  txAmount: item.txAmount,
                  loanType: item.loanType
                }))
              };

              return mergedRecord;
            });

            this.tableConfig.total = response.data.page.total;
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

  changePageSize(size: number): void {
    this.tableConfig.pageSize = size;
    this.getDataList(1);
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

  showTxDetails(ruleId: string) {
    this.router.navigate(['/poc/poc-wallet/cbdc-transaction']);
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
