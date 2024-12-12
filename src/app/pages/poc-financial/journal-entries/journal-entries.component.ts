import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
interface SearchParam {
  ledgerName: string;
  tokenName: string;
  tokenType: string;
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
    tokenType: '',
    peggedCurrency: '',
    blockchain: '',
    createdOn: [],
    status: ''
  };
  resetForm() {
    // this.searchForm.reset();
  }
  getDataList(e?: NzTableQueryParams): void {}
  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: ``,
      breadcrumb: ['Financial Management', 'Journal Entries'],
      extra: this.headerExtra,
      desc: this.headerContent,
      footer: ''
    };
  }

  ngOnInit() {}
}
