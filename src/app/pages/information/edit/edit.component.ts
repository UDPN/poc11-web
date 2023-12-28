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
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.less'],
  providers: [DestroyService]
})
export class EditComponent implements OnInit, AfterViewInit {
  validateForm!: FormGroup;
  countryListData!: any[];

  fileImg: any =
    'data:image/png;base64,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';
  fileImgWord!: File;
  onSubmitStatus = false;
  updateStatus!: number;
  initData: any;
  businessLicenseUrlOld!: string;
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
  ) { }
  ngAfterViewInit(): void {
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
    this.getWalletAddress();
    this.getCentralBank();
    this.validateForm = this.fb.group({
      spName: [null, [Validators.required, this.spNameValidator]],
      bankBic: [null, [Validators.required]],
      centralBankName: [null, [Validators.required]],
      spBriefIntroduction: [null, [Validators.required]],
      spDescription: [null, [Validators.required]],
      bnCode: [null, [Validators.required]],
      spBesuWalletAddress: [null, [Validators.required]],
      contactName: [null, [Validators.required]],
      mobileNumber: [null, [Validators.required]],
      email: [null, [Validators.required, this.emailValidator]],
      detailedAddress: [null, [Validators.required]],
      businessLicenseUrl: [null, [Validators.required]],
      fileName: [null, [Validators.required]],
    });
    this._informationService.detail().subscribe((res) => {
      this.validateForm.get('spName')?.setValue(res.spName);
      this.validateForm.get('bankBic')?.setValue(res.bankBic);
      this.validateForm.get('centralBankName')?.setValue(res.centralBankName);
      this.validateForm
        .get('spBriefIntroduction')
        ?.setValue(res.spBriefIntroduction);
      this.validateForm.get('spDescription')?.setValue(res.spDescription);
      this.validateForm.get('bnCode')?.setValue(res.bnCode);
      this.validateForm
        .get('spBesuWalletAddress')
        ?.setValue(res.spBesuWalletAddress);
      this.validateForm.get('contactName')?.setValue(res.contactName);
      this.validateForm.get('mobileNumber')?.setValue(res.mobileNumber);
      this.validateForm.get('email')?.setValue(res.email);
      this.validateForm.get('detailedAddress')?.setValue(res.detailedAddress);
      this.validateForm.get('fileName')?.setValue(res.fileName);
      this.validateForm
        .get('businessLicenseUrl')
        ?.setValue(res.businessLicenseUrl);
      this.businessLicenseUrlOld = res.businessLicenseUrl;
      this._informationService
        .downImg({ hash: res.businessLicenseUrl })
        .subscribe((resu) => {
          this.fileImg = 'data:image/jpg;base64,' + resu;
          this.cdr.markForCheck();
        });
    });
  }

  getCentralBank() {
    this._informationService.getCentralBank().subscribe((res) => {
      if (res) {
        this.validateForm.get('centralBankName')?.setValue(res.centralBankName);
      }
      this.cdr.markForCheck();
    });
  }

  getWalletAddress() {
    this._informationService.getWalletAddress().subscribe((res) => {
      this.validateForm.get('spBesuWalletAddress')?.setValue(res);
      this.cdr.markForCheck();
    });
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
        if (
          this.businessLicenseUrlOld ===
          this.validateForm.get('businessLicenseUrl')?.value
        ) {
          this._informationService
            .addForm(this.validateForm.value)
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
        } else {
          this._informationService
            .uploadImg(this.fileImgWord)
            .subscribe((res) => {
              this.validateForm.get('businessLicenseUrl')?.setValue(res);
              this._informationService
                .addForm(this.validateForm.value)
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
            });
        }
        // if (
        //   this.businessLicenseUrlOld ===
        //   this.validateForm.get('businessLicenseUrl')?.value
        // ) {
        //   this._informationService
        //     .addForm(this.validateForm.value)
        //     .subscribe((result) => {
        //       this.onSubmitStatus = false;
        //       this.message
        //         .success('The data has been submitted, please be patient!')
        //         .onClose.subscribe((_) => {
        //           this.router.navigateByUrl('/information/detail');
        //         });
        //       this.cdr.markForCheck();
        //     });
        // } else {
        //   this._informationService
        //     .uploadImg(this.fileImgWord)
        //     .subscribe((res) => {
        //       this.validateForm.get('businessLicenseUrl')?.setValue(res);
        //       this._informationService
        //         .editForm({
        //           spBriefIntroduction: this.validateForm.get(
        //             'spBriefIntroduction'
        //           )?.value,
        //           spDescription: this.validateForm.get('spDescription')?.value,
        //           bnCode: this.validateForm.get('bnCode')?.value,
        //           contactName: this.validateForm.get('contactName')?.value,
        //           mobileNumber: this.validateForm.get('mobileNumber')?.value,
        //           email: this.validateForm.get('email')?.value,
        //           detailedAddress:
        //             this.validateForm.get('detailedAddress')?.value,
        //           businessLicenseUrl:
        //             this.validateForm.get('businessLicenseUrl')?.value,
        //           spCode: this.validateForm.get('spCode')?.value
        //         })
        //         .subscribe((result) => {
        //           this.onSubmitStatus = false;
        //           this.message
        //             .success('The data has been submitted, please be patient!')
        //             .onClose.subscribe((_) => {
        //               this.router.navigateByUrl('/information/detail');
        //             });
        //           this.cdr.markForCheck();
        //         });
        //     });
        // }
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
        .get('fileName')
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
