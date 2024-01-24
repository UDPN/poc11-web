import {
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '@app/core/services/http/common/common.service';
import { BillService } from '@app/core/services/http/poc-settlement/bill/bill.service';
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
  exchangeRate: any = [
    {
      title: 'Basic Information'
    },
    {
      title: 'Transaction Details'
    }
  ];
  constructor(
    public routeInfo: ActivatedRoute,
    private billService: BillService,
    private commonService: CommonService,
    private cdr: ChangeDetectorRef
  ) {}
  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: `Detail`,
      breadcrumbs: [
        { name: 'Settlement Management' },
        { name: 'Monthly income statement', url: '/poc/poc-settlement/billing' },
        { name: 'Detail' }
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
      this.billService
        .getInfo({ billNo: params['billNo'] })
        .subscribe((res) => {
          this.info = res;
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
          width: 220
        },
        {
          title: 'Commission',
          tdTemplate: this.commissionTpl,
          width: 220
        },
        {
          title: 'Max Commission',
          tdTemplate: this.maxCommissionTpl,
          pipe: 'nullValue',
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
