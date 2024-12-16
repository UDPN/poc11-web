/*
 * @Author: chenyuting
 * @Date: 2024-12-10 10:57:23
 * @LastEditors: chenyuting
 * @LastEditTime: 2024-12-10 10:59:27
 * @Description: 
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JournalEntriesComponent } from './journal-entries.component';
import { AddComponent } from './add/add.component';
import { ActionCode } from '@app/config/actionCode';

const routes: Routes = [
  {
    path: '',
    component: JournalEntriesComponent,
    data: { title: 'journalEntries', key: 'journal-entries', shouldDetach: 'no' }
  },
  {
    path: 'add',
    component: AddComponent,
    data: { title: 'journalEntries-add', authCode: ActionCode.TabsDetail, key: 'journal-entries-add', shouldDetach: 'no' }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JournalEntriesRoutingModule { }
