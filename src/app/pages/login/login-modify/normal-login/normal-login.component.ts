import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  UntypedFormControl,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { finalize, takeUntil } from 'rxjs/operators';

import {
  IsFirstLogin,
  ThemeOptionsKey,
  TokenKey,
  TokenKeyDefault,
  TokenPre,
  aesKey,
  aesVi
} from '@config/constant';
import { DestroyService } from '@core/services/common/destory.service';
import { WindowService } from '@core/services/common/window.service';
import { LoginService } from '@services/login/login.service';
import { Login1StoreService } from '@store/biz-store-service/other-login/login1-store.service';
import { MenuStoreService } from '@store/common-store/menu-store.service';
import { SpinService } from '@store/common-store/spin.service';
import { UserInfoService } from '@store/common-store/userInfo.service';
import { LoginType } from '../login-modify.component';
import { fnCheckForm, fnEncrypts, fnRandomString } from '@app/utils/tools';
import { LoginInOutService } from '@app/core/services/common/login-in-out.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { environment } from '@env/environment';
import sign from 'jwt-encode';
import { ThemeService } from '@app/core/services/store/common-store/theme.service';
import { NzConfigService } from 'ng-zorro-antd/core/config';

export interface SettingInterface {
  theme: 'dark' | 'light';
  color: string;
  mode: 'side' | 'top' | 'mixi';
  colorWeak: boolean;
  greyTheme: boolean;
  fixedHead: boolean;
  splitNav: boolean;
  fixedLeftNav: boolean;
  fixedTab: boolean;
  hasTopArea: boolean;
  hasFooterArea: boolean;
  hasNavArea: boolean;
  hasNavHeadArea: boolean;
}

@Component({
  selector: 'app-normal-login',
  templateUrl: './normal-login.component.html',
  styleUrls: ['./normal-login.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyService]
})
export class NormalLoginComponent implements OnInit {
  validateForm!: FormGroup;
  passwordVisible = false;
  password?: string;
  typeEnum = LoginType;
  isOverModel = false;
  srcUrl: any;
  instance!: string;
  hasUser!: boolean;
  version: any;
  isLoadingName: boolean = true;
  isFirstLogin: any = '';
  _themesOptions: SettingInterface = {
    color: "#3c5686",
    colorWeak: false,
    fixedHead: true,
    fixedLeftNav: true,
    fixedTab: true,
    greyTheme: false,
    hasFooterArea: true,
    hasNavArea: true,
    hasNavHeadArea: true,
    hasTopArea: true,
    mode: "mixi",
    splitNav: false,
    theme: "dark"
  };
  constructor(
    private destroy$: DestroyService,
    private userInfoService: UserInfoService,
    private router: Router,
    private loginInOutService: LoginInOutService,
    private menuService: MenuStoreService,
    private dataService: LoginService,
    private windowServe: WindowService,
    private spinService: SpinService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private login1StoreService: Login1StoreService,
    private message: NzMessageService,
    private windowService: WindowService,
    private themesService: ThemeService, 
    private nzConfigService: NzConfigService,
  ) {}

  submitForm(): void {
    if (!fnCheckForm(this.validateForm)) {
      return;
    }
    this.spinService.setCurrentGlobalSpinStore(true);
    this.validateForm
      .get('keySuffix')
      ?.setValue(this.srcUrl.substring(this.srcUrl.indexOf('keySuffix=') + 10));
    const param = this.validateForm.getRawValue();
    const code = fnEncrypts(param, aesKey, aesVi);
    this.dataService.login({ code }).pipe(
      finalize(() => {
        this.spinService.setCurrentGlobalSpinStore(false);
      })
    ).subscribe(result => {
      if (result) {
        sessionStorage.setItem('clientName', result.realName);
        sessionStorage.setItem('email', result.email);
        let dataFromat: any = {
          aud: [],
          user_name: {
            resourceList: result.userResourceList ? result.userResourceList : [],
            clientId: 1,
          },
          scope: [],
          exp: 1676862164,
          authorities: [],
          jti: '',
          client_id: '',
        };
        let secret = 'bejson';
        let tokens = sign(dataFromat, secret);
        this.loginInOutService.loginIn(tokens).then(() => {
          this.message
            .success('Login successfully!', { nzDuration: 1000 })
            .onClose!.subscribe(() => {
              this.router.navigateByUrl('/poc/poc-home/home');
              // if (this.isFirstLogin === null) {
              //   this.nzConfigService.set('theme', {
              //     primaryColor: '#3c5686'
              //   });
              //   this._themesOptions.color = '#3c5686';
              // }
              // this.windowServe.setStorage(
              //   ThemeOptionsKey,
              //   JSON.stringify(this._themesOptions)
              // );
            });
        });
      }
    })
  }

  goOtherWay(type: LoginType): void {
    this.login1StoreService.setLoginTypeStore(type);
  }

  ngOnInit(): void {
    this.isFirstLogin = this.windowService.getStorage(IsFirstLogin);
    if (this.isFirstLogin === null) {
      console.log(this.isFirstLogin);
      
      this.nzConfigService.set('theme', {
        primaryColor: '#3c5686'
      });
      this._themesOptions.color = '#3c5686';
      this.windowServe.setStorage(
        ThemeOptionsKey,
        JSON.stringify(this._themesOptions)
      );
    }

 
    this.onRefresh();
    this.login1StoreService
      .getIsLogin1OverModelStore()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.isOverModel = res;
        this.cdr.markForCheck();
      });
    this.validateForm = this.fb.group({
      clientName: ['', [Validators.required]],
      pwd: ['', [Validators.required, this.pwdValidator]],
      captchaCode: ['', [Validators.required]],
      keySuffix: ['']
    });
  }

  pwdValidator = (control: UntypedFormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (
      !/^(?=.*[A-Z])(?=.*[0-9])[A-Za-z0-9]{8,20}$/.test(control.value)
    ) {
      return { regular: true, error: true };
    }
    return {};
  };

  onRefresh(): void {
    if (environment.production) {
      this.srcUrl =
        environment.localUrl +
        '/v1/fxsp/anon/generate/captcha?' +
        fnRandomString(8, '');
    } else {
      this.srcUrl =
        environment.localUrl +
        '/v1/fxsp/anon/generate/captcha?' +
        fnRandomString(8, '');
    }
  }
}
