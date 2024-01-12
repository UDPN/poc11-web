import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActionCode } from '@app/config/actionCode';
import { AddComponent } from './add/add.component';
import { InfoComponent } from './info/info.component';
import { UserComponent } from './user.component';

const routes: Routes = [
  { 
    path: '', component: UserComponent, data: { title: 'User Management', key: 'user', shouldDetach: 'no' } 
  },
  { 
    path: 'info', component: InfoComponent, data: { newTab: 'true', authCode: ActionCode.TabsDetail, title: 'User Management-Info', key: 'user-info', shouldDetach: 'no' } 
  },
  { 
    path: 'add', component: AddComponent, data: { newTab: 'true', authCode: ActionCode.TabsDetail, title: 'SUser Management-Create', key: 'user-add', shouldDetach: 'no' } 
  },
  { 
    path: 'edit', component: AddComponent, data: { newTab: 'true', authCode: ActionCode.TabsDetail, title: 'User Management-Edit', key: 'user=edit', shouldDetach: 'no' } 
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
