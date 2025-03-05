/*
 * @Author: chenyuting
 * @Date: 2025-01-20 10:36:23
 * @LastEditors: chenyuting
 * @LastEditTime: 2025-02-26 17:21:14
 * @Description:
 */
/*
 * @Author: chenyuting
 * @Date: 2025-01-15 14:09:17
 * @LastEditors: chenyuting
 * @LastEditTime: 2025-01-16 09:54:34
 * @Description:
 */
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ThemeOptionsKey } from '@app/config/constant';
import { WindowService } from '@app/core/services/common/window.service';
import { TopUpWithdrawService } from '@app/core/services/http/poc-enterprise/top-up-withdraw/top-up-withdraw.service';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrl: './info.component.less'
})
export class InfoComponent implements OnInit, AfterViewInit {
  info: any = {};
  color: string = '';
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumbs: [],
    extra: '',
    desc: '',
    footer: ''
  };

  constructor(
    private routeInfo: ActivatedRoute,
    private topUpWithdrawService: TopUpWithdrawService,
    private cdr: ChangeDetectorRef,
    private windowService: WindowService
  ) {}
  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: 'Details',
      breadcrumbs: [
        { name: 'Enterprise Management' },
        {
          name: 'Transaction Approval',
          url: '/poc/poc-enterprise/transactions'
        },
        { name: 'Details' }
      ],
      extra: '',
      desc: '',
      footer: ''
    };
  }
  ngOnInit() {
    const themeOptionsKey: any = this.windowService.getStorage(ThemeOptionsKey);
    this.color = JSON.parse(themeOptionsKey).color;
    this.routeInfo.queryParams.subscribe((params) => {
      if (params['accountCbdcId']) {
        this.getInfo(params['accountCbdcId'], 1);
      } else {
        this.getInfo(params['transferId'], 2);
      }
    });
  }

  getInfo(id: number, value: number) {
    if (value === 1) {
      this.topUpWithdrawService
        .getInfo({ accountCbdcId: id })
        .subscribe((res: any) => {
          this.info = res;
          this.info.id = id;
          this.cdr.markForCheck();
          return;
        });
    } else {
      this.topUpWithdrawService
        .getTransferInfo({ transferId: id })
        .subscribe((res: any) => {
          this.info = res;
          this.info.id = id;
          this.cdr.markForCheck();
          return;
        });
    }
  }
}
