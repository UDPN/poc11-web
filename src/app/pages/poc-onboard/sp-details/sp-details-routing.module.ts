import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { DeatilsGuard } from '@app/core/services/common/guard/details.guard';
import { SpDetailsComponent } from './sp-details.component';

const routes: Routes = [{ 
  path: '', 
  data: { key: 'sp-details', shouldDetach: 'no' }, component: SpDetailsComponent,
  // canActivate:[DeatilsGuard]
 }];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SpDetailsRoutingModule { }
