import {
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { ForeignExchangeApplyService } from '@app/core/services/http/poc-profile/foreign-exchange-apply/foreign-exchange-apply.service';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { Location } from '@angular/common';
import { finalize } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PocCapitalPoolService } from '@app/core/services/http/poc-capital-pool/poc-capital-pool.service';


@Component({
  selector: 'app-reduce',
  templateUrl: './reduce.component.html',
  styleUrls: ['./reduce.component.less']
})
export class ReduceComponent implements OnInit {
  @ViewChild('selectAllTpl', { static: true })
  selectAllTpl!: TemplateRef<NzSafeAny>;
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
  tableConfig!: AntTableConfig;
  dataList: NzSafeAny[] = [
    {
      'id': '0',
      'currency': 'USDC',
      'platform': 'ETH'
    },
    {
      'id': '1',
      'currency': 'USDP',
      'platform': 'ETH'
    },
    {
      'id': '2',
      'currency': 'EURS',
      'platform': 'ETH'
    }
  ];
  indeterminate: boolean = false;
  checked: boolean = false;
  listOfCurrentPageData: readonly Data[] = [];
  setOfCheckedId = new Set<number>();
  isLoading: boolean = false;
  submitCurrency: any = [];
  constructor(
    public routeInfo: ActivatedRoute,
    private foreignExchangeApplyService: ForeignExchangeApplyService,
    private pocCapitalPoolService: PocCapitalPoolService,
    private cdr: ChangeDetectorRef,
    private location: Location,
    private message: NzMessageService
  ) { }
  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: `Reduce Currency`,
      breadcrumbs: [
        {
          name: 'Capital Pool Management',
          url: '/poc/poc-capital-pool/capital-pool'
        },
        { name: 'Reduce Currency' }
      ],
      extra: '',
      desc: '',
      footer: ''
    };
  }

  ngOnInit() {
    this.getReduceList();
    this.getInfo();
  }

  changePageSize(e: number): void {
    this.tableConfig.pageSize = e;
  }

  tableChangeDectction(): void {
    this.dataList = [...this.dataList];
    this.cdr.detectChanges();
  }

  tableLoading(isLoading: boolean): void {
    this.tableConfig.loading = isLoading;
    this.tableChangeDectction();
  }

  onCurrentPageDataChange(listOfCurrentPageData: readonly Data[]): void {
    this.listOfCurrentPageData = this.dataList;
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    const listOfEnabledData = this.listOfCurrentPageData.filter(({ disabled }) => !disabled);
    if (listOfEnabledData && listOfEnabledData.length > 0) {
      this.checked = listOfEnabledData.every(({ id }) => this.setOfCheckedId.has(id));
    };
    this.indeterminate = listOfEnabledData.some(({ id }) => this.setOfCheckedId.has(id)) && !this.checked;
    let array: any = [];
    this.setOfCheckedId.forEach((id) => {
      this.listOfCurrentPageData.forEach(item => {
        if (item['id'] === id) {
          array.push({
            capitalPoolCurrency: item['capitalPoolCurrency'],
            capitalPoolPlatform: item['capitalPoolPlatform'],
            capitalPoolAddress: item['capitalPoolAddress'],
          });
        }
      })
    })
    this.submitCurrency = array;
  }

  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  onAllChecked(checked: boolean): void {
    this.listOfCurrentPageData
      .filter(({ disabled }) => !disabled)
      .forEach(({ id }) => this.updateCheckedSet(id, checked));
    this.refreshCheckedStatus();
  }

  onSubmit() {
    this.isLoading = true;
    this.pocCapitalPoolService.reduce({ settlementInformations: this.submitCurrency }).pipe(finalize(() => this.isLoading = false)).subscribe({
      next: res => {
        if (res) {
          this.message.success('Reduce successfully!', { nzDuration: 1000 }).onClose.subscribe(() => {
            this.location.back();
          });
        }
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: err => {
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    })
  }

  onBack() {
    this.location.back();
  }

  getInfo(): void {
    this.foreignExchangeApplyService.getSpApprovedInfo().subscribe((res: any) => {
      this.info = res;
      this.cdr.markForCheck();
      return;
    });
  }

  getReduceList() {
    this.pocCapitalPoolService.reduceList().subscribe((res: any) => {
      this.dataList = res;
      this.dataList.forEach((item: any, index: number) => {
        item.id = index;
      })
      this.cdr.markForCheck();
      return;
    });
  }
}
