import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit, ChangeDetectionStrategy, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { takeUntil } from 'rxjs/operators';


import { IsNightKey } from '@config/constant';
import { DestroyService } from '@core/services/common/destory.service';
import { ThemeSkinService } from '@core/services/common/theme-skin.service';
import { WindowService } from '@core/services/common/window.service';
import { AdComponent, DynamicComponent } from '@core/services/types';
import { AdDirective } from '@shared/directives/ad.directive';
import { Login1StoreService } from '@store/biz-store-service/other-login/login1-store.service';
import { ThemeService } from '@store/common-store/theme.service';
import { NormalLoginComponent } from './normal-login/normal-login.component';
import { LoginService } from '@app/core/services/http/login/login.service';
import { LogoService } from '@app/core/services/http/poc-system/logo.service';


export enum LoginType {
  Normal,
  Phone,
  Qr,
  Register
}

interface LoginFormComponentInterface {
  type: LoginType;
  component: DynamicComponent;
}

@Component({
  selector: 'app-login-modify',
  templateUrl: './login-modify.component.html',
  styleUrls: ['./login-modify.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyService]
})
export class LoginModifyComponent implements OnInit {
  private adHost!: AdDirective;
  isOverModel = true;
  isNightTheme$ = this.themesService.getIsNightTheme();
  hasUser: boolean = true;
  isDefaultLogo: boolean = true;
  logoImg: string = '../../../../assets/imgs/system/bn.png';
  @ViewChild(AdDirective) set adHost1(content: AdDirective) {
    if (content) {
      this.adHost = content;
      this.subLoginType();
      this.cdr.detectChanges();
    }
  }

  formData: LoginFormComponentInterface[] = [
    { type: LoginType.Normal, component: new DynamicComponent(NormalLoginComponent, {}) },
  ];

  constructor(
    private destroy$: DestroyService,
    private themeSkinService: ThemeSkinService,
    private windowServe: WindowService,
    private cdr: ChangeDetectorRef,
    private login1StoreService: Login1StoreService,
    private breakpointObserver: BreakpointObserver,
    private themesService: ThemeService,
    private dataService: LoginService,
    private logoService: LogoService,
  ) { }

  getCurrentComponent(type: LoginType): LoginFormComponentInterface {
    return this.formData.find(item => item.type === type)!;
  }

  to(adItem: LoginFormComponentInterface): void {
    const viewContainerRef = this.adHost.viewContainerRef;
    viewContainerRef.clear();
    const componentRef = viewContainerRef.createComponent<AdComponent>(adItem.component.component);
    componentRef.instance.data = adItem.component.data;

    this.cdr.detectChanges();
  }

  changeNight(isNight: boolean): void {
    this.windowServe.setStorage(IsNightKey, `${isNight}`);
    this.themesService.setIsNightTheme(isNight);
    this.themeSkinService.toggleTheme().then(() => {
      this.cdr.markForCheck();
    });
  }

  subLoginType(): void {
    this.login1StoreService
      .getLoginTypeStore()
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        this.to(this.getCurrentComponent(res));
      });
  }

  ngOnInit(): void {
    this.getBnName();
    this.breakpointObserver
      .observe(['(max-width: 1200px)'])
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        this.isOverModel = res.matches;
        this.login1StoreService.setIsLogin1OverModelStore(res.matches);
        this.cdr.detectChanges();
      });
    // this.logoService.search({ logoType: 2 }).subscribe((res: any) => {
    //   if (res.length <= 0) {
    //     this.logoImg = '../../../../assets/imgs/system/bn.png';
    //     this.isDefaultLogo = true;
    //   } else {
    //     this.logoImg = res[0].logoBase64;
    //     this.isDefaultLogo = false;
    //   }
    //   this.cdr.markForCheck();
    // })

  }





  getBnName() {
    // this.dataService.fetchBnName().subscribe(res => {
    //   this.hasUser = res.hasUser;
    //   if (!res.hasUser) {
    //     this.login1StoreService.setLoginTypeStore(LoginType.Register);
    //   } else {
    //     this.login1StoreService.setLoginTypeStore(LoginType.Normal);
    //   }
    //   this.cdr.markForCheck();
    // })
  }
  onWeb() {
    window.open('https://udpn.io/');
  }
}
