import {
  Component,
  OnInit,
  AfterViewInit,
  ChangeDetectorRef,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  UntypedFormControl
} from '@angular/forms';
import { Router } from '@angular/router';
import { WindowService } from '@app/core/services/common/window.service';
import { UModalComponent } from '@app/shared/components/u-modal/u-modal.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Location } from '@angular/common';
import { InformationService } from '@app/core/services/http/information/information.service';
import { fnCheckForm } from '@app/utils/tools';
import { NzMessageService } from 'ng-zorro-antd/message';
import { delay, filter, finalize, interval, take, takeUntil, tap } from 'rxjs';
import { UpdateStoreService } from '@app/core/services/store/onboarding-store/update.service';
import { DestroyService } from '@app/core/services/common/destory.service';
import { CommonService } from '@app/core/services/http/common/common.service';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';

interface SearchParam {
  nodeName: string;
  nodeCode: string;
  status: string;
  key: string;
  bizSN: string;
  nodeType: string;
  nodeTitle: string;
  remark: string;
  creation: any;
  fromVn: string;
}

@Component({
  selector: 'app-information-modify',
  templateUrl: './information-modify.component.html',
  styleUrls: ['./information-modify.component.less']
})
export class InformationModifyComponent implements OnInit, AfterViewInit {
  @ViewChild('authorizedTpl', { static: true })
  authorizedTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('currencyTpl', { static: true })
  currencyTpl!: TemplateRef<NzSafeAny>;
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
  validateForm!: FormGroup;
  countryListData!: any[];
  fileImg: any = '';
  fileImgWord!: File;
  onSubmitStatus: boolean = false;
  businessLicenseUrlOld!: string;
  spCode: any = '';
  tableConfig!: AntTableConfig;
  capitalPoolList: NzSafeAny[] = [];
  attachmentsList: any = [];
  bankType: any = '';
  info: any = {};
  constructor(
    private fb: FormBuilder,
    private modalService: NzModalService,
    private windowSrc: WindowService,
    private _location: Location,
    public _informationService: InformationService,
    public _commonService: CommonService,
    private cdr: ChangeDetectorRef
  ) {}
  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: ``,
      breadcrumb: ['System Management', 'Bank Information'],
      extra: this.headerExtra,
      desc: this.headerContent,
      footer: ''
    };
    this._commonService
      .commonApi({
        dropDownTypeCode: 'drop_down_country_info',
        csePCode: ''
      })
      .subscribe((res) => {
        this.countryListData = res.dataInfo;
        this.cdr.markForCheck();
      });
  }

  ngOnInit(): void {
    this.initTable();
    this.getInfo();
    this.getCapital();
    this.validateForm = this.fb.group({
      spName: [null, [Validators.required]],
      bankBic: [null, [Validators.required]],
      spBriefIntroduction: [
        null,
        [Validators.required, this.spBriefIntroductionValidator]
      ],
      spDescription: [null, [this.spDescriptionValidator]],
      centralBankName: [null, [Validators.required]],
      peggedCurrency: [null, [Validators.required]],
      blockchain: [null, [Validators.required]],
      contactName: [null, [Validators.required]],
      mobileNumber: [null],
      email: [null, [Validators.required, this.emailValidator]],
      detailedAddress: [null],
      interbankSettlementStatus: [1, [Validators.required]],
      paymentStatus: [null],
      userNotice: [null, [Validators.required]]
    });
  }

  changePageSize(e: number): void {
    this.tableConfig.pageSize = e;
  }

  getInfo() {
    this._informationService.detail().subscribe((res) => {
      this.info = res;
      this.validateForm.get('spName')?.setValue(res.spName);
      this.validateForm.get('bankBic')?.setValue(res.bankBic);
      this.validateForm.get('centralBankName')?.setValue(res.centralBankName);
      this.validateForm
        .get('spBriefIntroduction')
        ?.setValue(res.spBriefIntroduction);
      this.validateForm.get('spDescription')?.setValue(res.spDescription);
      this.validateForm.get('detailedAddress')?.setValue(res.detailedAddress);
      this.validateForm.get('peggedCurrency')?.setValue(res.peggedCurrency);
      this.validateForm.get('blockchain')?.setValue(res.blockchain);
      this.validateForm.get('contactName')?.setValue(res.contactName);
      this.validateForm.get('mobileNumber')?.setValue(res.mobileNumber);
      this.validateForm.get('email')?.setValue(res.email);
      this.validateForm
        .get('paymentStatus')
        ?.setValue(res.paymentStatus === 1 ? true : false);
      this.validateForm.get('userNotice')?.setValue(true);
    });
  }

  spBriefIntroductionValidator = (
    control: UntypedFormControl
  ): { [s: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (control.value?.length > 100) {
      return { regular: true, error: true };
    }
    return {};
  };

  spDescriptionValidator = (
    control: UntypedFormControl
  ): { [s: string]: boolean } => {
    if (control.value?.length > 500) {
      return { regular: true, error: true };
    }
    return {};
  };

  spNameValidator = (control: UntypedFormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (!/^[a-zA-Z][a-zA-Z0-9]{2,50}$/.test(control.value)) {
      return { regular: true, error: true };
    }
    return {};
  };

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

  onDownload() {
    location.href = '../../../../assets/walletAddress/udpn-besu-sdk-1.0.0.jar';
  }

  getCapital() {
    this._informationService.getUpgrade().subscribe((res: any) => {
      this.bankType = res.bankType;
      this.capitalPoolList = res.capitalPoolList;
      this.attachmentsList = res.fileList;
      this.cdr.markForCheck();
      return;
    });
  }

  onSubmit() {
    if (!fnCheckForm(this.validateForm)) {
      return;
    }
    const name = this.bankType === 1 ? 'Commercial Bank' : 'SP';
    this.modalService.confirm({
      nzClassName: 'n-modal',
      nzTitle: `Are you sure you want to modify the information of this ${name} ?`,
      nzOnOk: () => {
        this.onSubmitStatus = true;
        this._informationService
          .editForm({
            spName: this.validateForm.get('spName')?.value,
            bankBic: this.validateForm.get('bankBic')?.value,
            contactName: this.validateForm.get('contactName')?.value,
            detailedAddress: this.validateForm.get('detailedAddress')?.value,
            email: this.validateForm.get('email')?.value,
            interbankSettlementStatus: this.validateForm.get(
              'interbankSettlementStatus'
            )?.value,
            mobileNumber: this.validateForm.get('mobileNumber')?.value,
            paymentStatus:
              this.validateForm.get('paymentStatus')?.value === true ? 1 : 0,
            spBriefIntroduction: this.validateForm.get('spBriefIntroduction')
              ?.value,
            spDescription: this.validateForm.get('spDescription')?.value,
            spCode: this.info.spCode
          })
          .subscribe((result) => {
            this.onSubmitStatus = false;
            this.modalService
              .success({
                nzTitle: 'success',
                nzContent: 'edit success !'
              })
              .afterClose.subscribe((_) => {
                this.getInfo();
              });

            this.cdr.markForCheck();
          });
      }
    });
  }

  uploadFileImg($event: any) {
    if ($event.target.files.length === 0) {
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL($event.target.files[0]);
    reader.onload = () => {
      this.fileImg = reader.result;
      this.fileImgWord = $event.target.files[0];
      this.cdr.markForCheck();
      this.validateForm
        .get('businessLicense')
        ?.setValue(this.fileImgWord['name']);
      this.validateForm.get('businessLicenseUrl')?.setValue(this.fileImg);
      this.validateForm.get('fileName')?.setValue(this.fileImgWord['name']);
    };
  }

  onBack(): void {
    this.windowSrc.setSessionStorage('oneStep', 'true');
    this.validateForm.get('verificationCode')?.setValue('');
    const param = this.validateForm.getRawValue();
    this.windowSrc.setSessionStorage('sencStepData', JSON.stringify(param));
    this._location.back();
  }

  private base64ToBlob(urlData: string, type: string) {
    let arr = urlData.split(',');
    let array = arr[0].match(/:(.*?);/);
    let mime = (array && array.length > 1 ? array[1] : type) || type;
    let bytes = window.atob(arr[1]);
    let ab = new ArrayBuffer(bytes.length);
    let ia = new Uint8Array(ab);
    for (let i = 0; i < bytes.length; i++) {
      ia[i] = bytes.charCodeAt(i);
    }
    return new Blob([ab], {
      type: mime
    });
  }

  private downloadFile(base64: any, fileName: string) {
    const fileType = fileName.slice(fileName.lastIndexOf('.') + 1);
    let typeHeader = 'data:application/' + fileType + ';base64,';
    let converedBase64 = typeHeader + base64;
    let blob = this.base64ToBlob(converedBase64, fileType);
    this.downloadExportFile(blob, fileName);
  }

  private downloadExportFile(blob: any, fileName: string) {
    let downloadElement = document.createElement('a');
    let href = blob;
    if (typeof blob == 'string') {
      downloadElement.target = '_blank';
    } else {
      href = window.URL.createObjectURL(blob);
    }
    downloadElement.href = href;
    downloadElement.download = fileName;
    document.body.appendChild(downloadElement);
    downloadElement.click();
    document.body.removeChild(downloadElement);
    if (typeof blob != 'string') {
      window.URL.revokeObjectURL(href);
    }
  }

  onLoad(fileCode: string, fileUrl: string) {
    this._informationService.downImg({ hash: fileCode }).subscribe((res) => {
      this.downloadFile(res, fileUrl);
    });
  }

  private initTable(): void {
    this.tableConfig = {
      headers: [
        {
          title: 'Currency',
          field: 'capitalPoolCurrency',
          notNeedEllipsis: true,
          width: 180
        },
        {
          title: 'Account/Wallet (Capital Pool Address)',
          field: 'capitalPoolAddress',
          notNeedEllipsis: true,
          width: 300
        },
        {
          title: 'Pre-authorized Debit',
          tdTemplate: this.authorizedTpl,
          notNeedEllipsis: true,
          width: 120
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
