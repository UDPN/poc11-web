/*
 * @Author: zhangxuefeng
 * @Date: 2023-12-21 10:39:22
 * @LastEditors: zhangxuefeng
 * @LastEditTime: 2024-01-17 15:46:29
 * @Description:
 */
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from '@env/environment';
if (environment.production) {
  // window.console.log = function () {};
  // window.console.info = function () {};
  // window.console.warn = function () {};
  // window.console.error = function () {};
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
