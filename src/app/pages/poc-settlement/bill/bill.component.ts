import {
  Component,
  TemplateRef,
  ViewChild,
  AfterViewInit,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';
import {
  FormControl,
  FormRecord,
  NonNullableFormBuilder,
  UntypedFormControl,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from '@app/core/services/http/common/common.service';
import { BillService } from '@app/core/services/http/poc-settlement/bill/bill.service';
import { SearchCommonVO } from '@app/core/services/types';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { timeZoneIANA } from '@app/utils/tools';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { finalize } from 'rxjs';

interface SearchParam {
  billNo: string;
  billCycle: string;
  bankId: string;
  bankName: string;
  currencyPair: string;
  creation: any;
}

interface ListParam {
  formPlatform: string;
  formCurrency: string;
  toPlatform: string;
  toCurrency: string;
}

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.less']
})
export class BillComponent implements OnInit, AfterViewInit {
  @ViewChild('headerContent', { static: false })
  headerContent!: TemplateRef<NzSafeAny>;
  @ViewChild('headerExtra', { static: false })
  headerExtra!: TemplateRef<NzSafeAny>;
  @ViewChild('operationTpl', { static: true })
  operationTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('currencyTpl', { static: true })
  currencyTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('fromTpl', { static: true }) fromTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('amountTpl', { static: true }) amountTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('commissionFeeTpl', { static: true })
  commissionFeeTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('billingAmountTpl', { static: true })
  billingAmountTpl!: TemplateRef<NzSafeAny>;
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumb: [],
    extra: '',
    desc: '',
    footer: ''
  };
  searchParam: Partial<SearchParam> = {
    creation: [],
    currencyPair: ''
  };

  listParam: Partial<ListParam> = {
    formPlatform: '',
    formCurrency: '',
    toPlatform: '',
    toCurrency: ''
  };
  currencyList: any = [];
  tableQueryParams: NzTableQueryParams = {
    pageIndex: 1,
    pageSize: 10,
    sort: [],
    filter: []
  };
  isVisibleInvoice: boolean = false;
  isVisibleExport: boolean = false;
  tableConfig!: AntTableConfig;
  // invoiceConfig!: AntTableConfig;
  dataList: NzSafeAny[] = [];
  invoiceList: any = [];
  invoiceInfo: any = {
    billNo: ''
  };
  isLoading: boolean = false;
  listOfControl: Array<{ id: number; controlInstance: string }> = [];
  validateForm: FormRecord<FormControl<string>> = this.fb.record({});
  constructor(
    private billService: BillService,
    private cdr: ChangeDetectorRef,
    public _commonService: CommonService,
    private router: Router,
    private fb: NonNullableFormBuilder,
    private modal: NzModalService
  ) { }
  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: ``,
      breadcrumb: ['Settlement Management', 'Monthly income statement'],
      extra: this.headerExtra,
      desc: this.headerContent,
      footer: ''
    };
  }

  ngOnInit() {
    this.initTable();
    this.initSelect();
    this.addField();
  }

  emailValidator = (control: UntypedFormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (
      !/^[a-zA-Z0-9_+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,7}$/.test(
        control.value
      )
    ) {
      return { regular: true, error: true };
    }
    return {};
  };

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
    (this.searchParam.creation = ''),
      (this.searchParam.currencyPair = ''),
      this.getDataList(this.tableQueryParams);
  }

  initSelect() {
    this._commonService
      .commonApi({ dropDownTypeCode: 'drop_down_exchange_rate_info' })
      .subscribe((res) => {
        this.currencyList = res.dataInfo;
        this.currencyList.map((item: any, i: any) => {
          Object.assign(item, { key: i + 1 });
        });
      });
  }

  changePageSize(e: number): void {
    this.tableConfig.pageSize = e;
  }

  getDataList(e?: NzTableQueryParams): void {
    this.currencyList.map((item: any) => {
      if (this.searchParam.currencyPair === item.key) {
        (this.listParam.formPlatform = item.sourcePlatform),
          (this.listParam.formCurrency = item.sourceCurrency),
          (this.listParam.toPlatform = item.targetPlatform),
          (this.listParam.toCurrency = item.targetCurrency);
      } else if (this.searchParam.currencyPair === '') {
        (this.listParam.formPlatform = ''),
          (this.listParam.formCurrency = ''),
          (this.listParam.toPlatform = ''),
          (this.listParam.toCurrency = '');
      }
    });
    this.tableConfig.loading = true;
    const params: SearchCommonVO<any> = {
      pageSize: this.tableConfig.pageSize!,
      pageNum: e?.pageIndex || this.tableConfig.pageIndex!,
      filters: {
        billNo: this.searchParam.billNo,
        billCycle: this.searchParam.billCycle,
        bankId: this.searchParam.bankId,
        bankName: this.searchParam.bankName,
        formPlatform: this.listParam.formPlatform,
        formCurrency: this.listParam.formCurrency,
        toPlatform: this.listParam.toPlatform,
        toCurrency: this.listParam.toCurrency,
        creation: this.searchParam.creation
      }
    };
    this.billService
      .getList(params.pageNum, params.pageSize, params.filters)
      .pipe(
        finalize(() => {
          this.tableLoading(false);
        })
      )
      .subscribe((_: any) => {
        this.dataList = _.data;
        this.tableConfig.total = _?.resultPageInfo?.total;
        this.tableConfig.pageIndex = params.pageNum;
        this.tableLoading(false);
        this.cdr.markForCheck();
      });
  }

  onInvoice(billNo: string) {
    this.isVisibleInvoice = true;
    this.billService.getInvoice({ billNo }).subscribe((res) => {
      this.invoiceInfo = res;
      // this.invoiceList = res.billInvoiceList;
      this.cdr.markForCheck();
    });
  }

  onDetail(billNo: string) {
    this.router.navigate(['/poc/poc-settlement/billing/info'], {
      queryParams: { billNo }
    });
    sessionStorage.setItem('billNo', billNo);
    this.cdr.markForCheck();
  }

  getExportPdf() {
    this.isVisibleExport = true;
    this.isVisibleInvoice = false;
  }

  cancelExportPdf(): void {
    this.isVisibleExport = false;
    this.validateForm.reset();
    this.validateForm = this.fb.record({ pdfEmail0: '' });
    this.listOfControl = [{ id: 0, controlInstance: 'pdfEmail0' }];
    this.validateForm
      .get(this.listOfControl[0].controlInstance)
      ?.setValue(sessionStorage.getItem('email'));
  }

  addField(e?: MouseEvent): void {
    e?.preventDefault();
    const id =
      this.listOfControl.length > 0
        ? this.listOfControl[this.listOfControl.length - 1].id + 1
        : 0;
    const control = {
      id,
      controlInstance: `pdfEmail${id}`
    };
    const index = this.listOfControl.push(control);
    this.validateForm.addControl(
      this.listOfControl[index - 1].controlInstance,
      this.fb.control('', [Validators.required, this.emailValidator])
    );
    if (!this.validateForm
      .get(this.listOfControl[0].controlInstance)
      ?.value) {
      this.validateForm
        .get(this.listOfControl[0].controlInstance)
        ?.setValue(sessionStorage.getItem('email'));
    }
  }

  removeField(i: { id: number; controlInstance: string }, e: MouseEvent): void {
    e.preventDefault();
    if (this.listOfControl.length > 1) {
      const index = this.listOfControl.indexOf(i);
      this.listOfControl.splice(index, 1);
      this.validateForm.removeControl(i.controlInstance);
    }
  }

  onExportPdf(): void {
    if (this.validateForm.valid) {
      let recipientList: any[] = [];
      recipientList = Object.values(this.validateForm.value);
      const params = {
        billNo: this.invoiceInfo.billNo,
        recipientList
      };
      this.isLoading = true;
      const time = timeZoneIANA(this.invoiceInfo.createDate);
      this.billService
        .getExportPdf(params, time)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe({
          next: (res) => {
            if (res.code === '0') {
              this.modal
                .success({
                  nzTitle: 'Export successfully !',
                  nzContent: ''
                })
                .afterClose.subscribe(() => {
                  this.validateForm.reset();
                  this.listOfControl = [
                    { id: 0, controlInstance: 'pdfEmail0' }
                  ];
                  this.validateForm
                    .get(this.listOfControl[0].controlInstance)
                    ?.setValue(sessionStorage.getItem('email'));
                });
            }
            this.isLoading = false;
            this.cdr.markForCheck();
            this.isVisibleExport = false;
          },
          error: (err) => {
            this.isLoading = false;
            this.cdr.markForCheck();
            this.isVisibleExport = false;
          }
        });
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  cancelInvoice(): void {
    this.isVisibleInvoice = false;
  }

  private initTable(): void {
    this.tableConfig = {
      headers: [
        {
          title: 'Statement No.',
          field: 'billNo',
          width: 200
        },
        {
          title: 'Cycle',
          field: 'billCycle',
          pipe: 'monthStamp',
          width: 150
        },
        {
          title: 'Bank ID',
          field: 'bankId',
          width: 180
        },
        {
          title: 'Bank Name',
          field: 'bankName',
          width: 200
        },
        {
          title: 'Currency Pair',
          tdTemplate: this.currencyTpl,
          width: 200
        },
        {
          title: 'Statement Amount',
          tdTemplate: this.billingAmountTpl,
          width: 150
        },
        {
          title: 'Creation Time',
          field: 'createDate',
          pipe: 'timeStamp',
          notNeedEllipsis: true,
          width: 180
        },
        {
          title: 'Actions',
          tdTemplate: this.operationTpl,
          fixed: true,
          fixedDir: 'right',
          showAction: false,
          width: 150
        }
      ],
      total: 0,
      showCheckbox: false,
      loading: false,
      pageSize: 10,
      pageIndex: 1
    };
    // this.invoiceConfig = {
    //   headers: [
    //     {
    //       title: 'Transaction No.',
    //       field: 'transactionNo',
    //       width: 200
    //     },
    //     {
    //       title: 'From',
    //       tdTemplate: this.fromTpl,
    //       width: 200
    //     },
    //     {
    //       title: 'To',
    //       field: 'toAccount',
    //       width: 180
    //     },
    //     {
    //       title: 'Amount',
    //       tdTemplate: this.amountTpl,
    //       width: 200
    //     },
    //     {
    //       title: 'Commission Fee',
    //       tdTemplate: this.commissionFeeTpl,
    //       width: 150
    //     },
    //     {
    //       title: 'Date',
    //       field: 'transactionDate',
    //       pipe: 'timeStamp',

    //       width: 150
    //     }
    //   ],
    //   total: 0,
    //   showCheckbox: false,
    //   loading: false,
    //   pageSize: 10,
    //   pageIndex: 1,
    // };
  }
}
