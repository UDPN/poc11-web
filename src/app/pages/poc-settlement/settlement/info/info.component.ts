import {
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '@app/core/services/http/common/common.service';
import { SettlementService } from '@app/core/services/http/poc-settlement/settlement/settlement.service';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.less']
})
export class InfoComponent implements OnInit {
  @ViewChild('commissionTpl', { static: true })
  commissionTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('maxCommissionTpl', { static: true })
  maxCommissionTpl!: TemplateRef<NzSafeAny>;
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumbs: [],
    extra: '',
    desc: '',
    footer: ''
  };
  info: any = {};
  tableConfig!: AntTableConfig;
  dataList: NzSafeAny[] = [];
  constructor(
    public routeInfo: ActivatedRoute,
    private settlementService: SettlementService,
    private commonService: CommonService,
    private cdr: ChangeDetectorRef
  ) {}
  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: `Details`,
      breadcrumbs: [
        { name: 'Settlement Management' },
        {
          name: 'Settlement Model Management',
          url: '/poc/poc-settlement/settlement'
        },
        { name: 'Details' }
      ],
      extra: '',
      desc: '',
      footer: ''
    };
  }

  ngOnInit() {
    this.getInfo();
    this.initTable();
  }

  changePageSize(e: number): void {
    this.tableConfig.pageSize = e;
  }

  getInfo(): void {
    this.routeInfo.queryParams.subscribe((params) => {
      const data = {
        formRatePlatform:
          params['formRatePlatform'] || params['sourcePlatform'],
        formRateCurrency:
          params['formRateCurrency'] || params['sourceCurrency'],
        toRatePlatform: params['toRatePlatform'] || params['targetPlatform'],
        toRateCurrency: params['toRateCurrency'] || params['targetCurrency']
      };
      this.settlementService.getInfo(data).subscribe((res: any) => {
        this.info = res;
        this.cdr.markForCheck();
        return;
      });
      this.settlementService.getInfoHistory(data).subscribe((res: any) => {
        this.dataList = res;
        this.cdr.markForCheck();
        return;
      });
    });
  }

  private initTable(): void {
    this.tableConfig = {
      headers: [
        {
          title: 'Charging Model',
          field: 'chargingModel',
          pipe: 'chargingModel',
          notNeedEllipsis: true,
          width: 220
        },
        {
          title: 'Commission Rate',
          tdTemplate: this.commissionTpl,
          notNeedEllipsis: true,
          width: 220
        },
        {
          title: 'Max Commission Amount',
          tdTemplate: this.maxCommissionTpl,
          pipe: 'nullValue',
          notNeedEllipsis: true,
          width: 300
        },
        {
          title: 'Modification Time',
          field: 'createDate',
          pipe: 'timeStamp',
          notNeedEllipsis: true,
          width: 220
        },
        {
          title: 'Modified By',
          field: 'modifyUser',
          notNeedEllipsis: true,
          width: 220
        }
      ],
      total: 0,
      showCheckbox: false,
      loading: false,
      pageSize: 10,
      pageIndex: 1
    };
  }
}
