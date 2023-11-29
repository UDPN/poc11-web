import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailComponent } from './detail.component';
import { DeatilsGuard } from '@app/core/services/common/guard/informationDeatil.guard';

const routes: Routes = [
  {
    path: '',
    component: DetailComponent,
    data: {
      title: 'informationDetail',
      key: 'information-detail',
      shouldDetach: 'no'
    },
    canActivate: [DeatilsGuard]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DetailRoutingModule {}
