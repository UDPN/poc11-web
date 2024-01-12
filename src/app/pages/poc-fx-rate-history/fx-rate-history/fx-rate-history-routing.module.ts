import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FxRateHistoryComponent } from './fx-rate-history.component';
import { ActionCode } from '@app/config/actionCode';

const routes: Routes = [{ path: '', component: FxRateHistoryComponent, data: { newTab: 'true', authCode: ActionCode.TabsDetail, title: 'FxRateHistory', key: 'fx-rate-history', shouldDetach: 'no' } }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FxRateHistoryRoutingModule { }
