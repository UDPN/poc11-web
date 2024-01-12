import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InformationModifyComponent } from './information-modify.component';

const routes: Routes = [{ path: '', component: InformationModifyComponent, data: { title: 'informationModify', key: 'information-modify',  shouldDetach: 'no' } }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InformationModifyRoutingModule { }
