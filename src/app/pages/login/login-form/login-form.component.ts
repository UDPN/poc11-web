import { environment } from '@env/environment';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { LoginInOutService } from '@core/services/common/login-in-out.service';
import { WindowService } from '@core/services/common/window.service';
import { LoginService } from '@core/services/http/login/login.service';
import { MenuStoreService } from '@store/common-store/menu-store.service';
import { SpinService } from '@store/common-store/spin.service';
import { UserInfoService } from '@store/common-store/userInfo.service';
import { fnCheckForm, fnRandomString } from '@utils/tools';
import { TokenKeyDefault } from '@app/config/constant';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form-tmpl.component.html',
  styleUrls: ['./login-form.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginFormComponent implements OnInit {
  validateForm!: FormGroup;
  instance!: string;
  hasUser!: boolean;
  isAgree: boolean = false;
  agreeTool: boolean = false;
  constructor(
    private fb: FormBuilder,
    private loginInOutService: LoginInOutService,
    private menuService: MenuStoreService,
    private dataService: LoginService,
    private spinService: SpinService,
    private windowServe: WindowService,
    private userInfoService: UserInfoService,
    private router: Router,
    private message: NzMessageService
  ) {}

  submitForm(): void {
    
    
    
    

    
    
    
    
    
    
    
    
    
    
    
    
    
    
    

    
    
    
    
    
    
    
    
    
    
    
    
    

    
    
    

  }

  ngOnInit(): void {
    this.getBnName();
    this.validateForm = this.fb.group({
      clientName: ['admin', [Validators.required]],
      pwd: ['Abcd1234', [Validators.required, this.pwdValidator]],
      isAgree: [true, [Validators.required]]
    });
  }

  pwdValidator = (control: UntypedFormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (!(/^(?=.*[A-Z])(?=.*[0-9])[A-Za-z0-9]{8,20}$/).test(control.value)) {
      return { regular: true, error: true };
    }
    return {};
  };

  getBnName() {
    // this.dataService.fetchBnName().subscribe(res => {
    //   this.instance = res.instance;
    //   this.hasUser = res.hasUser;
    // })
  }
}
