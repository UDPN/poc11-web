import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { NotificationsComponent } from './notifications.component';
import { NotificationsRoutingModule } from './notifications-routing.module';


@NgModule({
  declarations: [NotificationsComponent],
  imports: [
    CommonModule,
    SharedModule,
    NotificationsRoutingModule
  ]
})
export class NotificationsModule { }
