/*
 * @Author: chenyuting
 * @Date: 2024-12-23 11:23:10
 * @LastEditors: chenyuting
 * @LastEditTime: 2024-12-23 13:42:53
 * @Description: 
 */
/*
 * @Author: chenyuting
 * @Date: 2024-12-23 11:23:10
 * @LastEditors: chenyuting
 * @LastEditTime: 2024-12-23 11:24:04
 * @Description: 
 */
import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
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
  Tabs = ['System Notices', 'Internal Notifications', 'Interactive Messages'];
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumb: [],
    extra: '',
    desc: '',
    footer: ''
  };

  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: ``,
      breadcrumb: ['Capital Pool Management'],
      extra: this.headerExtra,
      desc: this.headerContent,
      footer: ''
    };
  }
  ngOnInit(): void {
    if (sessionStorage.getItem('notificalNumber') === '1') {
      this.tabIndex = 1;
      sessionStorage.removeItem('notificalNumber');
    } else {
      this.tabIndex = 0;
    }
    
  }

  onChangeTab(event: any) {
    if (event === 1) {
      sessionStorage.setItem('notificalNumber', '1');
    } else {
      sessionStorage.removeItem('notificalNumber');
    }
  }

}
