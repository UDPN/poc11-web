import {
  Component,
  TemplateRef,
  ViewChild,
  AfterViewInit,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '@app/core/services/http/login/login.service';
import { PocCapitalPoolService } from '@app/core/services/http/poc-capital-pool/poc-capital-pool.service';
import { ThemeService } from '@app/core/services/store/common-store/theme.service';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';

@Component({
  selector: 'app-fx-purchasing',
  templateUrl: './fx-purchasing.component.html',
  styleUrls: ['./fx-purchasing.component.less']
})
export class FxPurchasingComponent implements OnInit, AfterViewInit {
  @ViewChild('headerContent', { static: false })
  headerContent!: TemplateRef<NzSafeAny>;
  @ViewChild('headerExtra', { static: false })
  headerExtra!: TemplateRef<NzSafeAny>;
  @ViewChild('selectRadioTpl', { static: true })
  selectRadioTpl!: TemplateRef<NzSafeAny>;
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumb: [],
    extra: '',
    desc: '',
    footer: ''
  };
  validateForm!: FormGroup;
  nzLoading: boolean = false;
  isLoading: boolean = false;
  beneficialBankNameList: any[] = [];
  transactionWalletAddressList: any[] = [];
  tableConfig!: AntTableConfig;
  setOfCheckedId = new Set<string>();
  checkedItemComment: NzSafeAny[] = [];
  radioValue: any = '';
  passwordForm!: FormGroup;
  dataList: NzSafeAny[] = [
    {
      spName: 'Bank of China',
      currencyPair: '1USD -> EUR',
      rate: '0.93',
      commission: '5 w-EUR',
      amount: '9,305.00 w-EUR',
    },
    {
      spName: 'Bank of Communications',
      currencyPair: '1USD -> EUR',
      rate: '0.92',
      commission: '6 w-EUR',
      amount: '9,305.00 w-EUR',
    }
  ];
  isVisible: boolean = false;
  isVisibleEnterPassword: boolean = false;
  constructor(
    private pocCapitalPoolService: PocCapitalPoolService,
    private themesService: ThemeService,
    private dataService: LoginService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
  ) { }
  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: ``,
      breadcrumb: ['Remittance Management', 'FX Purchasing'],
      extra: this.headerExtra,
      desc: this.headerContent,
      footer: ''
    };
  }

  ngOnInit() {
    this.validateForm = this.fb.group({
      receivingBankName: [null, [Validators.required]],
      receivingWalletAddress: [null, [Validators.required]],
      amount: [null, [Validators.required]],
      transactionWalletAddress: [null, [Validators.required]],
      availableBalance: [null, [Validators.required]],
      transactionBankName: [null, [Validators.required]],
    })
    this.passwordForm = this.fb.group({
      password: ['', [Validators.required]],
    });
  }

  onItemChecked(id: string, checked: boolean): void {
    this.updateCheckedSet(id, checked);
  }

  onChecked(): void {
    this.checkedItemComment = [];
    this.dataList.forEach((item: any, index: number) => {
      if (this.radioValue === index) {
        this.checkedItemComment.push(item);
      }
    });
    console.log(this.checkedItemComment);
  }

  updateCheckedSet(id: string, checked: boolean): void {
    this.setOfCheckedId.clear();
    this.dataList.forEach((item: any, index: number) => {
      if (checked) {
        this.setOfCheckedId.add(id);
        if (index.toString() === id) {
          this.checkedItemComment = [];
          this.checkedItemComment.push(item);
        }
      } else {
        this.setOfCheckedId.delete(id);
      }
    });
  }

  onSubmit() { 
    this.isVisible = true;
  }

  cancelView() {
    this.isVisible = false;
  }

  confirmView() {
    this.isVisible = false;
    this.isVisibleEnterPassword = true;
  }

  cancelEnterPassword() {
    this.isVisibleEnterPassword = false;
  }
  confirmEnterPassword() {}
}
