import { DOCUMENT, registerLocaleData } from '@angular/common';
import { HttpBackend, HttpClient } from '@angular/common/http';
import zh from '@angular/common/locales/zh';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { RouteReuseStrategy } from '@angular/router';

import { ScrollService } from '@core/services/common/scroll.service';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NZ_I18N, zh_CN } from 'ng-zorro-antd/i18n';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';

import { SimpleReuseStrategy } from './services/common/reuse-strategy';

registerLocaleData(zh);

export function HttpLoaderFactory(http: HttpBackend) {
  return new MultiTranslateHttpLoader(http, [
    { prefix: "./assets/translate/code/", suffix: ".json" },

  ]);
}

@NgModule({
  imports: [
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpBackend]
      }
    }),
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: SimpleReuseStrategy, deps: [DOCUMENT, ScrollService] },
    { provide: NZ_I18N, useValue: zh_CN }
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(`CoreModule has already been loaded. Import Core modules in the AppModule only.`);
    }
  }
}
