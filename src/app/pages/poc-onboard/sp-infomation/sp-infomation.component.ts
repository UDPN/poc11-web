import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, UntypedFormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { WindowService } from '@app/core/services/common/window.service';
import { UModalComponent } from '@app/shared/components/u-modal/u-modal.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Location } from '@angular/common';
// import { BnJoinService } from '@app/core/services/http/bn-join/bn-join.service';
import { fnCheckForm } from '@app/utils/tools';
import { NzMessageService } from 'ng-zorro-antd/message';
import { delay, filter, finalize, interval, take, takeUntil, tap } from 'rxjs';
import { UpdateStoreService } from '@app/core/services/store/onboarding-store/update.service';
import { DestroyService } from '@app/core/services/common/destory.service';

@Component({
  selector: 'app-sp-infomation',
  templateUrl: './sp-infomation.component.html',
  styleUrls: ['./sp-infomation.component.less'],
  providers: [DestroyService]
})
export class SpInfomationComponent implements OnInit, AfterViewInit {

  validateForm!: FormGroup;
  countryListData!: any[];
  sendText = 'Verification Code';
  sendTextTime = '180s';
  codeStatus: string = 'a';
  fileImg: any = '';
  fileImgWord!: File;
  onSubmitStatus = false;
  updateStatus!: number;
  initData: any;

  constructor(private fb: FormBuilder, private modalService: NzModalService, private router: Router, private windowSrc: WindowService, private _location: Location, private message: NzMessageService, private cdr: ChangeDetectorRef, private updateStoreService: UpdateStoreService, private destroy$: DestroyService,) { }
  ngAfterViewInit(): void {
    // this._bnJoinService.fetchCountryList().subscribe(res => {
    //   this.countryListData = res;
    //   this.cdr.markForCheck();
    // })
  }

  ngOnInit(): void {
    // let sencStepData: any = this.windowSrc.getSessionStorage('sencStepData');
    // if (sencStepData === null) {
    //   this.validateForm = this.fb.group({
    //     nodeId: ['none'],
    //     enterpriseName: [null, [Validators.required, this.enterpriseValidator]], countryId: ['', [Validators.required]],
    //     nodeName: [null, [Validators.required, this.nodeValidator]],
    //     introduction: [null, [Validators.required, this.introductionValidator]], description: [null, [ this.descriptionValidator]], contactName: [null, [Validators.required, this.contactNameValidator]],
    //     phone: [null],
    //     email: [null, [Validators.required, this.emailValidator]],
    //     verificationCode: [null, [Validators.required, this.verificationCodeValidator]],
    //     businessLicense: [null, [Validators.required, this.businessLicenseValidator]],
    //     businessLicense_src: [null],
    //     detailedAddress: [null, [Validators.required, this.detailedAddressValidator]],
    //   });
    // } else {
    //   sencStepData = JSON.parse(sencStepData);
    //   this.fileImg = sencStepData['businessLicense_src'];
    //   this.fileImgWord = sencStepData['businessLicense'];
    //   this.validateForm = this.fb.group({
    //     nodeId: ['none'],
    //     enterpriseName: [sencStepData['enterpriseName'], [Validators.required, this.enterpriseValidator]],
    //     countryId: [sencStepData['countryId'], [Validators.required]],
    //     nodeName: [sencStepData['nodeName'], [Validators.required, this.nodeValidator]],
    //     introduction: [sencStepData['introduction'], [Validators.required, this.introductionValidator]],
    //     description: [sencStepData['description'], [ this.descriptionValidator]],
    //     contactName: [sencStepData['contactName'], [Validators.required, this.contactNameValidator]],
    //     phone: [sencStepData['phone']],
    //     email: [sencStepData['email'], [Validators.required, this.emailValidator]],
    //     verificationCode: [sencStepData['verificationCode'], [Validators.required, this.verificationCodeValidator]],
    //     businessLicense: [sencStepData['businessLicense'], [Validators.required, this.businessLicenseValidator]],
    //     businessLicense_src: [sencStepData['businessLicense_src']],
    //     detailedAddress: [sencStepData['detailedAddress'], [Validators.required, this.detailedAddressValidator]],
    //   });
    //   this.cdr.markForCheck();
    // }
    // this.updateStoreService.getDataUpdateStore().pipe(tap((next) => {
    //   this.updateStatus = next['state'];
    //   let step: any = this.windowSrc.getSessionStorage('oneStep');
    //   if (step === 'true') {
    //     throw 'not update';
    //   }
    // }), filter((x) => {
    //   return (x['state'] === 2010);
    // }), takeUntil(this.destroy$)).subscribe(res => {
    //   this._bnJoinService.downImg({ hash: res.nodeLicense }).subscribe(base64 => {
    //     this.validateForm.get('nodeId')?.setValue(res.nodeId);
    //     this.validateForm.get('email')?.setValue(res.nodeEmail);
    //     this.validateForm.get('countryId')?.setValue(res.countryId.toString());
    //     this.validateForm.get('enterpriseName')?.setValue(res.enterpriseName);
    //     this.validateForm.get('nodeName')?.setValue(res.udpnPeerName);
    //     this.validateForm.get('introduction')?.setValue(res.udpnPeerTitle);
    //     this.validateForm.get('verificationCode')?.setValue('');
    //     this.validateForm.get('businessLicense')?.setValue('default.png');
    //     this.validateForm.get('businessLicense_src')?.setValue('data:image/jpg;base64,' + base64);
    //     this.validateForm.get('description')?.setValue(res.udpnPeerDesc);
    //     this.validateForm.get('contactName')?.setValue(res.nodeContact);
    //     this.validateForm.get('phone')?.setValue(res.nodePhone);
    //     this.validateForm.get('detailedAddress')?.setValue(res.nodeAddr);
    //     this.fileImg = 'data:image/jpg;base64,' + base64;
    //     this.cdr.markForCheck();
    //     this.cdr.detectChanges();
    //   })

    // })

  }

  emailValidator = (control: UntypedFormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (!(/^[a-zA-Z0-9_+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,7}$/).test(control.value)) {
      return { regular: true, error: true };
    }
    return {};
  };

  enterpriseValidator = (control: UntypedFormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    }
    return {};
  };

  nodeValidator = (control: UntypedFormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (!(/^(\\$|[a-zA-Z])[a-zA-Z0-9]{1,50}$/).test(control.value)) {
      return { regular: true, error: true };
    }
    return {};
  };

  introductionValidator = (control: UntypedFormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    }
    return {};
  };

  verificationCodeValidator = (control: UntypedFormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    }
    return {};
  };

  businessLicenseValidator = (control: UntypedFormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    }
    return {};
  };

  descriptionValidator = (control: UntypedFormControl): { [s: string]: boolean } => {
    return {};
  };

  contactNameValidator = (control: UntypedFormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    }
    return {};
  };

  detailedAddressValidator = (control: UntypedFormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    }
    return {};
  };








  onSubmit() {
    // if (!fnCheckForm(this.validateForm)) {
    //   return;
    // }
    // this.modalService.confirm({
    //   nzClassName: "n-modal",
    //   nzTitle: 'Are you sure to submit?',
    //   nzContent: '<b>After the information is submitted, it will enter the review stage, please wait patiently</b>',
    //   nzOnOk: () => {
    //     this._bnJoinService.uploadImg(this.dataURLtoFile(this.validateForm.get('businessLicense_src')?.value, this.validateForm.get('businessLicense')?.value)).subscribe({
    //       next: path => {
    //         this.onSubmitStatus = true;
    //         this.validateForm.get('businessLicense')?.setValue(path);
    //         let oneStepData: any = this.windowSrc.getSessionStorage('oneStepData');
    //         oneStepData = JSON.parse(oneStepData);
    //         this.initData = this.windowSrc.getSessionStorage('initData');
    //         this.initData = JSON.parse(this.initData);

    //         if (this.updateStatus === 2010) {
    //           this._bnJoinService.editInsertNet({
    //             nodeId: this.initData['nodeId'],
    //             bnEmailCode: this.validateForm.get('verificationCode')?.value,
    //             chainMemberAddr: this.validateForm.get('detailedAddress')?.value,
    //             chainMemberContact: this.validateForm.get('contactName')?.value,
    //             chainMemberLicense: this.validateForm.get('businessLicense')?.value,
    //             chainMemberPhone: this.validateForm.get('phone')?.value,
    //             chainMemberUrl: 'https://127.0.0.1:8081',
    //             countryId: this.validateForm.get('countryId')?.value,
    //             enterpriseName: this.validateForm.get('enterpriseName')?.value,
    //             nodeEmail: this.validateForm.get('email')?.value,
    //             udpnDidDoc: oneStepData['udpnDidDocument'],
    //             udpnPeerDesc: this.validateForm.get('description')?.value,
    //             udpnPeerName: this.validateForm.get('nodeName')?.value,
    //             udpnPeerTitle: this.validateForm.get('introduction')?.value,
    //             version: oneStepData['radioValue'] === 'a' ? '0' : '1',
    //             didSignatureValue: oneStepData['udpnDidDocumentSig']
    //           }).subscribe({
    //             next: res => {

    //               this.message.success('The data has been submitted, please be patient!').onClose.subscribe(_ => {
    //                 this.windowSrc.removeSessionStorage("oneStep");
    //                 this.windowSrc.removeSessionStorage("secondStep");
    //                 this.windowSrc.removeSessionStorage("sencStepData");
    //                 this.windowSrc.removeSessionStorage("oneStepData");

    //                 this.router.navigateByUrl('/onboarding/bn-onboarding-details');
    //               });
    //             },
    //             error: any => {
    //               this.onSubmitStatus = false;
    //               this.cdr.markForCheck();
    //             },
    //             complete: () => {
    //               this.onSubmitStatus = false;
    //               this.cdr.markForCheck();
    //             }
    //           })
    //         } else {
    //           this._bnJoinService.insertNet({
    //             bnEmailCode: this.validateForm.get('verificationCode')?.value,
    //             chainMemberAddr: this.validateForm.get('detailedAddress')?.value,
    //             chainMemberContact: this.validateForm.get('contactName')?.value,
    //             chainMemberLicense: this.validateForm.get('businessLicense')?.value,
    //             chainMemberPhone: this.validateForm.get('phone')?.value,
    //             chainMemberUrl: 'https://127.0.0.1:8081',
    //             countryId: this.validateForm.get('countryId')?.value,
    //             enterpriseName: this.validateForm.get('enterpriseName')?.value,
    //             nodeEmail: this.validateForm.get('email')?.value,
    //             udpnDidDocument: oneStepData['udpnDidDocument'],
    //             udpnPeerDesc: this.validateForm.get('description')?.value,
    //             udpnPeerName: this.validateForm.get('nodeName')?.value,
    //             udpnPeerTitle: this.validateForm.get('introduction')?.value,
    //             version: oneStepData['radioValue'] === 'a' ? '0' : '1',
    //             didSignatureValue: oneStepData['udpnDidDocumentSig']
    //           }).subscribe({
    //             next: res => {

    //               this.message.success('The data has been submitted, please be patient!').onClose.subscribe(_ => {
    //                 this.windowSrc.removeSessionStorage("oneStep");
    //                 this.windowSrc.removeSessionStorage("secondStep");
    //                 this.windowSrc.removeSessionStorage("sencStepData");
    //                 this.windowSrc.removeSessionStorage("oneStepData");

    //                 this.router.navigateByUrl('/onboarding/bn-onboarding-details');
    //               });
    //             },
    //             error: err => {
    //               this.onSubmitStatus = false;
    //               this.cdr.markForCheck();
    //             },
    //             complete: () => {
    //               this.onSubmitStatus = false;
    //               this.cdr.markForCheck();
    //             }
    //           })
    //         }
    //       }
    //     })
    //   }
    // });
  }
  private dataURLtoFile(dataurl: string, filename: string) {
    let arr: any = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }


  onSend() {
    let emailVal = this.validateForm.get('email')?.value;
    if (emailVal !== null && (/^[a-zA-Z0-9_+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,7}$/).test(emailVal)) {
      this.checkOnMail(emailVal);
    } else {
      this.message.error('Please input your Contact Email Address')
    }
  }

  checkOnMail(email: string): void {
    this.codeStatus = 'b';

    // this._bnJoinService.fetchSendMailTime({ toEmail: email }).subscribe(res => {
    //   if (res.excessTime > 0) {
    //     this.message.error(`Please resend in ${res.excessTime} seconds!`);
    //     this.codeStatus = 'c';
    //     let numbers = interval(1000);
    //     let takeFourNumbers = numbers.pipe(take(res.excessTime));
    //     takeFourNumbers.subscribe(
    //       x => {
    //         this.sendTextTime = (res.excessTime - x) + "s";
    //         this.cdr.markForCheck();
    //       },
    //       error => { },
    //       () => {
    //         this.codeStatus = 'a';
    //         this.cdr.markForCheck();
    //       });
    //   } else {
    //     this.codeStatus = 'c';
    //     let numbers = interval(1000);
    //     let takeFourNumbers = numbers.pipe(take(180));
    //     takeFourNumbers.subscribe(
    //       x => {
    //         this.sendTextTime = (180 - x) + "s";
    //         this.cdr.markForCheck();
    //       },
    //       error => { },
    //       () => {
    //         this.codeStatus = 'a';
    //         this.cdr.markForCheck();
    //       });


    //     this._bnJoinService.sendMail({ toEmail: email }).subscribe(result => {
    //       this.message.success('Mail sent successfully!');
    //     })
    //   }
    // })
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
      this.validateForm.get('businessLicense')?.setValue(this.fileImgWord['name']);
      this.validateForm.get('businessLicense_src')?.setValue(this.fileImg);
    };

  }

  onBack(): void {

    this.windowSrc.setSessionStorage('oneStep', 'true');
    this.validateForm.get('verificationCode')?.setValue("");
    const param = this.validateForm.getRawValue();
    this.windowSrc.setSessionStorage('sencStepData', JSON.stringify(param));
    this._location.back();
  }
}
