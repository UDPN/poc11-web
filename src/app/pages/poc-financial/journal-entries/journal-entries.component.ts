import { AfterViewInit, ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { SearchCommonVO } from '@app/core/services/types';
import { finalize } from 'rxjs';
import { JournalService } from '@app/core/services/http/poc-financial/journal/journal.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { CommonService } from '@app/core/services/http/common/common.service';

interface SearchParam {
  ledgerName: string;
  tokenName: string;
  peggedCurrency: string;
  blockchain: string;
  createdOn: Date[];
  status: string;
}

@Component({
  selector: 'app-journal-entries',
  templateUrl: './journal-entries.component.html',
  styleUrls: ['./journal-entries.component.less']
})
export class JournalEntriesComponent implements OnInit, AfterViewInit {
  @ViewChild('headerContent', { static: false })
  headerContent!: TemplateRef<NzSafeAny>;
  @ViewChild('headerExtra', { static: false })
  headerExtra!: TemplateRef<NzSafeAny>;
  @ViewChild('operationTpl', { static: true })
  operationTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('statusTpl', { static: true })
  statusTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('journalEntriesTpl', { static: true })
  journalEntriesTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('tokenPriceTpl', { static: true })
  tokenPriceTpl!: TemplateRef<NzSafeAny>;

  tableConfig!: AntTableConfig;
  dataList: NzSafeAny[] = [];
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumb: [],
    extra: '',
    desc: '',
    footer: ''
  };
  searchParam: Partial<SearchParam> = {
    ledgerName: '',
    tokenName: '',
    peggedCurrency: '',
    blockchain: '',
    createdOn: [],
    status: ''
  };
  tableQueryParams: NzTableQueryParams = {
    pageIndex: 1,
    pageSize: 10,
    sort: [],
    filter: []
  };
  tokenList: any[] = [];

  constructor(
    private cdr: ChangeDetectorRef,
    private message: NzMessageService,
    private fb: FormBuilder,
    private journalService: JournalService,
    private date: DatePipe,
    private router: Router,
    private modal: NzModalService,
    private commonService: CommonService
  ) {}

  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: ``,
      breadcrumb: ['Financial Management', 'Journal Entries'],
      extra: this.headerExtra,
      desc: this.headerContent,
      footer: ''
    };
    this.cdr.markForCheck();
  }

  ngOnInit() {
    this.initTable();
    this.getTokenList();
  }

  resetForm(): void {
    this.searchParam = {
      ledgerName: '',
      tokenName: '',
      peggedCurrency: '',
      blockchain: '',
      createdOn: [],
      status: ''
    };
    this.getDataList(this.tableQueryParams);
  }

  tableChangeDectction(): void {
    this.dataList = [...this.dataList];
    this.cdr.detectChanges();
  }

  changePageSize(e: number): void {
    this.tableConfig.pageSize = e;
  }

  getDataList(e?: NzTableQueryParams): void {
    this.tableConfig.loading = true;
    this.tableChangeDectction();

    const params: SearchCommonVO<any> = {
      pageSize: this.tableConfig.pageSize!,
      pageNum: e?.pageIndex || this.tableConfig.pageIndex!,
      filters: this.searchParam
    };
    
    this.journalService
      .fetchList(params.pageNum, params.pageSize, params.filters)
      .subscribe({
        next: (_: any) => {
          if (_.code === 0) {
            this.dataList = _.data.rows;
            console.log('Data with status:', this.dataList);
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

  private initTable(): void {
    this.tableConfig = {
      headers: [
        {
          title: 'No.',
          field: 'key',
          width: 80
        },
        {
          title: 'Ledger Name',
          field: 'ledgerName',
          width: 150
        },
        {
          title: 'Token Name',
          field: 'tokenName',
          width: 120
        },
        {
          title: 'Blockchain',
          field: 'blockchain',
          width: 120
        },
        {
          title: 'Pegged Currency',
          field: 'currencySymbol',
          width: 120
        },
        {
          title: 'Token Price',
          tdTemplate: this.tokenPriceTpl,
          width: 150
        },
        {
          title: 'Created on',
          field: 'createTime',
          pipe: 'timeStamp',
          width: 180
        },
        {
          title: 'Journal Entries',
          tdTemplate: this.journalEntriesTpl,
          width: 100
        },
        {
          title: 'Status',
          field: 'state',
          tdTemplate: this.statusTpl,
          width: 100
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

  onEdit(id: string) {
    this.router.navigate(['/poc/poc-financial/journal-entries/edit', id]);
  }

  onStatusUpdate(id: string, state: number) {
    const statusText = state === 1 ? 'activate' : 'deactivate';
    this.modal.confirm({
      nzTitle: `Are you sure you want to ${statusText} this rule?`,
      nzOnOk: () => {
        this.journalService.updateStatus({ ruleId: id, state }).subscribe({
          next: (res) => {
            if (res.code === 0) {
              this.message.success(`${statusText.charAt(0).toUpperCase() + statusText.slice(1)} successfully`);
              this.getDataList(this.tableQueryParams);
            } else {
              this.message.error(res.message || 'Operation failed');
            }
          },
          error: (err) => {
            this.message.error('Operation failed');
            console.error('Status update error:', err);
          }
        });
      }
    });
  }

  getTokenList() {
    this.commonService.tokenList().subscribe((res) => {
      this.tokenList = res;
      this.cdr.markForCheck();
    });
  }

  onQuery(): void {
    this.getDataList(this.tableQueryParams);
  }
}
