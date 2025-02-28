/*
 * @Author: chenyuting
 * @Date: 2024-12-09 15:40:52
 * @LastEditors: chenyuting
 * @LastEditTime: 2025-02-26 17:37:15
 * @Description:
 */
import {
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ThemeOptionsKey } from '@app/config/constant';
import { WindowService } from '@app/core/services/common/window.service';
import { CommonService } from '@app/core/services/http/common/common.service';
import { PocCapitalPoolService } from '@app/core/services/http/poc-capital-pool/poc-capital-pool.service';
import { TransactionRecordService } from '@app/core/services/http/poc-remittance/transaction/transaction.service';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.less']
})
export class InfoComponent implements OnInit {
  @ViewChild('transactionNoTpl', { static: true })
  transactionNoTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('transactionHashTpl', { static: true })
  transactionHashTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('fromTpl', { static: true })
  fromTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('toTpl', { static: true })
  toTpl!: TemplateRef<NzSafeAny>;
  color: string = '';
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumbs: [],
    extra: '',
    desc: '',
    footer: ''
  };
  info: any = {
    transactionLogTrees: [],
    fromCurrency: '',
    toCurrency: ''
  };
  type: any = '';
  detailsTabs = ['Basic Information', 'Transaction', 'Operation Record'];
  constructor(
    public routeInfo: ActivatedRoute,
    private commonService: CommonService,
    private cdr: ChangeDetectorRef,
    private transactionRecordService: TransactionRecordService,
    private windowService: WindowService
  ) {}

  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title:
        this.type === '2'
          ? 'FX Purchasing Details'
          : this.type === '1'
          ? 'Cross-Token Transfer Details'
          : 'Transfer Details',
      breadcrumbs: [
        {
          name: 'Remittance Management'
        },
        {
          name: 'Transaction Records',
          url: '/poc/poc-remittance/transaction-record'
        },
        {
          name: 'Details'
        }
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
      this.type = params['type'];
      this.transactionRecordService
        .getInfo({ transferId: params['transferId'] })
        .subscribe((res) => {
          this.info = res;
          this.info.timeLineCbdcCount =
            Number(res.fromCbdcCount) - Number(res.commission);
          this.cdr.markForCheck();
          this.cdr.detectChanges();
        });
    });
  }
}
