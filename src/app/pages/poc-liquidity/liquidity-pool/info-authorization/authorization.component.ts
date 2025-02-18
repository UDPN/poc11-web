import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { LiquidityPoolService } from '@app/core/services/http/poc-liquidity/liquidity-pool/liquidity-pool.service';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { finalize } from 'rxjs';

interface SearchParams {
  operationType: string;
  operationTime: Date[];
  transactionHash: string;
  transactionTime: Date[];
  status: string;
}

@Component({
  selector: 'app-authorization',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.less']
})
export class AuthorizationComponent implements OnInit {
  @ViewChild('hashTpl', { static: false }) hashTpl!: TemplateRef<any>;
  @ViewChild('statusTpl', { static: false }) statusTpl!: TemplateRef<any>;

  tableConfig!: AntTableConfig;
  dataList: any[] = [];
  loading = false;

  searchParam: SearchParams = {
    operationType: '',
    operationTime: [],
    transactionHash: '',
    transactionTime: [],
    status: ''
  };

  operationTypes = [
    { label: 'All', value: '' },
    { label: 'Authorize', value: 'Authorize' },
    { label: 'Reauthorize', value: 'Reauthorize' }
  ];

  statusOptions = [
    { label: 'All', value: '' },
    { label: 'Success', value: 'Success' },
    { label: 'Processing', value: 'Processing' },
    { label: 'Expired', value: 'Expired' }
  ];

  constructor(
    private message: NzMessageService,
    private liquidityPoolService: LiquidityPoolService
  ) {}

  ngOnInit() {
    this.initTableConfig();
    this.getDataList();
  }

  initTableConfig() {
    this.tableConfig = {
      headers: [
        {
          title: 'Operation Type',
          field: 'operationType',
          width: 120
        },
        {
          title: 'Change Type',
          field: 'changeType',
          width: 120
        },
        {
          title: 'Token Name',
          field: 'tokenName',
          width: 100
        },
        {
          title: 'Authorized Amount',
          field: 'authorizedAmount',
          width: 150
        },
        {
          title: 'Operation Time',
          field: 'operationTime',
          width: 180,
          pipe: 'date:MMM d, y, HH:mm:ss'
        },
        {
          title: 'Transaction Time',
          field: 'transactionTime',
          width: 180,
          pipe: 'date:MMM d, y, HH:mm:ss'
        },
        {
          title: 'Transaction Hash',
          field: 'transactionHash',
          width: 160,
          tdTemplate: this.hashTpl
        },
        {
          title: 'Status',
          field: 'status',
          width: 100,
          tdTemplate: this.statusTpl
        }
      ],
      total: 0,
      pageSize: 10,
      pageIndex: 1,
      loading: false,
      xScroll: 1300
    };
  }

  getDataList(e?: NzTableQueryParams | number) {
    if (typeof e === 'number') {
      this.tableConfig.pageIndex = e;
    } else if (e) {
      this.tableConfig.pageIndex = e.pageIndex;
    }

    const params = {
      ...this.searchParam,
      pageSize: this.tableConfig.pageSize,
      pageIndex: this.tableConfig.pageIndex
    };

    this.loading = true;
    this.tableConfig.loading = true;

    this.liquidityPoolService.getAuthorizationList(params)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.tableConfig.loading = false;
        })
      )
      .subscribe({
        next: (res) => {
          if (res.code === 0) {
            this.dataList = res.data.rows || [];
            this.tableConfig.total = res.data.page.total || 0;
          } else {
            this.message.error(res.msg || 'Failed to load authorization list');
            this.dataList = [];
            this.tableConfig.total = 0;
          }
        },
        error: (error) => {
          console.error('Failed to load authorization list:', error);
          this.message.error('Failed to load authorization list');
          this.dataList = [];
          this.tableConfig.total = 0;
        }
      });
  }

  changePageSize(pageSize: number) {
    this.tableConfig.pageSize = pageSize;
    this.getDataList(1);
  }

  resetForm() {
    this.searchParam = {
      operationType: '',
      operationTime: [],
      transactionHash: '',
      transactionTime: [],
      status: ''
    };
    this.getDataList(1);
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Success':
        return 'success';
      case 'Processing':
        return 'processing';
      case 'Expired':
        return 'default';
      default:
        return 'default';
    }
  }
}
