import { NgModule } from '@angular/core';
import { RouterModule, Routes, CanActivateChild } from '@angular/router';
import { StepGuard } from '@app/core/services/common/guard/step.guard';
import { SpInfomationComponent } from './sp-infomation.component';

const routes: Routes = [{ 
  path: '', 
  data: { key: 'sp-infomation', shouldDetach: 'no' }, component: SpInfomationComponent,
  canActivate:[StepGuard]
 }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SpInfomationRoutingModule { }
