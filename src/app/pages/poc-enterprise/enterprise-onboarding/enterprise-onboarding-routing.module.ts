/*
 * @Author: zhangxuefeng
 * @Date: 2023-10-17 10:48:53
 * @LastEditors: chenyuting
 * @LastEditTime: 2025-01-15 16:50:30
 * @Description:
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EnterpriseOnboardingComponent } from './enterprise-onboarding.component';
import { ActionCode } from '@app/config/actionCode';
import { InfoComponent } from './info/info.component';
import { AddComponent } from './add/add.component';

const routes: Routes = [
  {
    path: '',
    component: EnterpriseOnboardingComponent,
    data: {
      title: 'enterpriseOnboarding',
      key: 'enterprise-onboarding',
      shouldDetach: 'no'
    }
  },
  {
    path: 'info',
    component: InfoComponent,
    data: {
      title: 'enterpriseOnboardingInfo',
      key: 'enterprise-onboarding-info',
      authCode: ActionCode.TabsDetail,
      shouldDetach: 'no'
    }
  },
  {
    path: 'add',
    component: AddComponent,
    data: {
      title: 'enterpriseOnboardingAdd',
      key: 'enterprise-onboarding-add',
      authCode: ActionCode.TabsDetail,
      shouldDetach: 'no'
    }
  },
  {
    path: 'edit',
    component: AddComponent,
    data: {
      title: 'enterpriseOnboardingEdit',
      key: 'enterprise-onboarding-edit',
      authCode: ActionCode.TabsDetail,
      shouldDetach: 'no'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EnterpriseOnboardingRoutingModule {}
