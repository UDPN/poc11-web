import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { EnterpriseOnboardingComponent } from './enterprise-onboarding.component';
import { EnterpriseOnboardingRoutingModule } from './enterprise-onboarding-routing.module';
import { InfoComponent } from './info/info.component';
import { AddComponent } from './add/add.component';

@NgModule({
  declarations: [EnterpriseOnboardingComponent, InfoComponent, AddComponent],
  imports: [CommonModule, SharedModule, EnterpriseOnboardingRoutingModule]
})
export class EnterpriseOnboardingModule {}
