import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditComponent } from './edit.component';
import { DeatilsGuard } from '@app/core/services/common/guard/informationDeatil.guard';

const routes: Routes = [
  {
    path: '',
    component: EditComponent,
    data: {
      title: 'informationEdit',
      key: 'information-edit',
      shouldDetach: 'no'
    },
    canActivate: [DeatilsGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditRoutingModule {}
