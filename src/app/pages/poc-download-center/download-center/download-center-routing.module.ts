import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActionCode } from '@app/config/actionCode';
import { DownloadCenterComponent } from './download-center.component';

const routes: Routes = [
  {
    path: '',
    component: DownloadCenterComponent,
    data: {
      newTab: 'true',
      authCode: ActionCode.TabsDetail,
      title: 'DownloadCenter',
      key: 'download-center',
      shouldDetach: 'no'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DownloadCenterRoutingModule {}
