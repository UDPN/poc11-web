/*
 * @Author: zhangxuefeng
 * @Date: 2024-01-11 14:58:13
 * @LastEditors: zhangxuefeng
 * @LastEditTime: 2024-01-17 13:32:10
 * @Description: 
 */
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterFormComponent implements OnInit {
  validateForm!: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {}

  

  /*  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
      if (!control.value) {
        return {required: true};
      } else if (control.value !== this.validateForm.controls.password.value) {
        return {confirm: true, error: true};
      }
      return {};
    };*/

  submitForm(): void {
    this.router.navigateByUrl('main');
    Object.keys(this.validateForm.controls).forEach(key => {
      this.validateForm.controls[key].markAsDirty();
      this.validateForm.controls[key].updateValueAndValidity();
    });
    if (this.validateForm.invalid) {
      return;
    }
    const param = this.validateForm.getRawValue();
    /* this.dataService.login(param).subscribe((res) => {
       this.router.navigateByUrl('hazard');
     });*/
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      name: [null, [Validators.required]],
      password: [null, [Validators.required]],
      remember: [null]
    });
  }
}
