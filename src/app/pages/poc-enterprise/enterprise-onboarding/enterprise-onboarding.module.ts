import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { EnterpriseOnboardingComponent } from './enterprise-onboarding.component';
import { EnterpriseOnboardingRoutingModule } from './enterprise-onboarding-routing.module';

@NgModule({
  declarations: [EnterpriseOnboardingComponent],
  imports: [CommonModule, SharedModule, EnterpriseOnboardingRoutingModule]
})
export class EnterpriseOnboardingModule {}
