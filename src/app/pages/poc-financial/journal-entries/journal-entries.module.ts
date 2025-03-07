/*
 * @Author: chenyuting
 * @Date: 2024-12-10 10:56:38
 * @LastEditors: chenyuting
 * @LastEditTime: 2024-12-10 11:03:49
 * @Description: 
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JournalEntriesRoutingModule } from './journal-entries-routing.module ';
import { SharedModule } from '@app/shared/shared.module';
import { JournalEntriesComponent } from './journal-entries.component';
import { AddComponent } from './add/add.component';
import { DatePipe } from '@angular/common';
import { JournallistComponent } from './journal/journallist.component';



@NgModule({
  declarations: [JournalEntriesComponent,AddComponent,JournallistComponent],
  imports: [CommonModule, SharedModule, JournalEntriesRoutingModule],
  providers: [
    DatePipe
  ]
})
export class JournalEntriesModule {}
