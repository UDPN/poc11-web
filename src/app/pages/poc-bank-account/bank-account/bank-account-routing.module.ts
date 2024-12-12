import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActionCode } from '@app/config/actionCode';
import { BankAccountComponent } from './bank-account.component';

const routes: Routes = [
  {
    path: '',
    component: BankAccountComponent,
    data: {
      newTab: 'true',
      authCode: ActionCode.TabsDetail,
      title: 'BankAccount',
      key: 'bank-account',
      shouldDetach: 'no'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BankAccountRoutingModule {}