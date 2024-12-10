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

const routes: Routes = [
  {
    path: '',
    component: JournalEntriesComponent,
    data: { title: 'journalEntries', key: 'journal-entries', shouldDetach: 'no' }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JournalEntriesRoutingModule { }
