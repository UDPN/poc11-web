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
    })
  }

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
