import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ThemeOptionsKey } from '@app/config/constant';
import { WindowService } from '@app/core/services/common/window.service';
import { WalletService } from '@app/core/services/http/poc-enterprise/wallet/wallet.service';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-approval',
  templateUrl: './approval.component.html',
  styleUrl: './approval.component.less'
})
export class ApprovalComponent implements OnInit, AfterViewInit {
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
    private cdr: ChangeDetectorRef,
    private routeInfo: ActivatedRoute,
    private walletService: WalletService,
    private windowService: WindowService
  ) {}

  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: 'Approval',
      breadcrumbs: [
        { name: 'Enterprise Management' },
        {
          name: 'Enterprise Wallet Management',
          url: '/poc/poc-enterprise/wallet'
        },
        { name: 'Approval' }
      ],
      extra: '',
      desc: '',
      footer: ''
    };
  }
  ngOnInit() {
    const themeOptionsKey: any = this.windowService.getStorage(ThemeOptionsKey);
    this.color = JSON.parse(themeOptionsKey).color;
    this.color = `1px solid ${this.color}`;
    this.routeInfo.queryParams.subscribe((params) => {
      this.getBasicDetail();
    });
  }

  getBasicDetail() {
    this.routeInfo.queryParams.subscribe((params) => {
      this.walletService
        .getBasicInfo({ bankAccountId: params['bankAccountId'] })
        .subscribe((res: any) => {
          this.info = res;
          this.cdr.markForCheck();
          return;
        });
    });
  }
}
