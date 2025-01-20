/*
 * @Author: chenyuting
 * @Date: 2025-01-20 10:36:23
 * @LastEditors: chenyuting
 * @LastEditTime: 2025-01-20 13:40:56
 * @Description:
 */
/*
 * @Author: chenyuting
 * @Date: 2025-01-15 14:09:17
 * @LastEditors: chenyuting
 * @LastEditTime: 2025-01-16 09:54:34
 * @Description:
 */
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrl: './info.component.less'
})
export class InfoComponent implements OnInit, AfterViewInit {
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumbs: [],
    extra: '',
    desc: '',
    footer: ''
  };

  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: `Details`,
      breadcrumbs: [
        { name: 'Enterprise Management' },
        {
          name: 'Top-up & Withdraw Management',
          url: '/poc/poc-enterprise/transaction-approval'
        },
        { name: 'Details' }
      ],
      extra: '',
      desc: '',
      footer: ''
    };
  }
  ngOnInit() {}
}
