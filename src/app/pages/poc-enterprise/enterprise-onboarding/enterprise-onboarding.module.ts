import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { EnterpriseOnboardingRoutingModule } from './enterprise-onboarding-routing.module';
import { EnterpriseOnboardingComponent } from './enterprise-onboarding.component';
import { AddComponent } from './add/add.component';
import { InfoComponent } from './info/info.component';
import { BasicInfoComponent } from './info/basic-info/basic-info.component';
import { OperationRecordsComponent } from './info/operation-records/operation-records.component';
import { WalletsComponent } from './info/wallets/wallets.component';

@NgModule({
  declarations: [
    EnterpriseOnboardingComponent,
    AddComponent,
    InfoComponent,
    BasicInfoComponent,
    OperationRecordsComponent,
    WalletsComponent
  ],
  imports: [SharedModule, EnterpriseOnboardingRoutingModule]
})
export class EnterpriseOnboardingModule {}
