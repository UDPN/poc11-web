import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { fnCheckForm } from '@utils/tools';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangePasswordComponent implements OnInit {
  passwordVisible = false;
  compirePasswordVisible = false;

  constructor(private modalRef: NzModalRef, private fb: NonNullableFormBuilder) {}

  get newPwd(): string {
    return this.validateForm.controls.newPwd.value!;
  }

  protected getCurrentValue(): Observable<any> {
    if (!fnCheckForm(this.validateForm)) {
      return of(false);
    }
    return of(this.validateForm.value);
  }

  newPwdValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (!(/^(?=.*[A-Z])(?=.*[0-9])[A-Za-z0-9]{8,20}$/).test(control.value)) {
      return { regular: true, error: true };
    } else if(control.value !== this.validateForm.get('verifyPwd')?.value) {
      this.validateForm.get('verifyPwd')?.setValue(null);
    } 
    if(control.value === this.validateForm.get('oldPwd')?.value) {
      return { confirm: true, error: true };
    }
    return {};
  };

  
  
  
  
  
  
  
  

  verifyPwdValidator = (control: FormControl): { [s: string]: any } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.controls.newPwd.value) {
      return { confirm: true, error: true };
    }
    return {};
  };
  validateForm = this.fb.group({
    oldPwd: [null, [Validators.required]],
    newPwd: [null, [Validators.required, this.newPwdValidator]],
    verifyPwd: [null, [Validators.required, this.verifyPwdValidator]],
  });

  updateConfirmValidator(): void {
    Promise.resolve().then(() => this.validateForm.controls.verifyPwd.updateValueAndValidity());
  }

  ngOnInit(): void {}
}
