/*
 * @Author: zhangxuefeng
 * @Date: 2023-12-21 10:39:22
 * @LastEditors: zhangxuefeng
 * @LastEditTime: 2024-01-31 12:43:51
 * @Description:
 */
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from '@env/environment';
if (environment.production) {
  window.console.log = function () {};
  window.console.info = function () {};
  window.console.warn = function () {};
  window.console.error = function () {};
}
console.log('>>> NX_API_URL', process.env['NX_API_URL']);
platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
