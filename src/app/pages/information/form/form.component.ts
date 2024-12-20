import {
  Component,
  OnInit,
  AfterViewInit,
  ChangeDetectorRef
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

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.less'],
  providers: [DestroyService]
})
export class FormInformationComponent implements OnInit, AfterViewInit {
  validateForm!: FormGroup;
  countryListData!: any[];

  fileImg: any = '';
  fileImgWord!: File;
  onSubmitStatus = false;
  updateStatus!: number;
  initData: any;
  selectValue: any = [];
  constructor(
    private fb: FormBuilder,
    private modalService: NzModalService,
    private router: Router,
    private windowSrc: WindowService,
    private _location: Location,
    public _informationService: InformationService,
    public _commonService: CommonService,
    private message: NzMessageService,
    private cdr: ChangeDetectorRef,
    private updateStoreService: UpdateStoreService,
    private destroy$: DestroyService
  ) {}
  ngAfterViewInit(): void {
    // this._commonService
    //   .commonApi({
    //     dropDownTypeCode: 'drop_down_country_info',
    //     csePCode: ''
    //   })
    //   .subscribe((res) => {
    //     this.countryListData = res.dataInfo;
    //     this.cdr.markForCheck();
    //   });
    this.validateForm.get('userNotice')?.valueChanges.subscribe((item: any) => {
      if (item === false) {
        this.validateForm.get('userNotice')?.setValue(null)
      }
    });
  }

  ngOnInit(): void {
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
      detailedAddress: [null, [Validators.required]],
      interbankSettlementStatus: [1, [Validators.required]],
      paymentStatus: [null],
      userNotice: [null, [Validators.required]]
    });
    this._informationService.detail().subscribe((res) => {
      this.validateForm.get('spName')?.setValue(res.spName);
      this.validateForm.get('bankBic')?.setValue(res.bankBic);
      this.validateForm.get('centralBankName')?.setValue(res.centralBankName);
      this.validateForm.get('peggedCurrency')?.setValue(res.peggedCurrency);
      this.validateForm.get('blockchain')?.setValue(res.blockchain);
      this.validateForm.get('contactName')?.setValue(res.contactName);
      this.validateForm.get('mobileNumber')?.setValue(res.mobileNumber);
      this.validateForm.get('email')?.setValue(res.email);
    });
  }

  goToPdf() {
    window.open('/assets/api-documentation/Project Kissen APIs.pdf');
  }
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

  onSubmit() {
    if (!fnCheckForm(this.validateForm)) {
      return;
    }
    this.modalService.confirm({
      nzClassName: 'n-modal',
      nzTitle: 'Are you sure to submit?',
      nzContent:
        '<b>After the information is submitted, it will enter the review stage, please wait patiently</b>',
      nzOnOk: () => {
        this.onSubmitStatus = true;
        this._informationService
          .addForm({
            spName: this.validateForm.get('spName')?.value,
            bankBic: this.validateForm.get('bankBic')?.value,
            contactName: this.validateForm.get('contactName')?.value,
            detailedAddress: this.validateForm.get('detailedAddress')?.value,
            email: this.validateForm.get('email')?.value,
            interbankSettlementStatus: this.validateForm.get('interbankSettlementStatus')?.value,
            mobileNumber: this.validateForm.get('mobileNumber')?.value,
            paymentStatus: this.validateForm.get('paymentStatus')?.value === true ? 1 : 0,
            spBriefIntroduction: this.validateForm.get('spBriefIntroduction')?.value,
            spDescription: this.validateForm.get('spDescription')?.value
          })
          .subscribe((result) => {
            this.onSubmitStatus = false;
            if (result) {
              this.message
                .success('The data has been submitted, please be patient!')
                .onClose.subscribe((_) => {
                  this.router.navigateByUrl('/information/detail');
                });
            }
            this.cdr.markForCheck();
          });
      }
    });
  }

  onDownload() {
    location.href = '../../../../assets/walletAddress/udpn-besu-sdk-1.0.0.jar';
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
}
