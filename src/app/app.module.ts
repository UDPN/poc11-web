import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CoreModule } from '@core/core.module';
import { InitThemeService } from '@core/services/common/init-theme.service';
import { LoadAliIconCdnService } from '@core/services/common/load-ali-icon-cdn.service';
import { SubLockedStatusService } from '@core/services/common/sub-locked-status.service';
import { SubWindowWithService } from '@core/services/common/sub-window-with.service';
import { ThemeSkinService } from '@core/services/common/theme-skin.service';
import { StartupService } from '@core/startup/startup.service';
import { SharedModule } from '@shared/shared.module';
import { LoginModalModule } from '@widget/biz-widget/login/login-modal.module';
import { PasswordStrengthMeterModule } from 'angular-password-strength-meter';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import interceptors from './core/services/interceptors';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';

export function StartupServiceFactory(startupService: StartupService) {
  return () => startupService.load();
}

export function LoadAliIconCdnFactory(
  loadAliIconCdnService: LoadAliIconCdnService
) {
  return () => loadAliIconCdnService.load();
}

export function InitThemeServiceFactory(initThemeService: InitThemeService) {
  return async () => await initThemeService.initTheme();
}

export function InitLockedStatusServiceFactory(
  subLockedStatusService: SubLockedStatusService
) {
  return () => subLockedStatusService.initLockedStatus();
}

export function SubWindowWithServiceFactory(
  subWindowWithService: SubWindowWithService
) {
  return () => subWindowWithService.subWindowWidth();
}

registerLocaleData(en);


const APPINIT_PROVIDES = [
  
  {
    provide: APP_INITIALIZER,
    useFactory: StartupServiceFactory,
    deps: [StartupService],
    multi: true,
  },
  
  {
    provide: APP_INITIALIZER,
    useFactory: LoadAliIconCdnFactory,
    deps: [LoadAliIconCdnService],
    multi: true,
  },
  
  {
    provide: APP_INITIALIZER,
    useFactory: InitLockedStatusServiceFactory,
    deps: [SubLockedStatusService],
    multi: true,
  },
  
  {
    provide: APP_INITIALIZER,
    useFactory: InitThemeServiceFactory,
    deps: [InitThemeService],
    multi: true,
  },
  
  {
    provide: APP_INITIALIZER,
    useFactory: SubWindowWithServiceFactory,
    deps: [SubWindowWithService],
    multi: true,
  },
  
  {
    provide: APP_INITIALIZER,
    useFactory: (themeService: ThemeSkinService) => () => {
      return themeService.loadTheme();
    },
    deps: [ThemeSkinService],
    multi: true,
  },
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CoreModule,
    SharedModule,
    LoginModalModule,
    PasswordStrengthMeterModule.forRoot(),
    AppRoutingModule,
  ],
  providers: [
    ...interceptors,
    ...APPINIT_PROVIDES,
    { provide: NZ_I18N, useValue: en_US },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
