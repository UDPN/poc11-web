/*
 * @Author: chenyuting
 * @Date: 2024-12-23 11:23:36
 * @LastEditors: chenyuting
 * @LastEditTime: 2024-12-25 17:07:28
 * @Description:
 */
/*
 * @Author: chenyuting
 * @Date: 2024-12-23 11:23:36
 * @LastEditors: chenyuting
 * @LastEditTime: 2024-12-23 15:29:09
 * @Description:
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { NotificationsComponent } from './notifications.component';
import { NotificationsRoutingModule } from './notifications-routing.module';
import { SystemNoticesComponent } from './components/system-notices/system-notices.component';
import { InfoComponent } from './components/system-notices/info/info.component';
import { InternalNotificationsComponent } from './components/internal-notifications/internal-notifications.component';
import { InteractiveMessagesComponent } from './components/interactive-messages/interactive-messages.component';
import { MessageComponent } from './components/interactive-messages/components/message.component';

@NgModule({
  declarations: [
    NotificationsComponent,
    SystemNoticesComponent,
    InfoComponent,
    InternalNotificationsComponent,
    InteractiveMessagesComponent,
    MessageComponent
  ],
  imports: [CommonModule, SharedModule, NotificationsRoutingModule]
})
export class NotificationsModule {}
