import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForeignExchangeApplyComponent } from './foreign-exchange-apply.component';
import { InfoComponent } from './info/info.component';
import { ActionCode } from '@app/config/actionCode';
import { AddComponent } from './add/add.component';
import { ReduceComponent } from './reduce/reduce.component';

const routes: Routes = [
  { 
    path: '', component: ForeignExchangeApplyComponent, data: { title: 'foreignExchangeApply', key: 'foreign-exchange-apply',  shouldDetach: 'no' } 
  },
  { 
    path: 'info', component: InfoComponent, data: { newTab: 'true', authCode: ActionCode.TabsDetail, title: 'foreignExchangeApply-Info', key: 'foreign-exchange-apply-info', shouldDetach: 'no' } 
  },
  { 
    path: 'add', component: AddComponent, data: { newTab: 'true', authCode: ActionCode.TabsDetail, title: 'foreignExchangeApply-Add', key: 'foreign-exchange-apply-add', shouldDetach: 'no' } 
  },
  { 
    path: 'reduce', component: ReduceComponent, data: { newTab: 'true', authCode: ActionCode.TabsDetail, title: 'foreignExchangeApply-Reduce', key: 'foreign-exchange-apply-reduce', shouldDetach: 'no' } 
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ForeignExchangeApplyRoutingModule { }
