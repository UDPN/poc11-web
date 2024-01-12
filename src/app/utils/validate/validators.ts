import { AbstractControl, ValidationErrors } from '@angular/forms';

import { isDecimal, isIdCard, isInt, isMobile, isNum, isUrl } from './validate';

export class _Validators {

  static num(control: AbstractControl): ValidationErrors | null {
    return isNum(control.value) ? null : { num: true };
  }

  static int(control: AbstractControl): ValidationErrors | null {
    return isInt(control.value) ? null : { int: true };
  }

  static decimal(control: AbstractControl): ValidationErrors | null {
    return isDecimal(control.value) ? null : { decimal: true };
  }

  static idCard(control: AbstractControl): ValidationErrors | null {
    return isIdCard(control.value) ? null : { idCard: true };
  }

  static mobile(control: AbstractControl): ValidationErrors | null {
    return isMobile(control.value) ? null : { mobile: true };
  }

  static url(control: AbstractControl): ValidationErrors | null {
    return isUrl(control.value) ? null : { url: true };
  }
}
