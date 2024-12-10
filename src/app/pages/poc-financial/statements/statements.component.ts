/*
 * @Author: chenyuting
 * @Date: 2024-12-10 11:08:21
 * @LastEditors: chenyuting
 * @LastEditTime: 2024-12-10 11:21:02
 * @Description: 
 */
/*
 * @Author: chenyuting
 * @Date: 2024-12-10 11:08:21
 * @LastEditors: chenyuting
 * @LastEditTime: 2024-12-10 11:18:49
 * @Description: 
 */
import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';

@Component({
  selector: 'app-statements',
  templateUrl: './statements.component.html',
  styleUrl: './statements.component.less'
})
export class StatementsComponent implements OnInit, AfterViewInit {
  @ViewChild('headerContent', { static: false })
  headerContent!: TemplateRef<NzSafeAny>;
  @ViewChild('headerExtra', { static: false })
  headerExtra!: TemplateRef<NzSafeAny>;
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
      breadcrumb: ['Financial Management', 'Statements and Reports'],
      extra: this.headerExtra,
      desc: this.headerContent,
      footer: ''
    };
  }

  ngOnInit() {}
}
