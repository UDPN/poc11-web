import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { LiquidityPoolService } from '@app/core/services/http/poc-liquidity/liquidity-pool/liquidity-pool.service';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { finalize } from 'rxjs';

interface SearchParams {
  operationType: string;
}

@Component({
  selector: 'app-operation',
  templateUrl: './operation.component.html',
  styleUrls: ['./operation.component.less']
})
export class OperationComponent implements OnInit {
  @ViewChild('hashTpl', { static: false }) hashTpl!: TemplateRef<any>;
  @ViewChild('statusTpl', { static: false }) statusTpl!: TemplateRef<any>;
  @ViewChild('remarksTpl', { static: false }) remarksTpl!: TemplateRef<any>;

  tableConfig!: AntTableConfig;
  dataList: any[] = [];
  loading = false;

  searchParam: SearchParams = {
    operationType: ''
  };

  operationTypes = [
    { label: 'All', value: '' },
    { label: 'Register', value: 'Register' },
    { label: 'Activate', value: 'Activate' },
    { label: 'Deactivate', value: 'Deactivate' }
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
          title: 'Created by',
          field: 'createdBy',
          width: 120
        },
        {
          title: 'Created on',
          field: 'createdOn',
          width: 180,
          pipe: 'date:MMM d, y, HH:mm:ss'
        },
        {
          title: 'Remarks',
          field: 'remarks',
          width: 200,
          tdTemplate: this.remarksTpl
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
      pageSize: 5,
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

    this.liquidityPoolService.getOperationList(params)
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
            this.message.error(res.msg || 'Failed to load operation list');
            this.dataList = [];
            this.tableConfig.total = 0;
          }
        },
        error: (error) => {
          console.error('Failed to load operation list:', error);
          this.message.error('Failed to load operation list');
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
      operationType: ''
    };
    this.getDataList(1);
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Success':
        return 'success';
      case 'Failed':
        return 'error';
      case 'Rejected':
        return 'warning';
      default:
        return 'default';
    }
  }
}
