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
    private location: Location
  ) { }

  ngAfterViewInit(): void {
    this.getCreationMethod();
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

  getCreationMethod() {
    this.validateForm.get('creationMethod')?.valueChanges.subscribe((item: number) => {
      console.log(item);
      if (item === 2) {
        this.validateForm.addControl('walletAddress', this.fb.control('', [Validators.required]));
      } else {
        this.validateForm.removeControl('walletAddress');
      }
    })
  }

  ngOnInit() {
    this.validateForm = this.fb.group({
      creationMethod: [1, [Validators.required]],
      centralBank: ['', [Validators.required]],
      currency: ['', [Validators.required]],
      businessNode: [null, [Validators.required]],
    })
  }
  onSubmit() { }
  onBack() {
    this.location.back();
  }
}
