/*
 * @Author: chenyuting
 * @Date: 2024-12-23 11:23:10
 * @LastEditors: chenyuting
 * @LastEditTime: 2024-12-26 10:20:26
 * @Description:
 */
/*
 * @Author: chenyuting
 * @Date: 2024-12-23 11:23:10
 * @LastEditors: chenyuting
 * @LastEditTime: 2024-12-23 11:24:04
 * @Description:
 */
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { NotificationsService } from '@app/core/services/http/poc-notifications/poc-notifications.service';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.less'
})
export class NotificationsComponent implements OnInit, AfterViewInit {
  @ViewChild('headerContent', { static: false })
  headerContent!: TemplateRef<NzSafeAny>;
  @ViewChild('headerExtra', { static: false })
  headerExtra!: TemplateRef<NzSafeAny>;
  tabIndex: number = 0;
  Tabs = [
    { name: 'System Notices', count: 0 },
    { name: 'Internal Notifications', count: 0 },
    { name: 'Interactive Messages', count: 0 }
  ];
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumb: [],
    extra: '',
    desc: '',
    footer: ''
  };

  constructor(
    private notificationsService: NotificationsService,
    private cdr: ChangeDetectorRef
  ) {}
  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: ``,
      breadcrumb: ['Notifications'],
      extra: this.headerExtra,
      desc: this.headerContent,
      footer: ''
    };
  }
  ngOnInit(): void {
    if (sessionStorage.getItem('notificalNumber') === '0') {
      this.tabIndex = 0;
    } else {
      this.tabIndex = Number(sessionStorage.getItem('notificalNumber'));
      sessionStorage.removeItem('notificalNumber');
    }
    this.getUnReadCount();
  }

  onChangeTab(event: any) {
    if (event === 0) {
      sessionStorage.removeItem('notificalNumber');
    } else {
      sessionStorage.setItem('notificalNumber', event);
    }
  }
  getUnReadCount() {
    this.notificationsService.getUnReadCount().subscribe((res: any) => {
      if (res && res.length > 0) {
        res.map((item: any, index: any) => {
          if (item.type === 1) {
            this.Tabs[0].count = item.unReadCount;
          } else if (item.type === 2) {
            this.Tabs[1].count = item.unReadCount;
          } else {
            this.Tabs[2].count = item.unReadCount;
          }
        });
      }
      this.cdr.markForCheck();
      return;
    });
  }
}
