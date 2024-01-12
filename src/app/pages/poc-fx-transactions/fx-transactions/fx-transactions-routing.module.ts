import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FxTransactionsComponent } from './fx-transactions.component';
import { InfoComponent } from './info/info.component';
import { ActionCode } from '@app/config/actionCode';

const routes: Routes = [
  { 
    path: '', component: FxTransactionsComponent, data: { title: 'fxTransactions', key: 'fx-transactions',  shouldDetach: 'no' } 
  },
  {
    path: 'info', component: InfoComponent, data: { newTab: 'true', authCode: ActionCode.TabsDetail, title: 'fxTransactions-Info', key: 'fx-transactions-info', shouldDetach: 'no' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FxTransactionsRoutingModule { }
