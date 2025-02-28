/*
 * @Author: chenyuting
 * @Date: 2024-12-10 10:50:49
 * @LastEditors: chenyuting
 * @LastEditTime: 2024-12-10 11:30:57
 * @Description: 
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'journal-entries', pathMatch: 'full' },
  {
    path: 'journal-entries',
    data: { preload: true },
    loadChildren: () => import('./journal-entries/journal-entries.module').then(m => m.JournalEntriesModule)
  },
  {
    path: 'statements',
    data: { preload: true },
    loadChildren: () => import('./statements/statements.module').then(m => m.StatementsModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PocFinancialRoutingModule { }
