import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActionCode } from '@app/config/actionCode';
import { AddComponent } from './add/add.component';
import { InfoComponent } from './info/info.component';
import { RoleComponent } from './role.component';

const routes: Routes = [
  { 
    path: '', component: RoleComponent, data: { title: 'Role Management', key: 'role', shouldDetach: 'no' } 
  },
  { 
    path: 'info', component: InfoComponent, data: { newTab: 'true', authCode: ActionCode.TabsDetail, title: 'Role Management-Info', key: 'role-info', shouldDetach: 'no' } 
  },
  { 
    path: 'add', component: AddComponent, data: { newTab: 'true', authCode: ActionCode.TabsDetail, title: 'Role Management-Create', key: 'role-add', shouldDetach: 'no' } 
  },
  { 
    path: 'edit', component: AddComponent, data: { newTab: 'true', authCode: ActionCode.TabsDetail, title: 'Role Management-Edit', key: 'role-edit', shouldDetach: 'no' } 
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoleRoutingModule { }
