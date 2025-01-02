import {
  Component,
  TemplateRef,
  ViewChild,
  AfterViewInit,
  OnInit,
  ChangeDetectorRef,
  Input
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormRecord,
  NonNullableFormBuilder,
  UntypedFormControl,
  Validators
} from '@angular/forms';
import { DestroyService } from '@app/core/services/common/destory.service';
import { CommonService } from '@app/core/services/http/common/common.service';
import { BillService } from '@app/core/services/http/poc-settlement/bill/bill.service';
import { SearchCommonVO } from '@app/core/services/types';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { timeZoneIANA } from '@app/utils/tools';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { finalize } from 'rxjs';

interface SearchParam {
  billNo: any;
  transactionNo: string | number;
  fromBnId: string | number;
}

@Component({
  selector: 'app-transaction-info',
  templateUrl: './transaction-info.component.html',
  styleUrls: ['./transaction-info.component.less'],
  providers: [DestroyService]
})
export class TransactionInfoComponent implements OnInit {
  @ViewChild('amountTpl', { static: true }) amountTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('fromTpl', { static: true }) fromTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('commissionFeeTpl', { static: true })
  commissionFeeTpl!: TemplateRef<NzSafeAny>;
  searchParam: Partial<SearchParam> = {
    transactionNo: '',
    billNo: '',
    fromBnId: ''
  };

  currencyList: any = [];
  tableQueryParams: NzTableQueryParams = {
    pageIndex: 1,
    pageSize: 10,
    sort: [],
    filter: []
  };
  isVisibleInvoice: boolean = false;
  tableConfig!: AntTableConfig;
  dataList: NzSafeAny[] = [];
  isVisible: boolean = false;
  validateForm: FormRecord<FormControl<string>> = this.fb.record({});
  listOfControl: Array<{ id: number; controlInstance: string }> = [];
  isLoading: boolean = false;
  constructor(
    private billService: BillService,
    private cdr: ChangeDetectorRef,
    public _commonService: CommonService,
    private fb: NonNullableFormBuilder,
    private message: NzMessageService,
    private modal: NzModalService
  ) {}

  ngOnInit() {
    this.initTable();
    this.initSelect();
    this.addField();
  }

  tableChangeDectction(): void {
    this.dataList = [...this.dataList];
    this.cdr.detectChanges();
  }

  tableLoading(isLoading: boolean): void {
    this.tableConfig.loading = isLoading;
    this.tableChangeDectction();
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
    this.searchParam.billNo = sessionStorage.getItem('billNo') || '';
    this.tableConfig.loading = true;
    const params: SearchCommonVO<any> = {
      pageSize: this.tableConfig.pageSize!,
      pageNum: e?.pageIndex || this.tableConfig.pageIndex!,
      filters: this.searchParam
    };
    this.billService
      .getTransactionList(params.pageNum, params.pageSize, params.filters)
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

  getExport() {
    this.isVisible = true;
  }

  cancelExport(): void {
    this.isVisible = false;
    this.validateForm.reset();
    this.validateForm = this.fb.record({ email0: '' });
    this.listOfControl = [{ id: 0, controlInstance: 'email0' }];
    this.validateForm
      .get(this.listOfControl[0].controlInstance)
      ?.setValue(sessionStorage.getItem('email'));
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

  addField(e?: MouseEvent): void {
    e?.preventDefault();
    const id =
      this.listOfControl.length > 0
        ? this.listOfControl[this.listOfControl.length - 1].id + 1
        : 0;
    const control = {
      id,
      controlInstance: `email${id}`
    };
    const index = this.listOfControl.push(control);
    this.validateForm.addControl(
      this.listOfControl[index - 1].controlInstance,
      this.fb.control('', [Validators.required, this.emailValidator])
    );
    if (!this.validateForm.get(this.listOfControl[0].controlInstance)?.value) {
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

  onExport(): void {
    if (this.validateForm.valid) {
      let recipientList: any[] = [];
      recipientList = Object.values(this.validateForm.value);
      const params = {
        billNo: this.searchParam.billNo,
        billInfoId: this.searchParam.fromBnId,
        transactionNo: this.searchParam.transactionNo,
        recipientList
      };
      this.isLoading = true;
      const time = timeZoneIANA(this.dataList[0].transactionDate);
      this.billService
        .getExport(params, time)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe({
          next: (res) => {
            if (res.code === '0') {
              this.modal
                .success({
                  nzTitle: 'Export successfully !',
                  nzContent:
                    '<p style="color: red;">please submit the next export in 2 minutes</p>'
                })
                .afterClose.subscribe(() => {
                  this.validateForm.reset();
                  this.listOfControl = [{ id: 0, controlInstance: 'email0' }];
                  this.validateForm
                    .get(this.listOfControl[0].controlInstance)
                    ?.setValue(sessionStorage.getItem('email'));
                });
            }
            this.isLoading = false;
            this.cdr.markForCheck();
            this.isVisible = false;
          },
          error: (err) => {
            this.isLoading = false;
            this.cdr.markForCheck();
            this.isVisible = false;
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

  private initTable(): void {
    this.tableConfig = {
      headers: [
        {
          title: 'Transaction No.',
          field: 'transactionNo',
          notNeedEllipsis: true,
          width: 150
        },
        {
          title: 'BN ID',
          field: 'fromBnId',
          notNeedEllipsis: true,
          width: 120
        },
        {
          title: 'From',
          tdTemplate: this.fromTpl,
          notNeedEllipsis: true,
          width: 150
        },
        {
          title: 'To',
          field: 'toAccount',
          notNeedEllipsis: true,
          width: 150
        },
        {
          title: 'Amount',
          tdTemplate: this.amountTpl,
          notNeedEllipsis: true,
          width: 250
        },
        {
          title: 'Commission Fee',
          tdTemplate: this.commissionFeeTpl,
          notNeedEllipsis: true,
          width: 150
        },
        {
          title: 'Created On',
          field: 'transactionDate',
          pipe: 'timeStamp',
          notNeedEllipsis: true,
          width: 150
        },
        {
          title: 'Settle Model Code',
          field: 'settlementModelCode',
          notNeedEllipsis: true,
          width: 160
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
