import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { ActivatedRoute } from '@angular/router';
import { NotificationsService } from '@app/core/services/http/poc-notifications/poc-notifications.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrl: './info.component.less'
})
export class InfoComponent implements OnInit, AfterViewInit {
  info: any = {};
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumbs: [],
    extra: '',
    desc: '',
    footer: ''
  };

  constructor(
    public routeInfo: ActivatedRoute,
    private notificationsService: NotificationsService,
    private cdr: ChangeDetectorRef
  ) {}
  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: `Details`,
      breadcrumbs: [
        {
          name: 'Notifications'
        },
        {
          name: 'System Notices',
          url: '/poc/poc-notifications/notifications'
        },
        { name: 'Details' }
      ],
      extra: '',
      desc: '',
      footer: ''
    };
  }
  ngOnInit(): void {
    this.getInfo();
  }

  getInfo(): void {
    this.routeInfo.queryParams.subscribe((params) => {
      this.notificationsService
        .getInfo({ chatMsgId: params['chatMsgId'], msgType: 1 })
        .subscribe((res: any) => {
          this.info = res;
          this.cdr.markForCheck();
          return;
        });
    });
  }
}
