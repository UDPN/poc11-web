import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '@app/core/services/http/common/common.service';
import { PocCapitalPoolService } from '@app/core/services/http/poc-capital-pool/poc-capital-pool.service';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { Location } from '@angular/common';
import { el } from 'date-fns/locale';
import { CbdcWalletService } from '@app/core/services/http/poc-wallet/cbdc-wallet/cbdc-wallet.service';
import { finalize } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { fnCheckForm } from '@app/utils/tools';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.less']
})
export class AddComponent implements OnInit {
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumbs: [],
    extra: '',
    desc: '',
    footer: ''
  };
  validateForm!: FormGroup;
  centralBankList: any[] = [];
  walletAddressList: any[] = [];
  isLoading: boolean = false;
  constructor(
    public routeInfo: ActivatedRoute,
    private commonService: CommonService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private location: Location,
    private cbdcWalletService: CbdcWalletService,
    private message: NzMessageService,
  ) { }

  ngAfterViewInit(): void {
    this.creationMethodChanges();
    this.centralBankChanges();
    this.pageHeaderInfo = {
      title: `Create`,
      breadcrumbs: [
        {
          name: 'Wallet Management'
        },
        {
          name: 'CBDC Wallet Management',
          url: '/poc/poc-wallet/cbdc-wallet'
        },
        { name: 'Create' }
      ],
      extra: '',
      desc: '',
      footer: ''
    };
  }

  creationMethodChanges() {
    this.validateForm.get('creationMethod')?.valueChanges.subscribe((item: number) => {
      this.validateForm.get('centralBankId')?.reset('');
      this.validateForm.get('currency')?.reset('');
      if (item === 1) {
        this.validateForm.addControl('walletAddress', this.fb.control('', [Validators.required]));
        this.getWalletAddress();
      } else {
        this.validateForm.removeControl('walletAddress');
      }
    })
  }

  centralBankChanges() {
    this.validateForm.get('centralBankId')?.valueChanges.subscribe((value: number) => {
      this.centralBankList.forEach(item => {
        if (value === item.centralBankId) {
          this.getWalletAddress(item.centralBankId);
          this.validateForm.get('currency')?.setValue(item.digitalSymbol);
        }
      })
    })
  }

  ngOnInit() {
    this.getCentralBank();
    this.getBnNode();
    this.validateForm = this.fb.group({
      creationMethod: [0, [Validators.required]],
      centralBankId: ['', [Validators.required]],
      currency: ['', [Validators.required]],
      bnCode: [null, [Validators.required]],
    })
  }

  getCentralBank() {
    this.cbdcWalletService.getCentralBankAdd().subscribe((res) => {
      this.centralBankList = res;
    })
  }

  getBnNode() {
    this.cbdcWalletService.getBnNode().subscribe((res) => {
      if (res) {
        this.validateForm.get('bnCode')?.setValue(res);
      }
    })
  }

  getWalletAddress(centralBankId?: any) {
    this.cbdcWalletService.getWalletAddress({centralBankId}).subscribe((res) => {
      if (res) {
        this.walletAddressList = res;
      }
    })
  }

  onSubmit() { 
    if (!fnCheckForm(this.validateForm)) {
      return;
    }
    this.isLoading = true;
    const params = {
      bnCode: this.validateForm.value.bnCode,
      centralBankId: this.validateForm.value.centralBankId,
      creationMethod: this.validateForm.value.creationMethod,
      walletAddress: this.validateForm.value.walletAddress
    }
    this.cbdcWalletService.save(params).pipe(finalize(() => this.isLoading = false)).subscribe({
      next: res => {
        if (res) {
          this.message.success('Add successfully!', { nzDuration: 1000 }).onClose.subscribe(() => {
            this.validateForm.reset();
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
}
