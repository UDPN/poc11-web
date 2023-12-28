/*
 * @Author: zhangxuefeng
 * @Date: 2023-10-17 10:48:53
 * @LastEditors: zhangxuefeng
 * @LastEditTime: 2023-12-28 19:15:32
 * @Description:
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectivePreloadingStrategyService } from '@core/services/common/selective-preloading-strategy.service';
import { JudgeLoginGuard } from './core/services/common/guard/judgeLogin.guard';
import { DeatilsGuardChild } from './core/services/common/guard/informationChild.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login/login-modify', pathMatch: 'full' },
  {
    path: 'login',
    data: { preload: true },
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginModule)
  },
  {
    path: 'information',
    data: { preload: true },
    canActivateChild: [JudgeLoginGuard, DeatilsGuardChild],
    loadChildren: () =>
      import('./pages/information/information.module').then(
        (m) => m.InformationModule
      )
  },
  {
    path: 'poc',
    data: { preload: true },
    loadChildren: () =>
      import('./layout/default/default.module').then((m) => m.DefaultModule)
  },
  { path: '**', redirectTo: '/poc/poc-home/home' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: SelectivePreloadingStrategyService,
      scrollPositionRestoration: 'top',

      useHash: false
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
