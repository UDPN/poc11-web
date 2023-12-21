import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActionCode } from '@app/config/actionCode';
import { SystemStyleComponent } from './system-style.component';

const routes: Routes = [
  { 
    path: '', component: SystemStyleComponent, data: { title: 'System Style', key: 'system-style', shouldDetach: 'no' } 
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemStyleRoutingModule { }
