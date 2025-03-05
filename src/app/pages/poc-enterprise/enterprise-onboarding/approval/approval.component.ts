/*
 * @Author: chenyuting
 * @Date: 2025-01-15 14:09:17
 * @LastEditors: chenyuting
 * @LastEditTime: 2025-01-16 09:54:34
 * @Description:
 */
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';

@Component({
  selector: 'app-approval',
  templateUrl: './approval.component.html',
  styleUrl: './approval.component.less'
})
export class ApprovalComponent implements OnInit, AfterViewInit {
  enterpriseId: number = 0;
  status: number = 0;
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumbs: [],
    extra: '',
    desc: '',
    footer: ''
  };

  constructor(private route: ActivatedRoute) {}

  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: `Details`,
      breadcrumbs: [
        { name: 'Enterprise Management' },
        {
          name: 'Enterprise Onboarding',
          url: '/poc/poc-enterprise/enterprise-onboarding'
        },
        { name: 'Approval' }
      ],
      extra: '',
      desc: '',
      footer: ''
    };
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['enterpriseId']) {
        this.enterpriseId = Number(params['enterpriseId']);
      }
      if (params['status']) {
        this.status = Number(params['status']);
      }
    });
  }
}
