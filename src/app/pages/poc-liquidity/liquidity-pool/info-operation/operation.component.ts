import { Component, OnInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { LiquidityPoolService } from '@app/core/services/http/poc-liquidity/liquidity-pool/liquidity-pool.service';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { finalize } from 'rxjs';

interface SearchParams {
  operationType: number;
}

@Component({
  selector: 'app-operation',
  templateUrl: './operation.component.html',
  styleUrls: ['./operation.component.less']
})
export class OperationComponent implements OnInit {
  @Input() id: string = '';
  @ViewChild('hashTpl', { static: false }) hashTpl!: TemplateRef<any>;
  @ViewChild('statusTpl', { static: true }) statusTpl!: TemplateRef<any>;
  @ViewChild('remarksTpl', { static: false }) remarksTpl!: TemplateRef<any>;
  @ViewChild('operationTypeTpl', { static: true }) operationTypeTpl!: TemplateRef<any>;

  tableConfig!: AntTableConfig;
  dataList: any[] = [];
  loading = false;

  searchParam: SearchParams = {
    operationType: 0
  };




  operationTypes = [
    { label: 'All', value: 0 },
    { label: 'Register', value: 1 },
    { label: 'Activate', value: 2 },
    { label: 'Deactivate', value: 3 }
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
          width: 120,
          tdTemplate: this.operationTypeTpl
        },
        {
          title: 'Operator',
          field: 'createdBy',
          width: 120
        },
        {
          title: 'Operation Time',
          field: 'createdTime',
          width: 180,
          pipe: 'timeStamp',
        },
        {
          title: 'Transaction Time',
          field: 'txTime',
          width: 180,
          pipe: 'timeStamp',
        },
        {
          title: 'Transaction Hash',
          field: 'txHash',
          width: 160,
          tdTemplate: this.hashTpl
        },
        {
          title: 'Remarks',
          field: 'remarks',
          width: 200,
          tdTemplate: this.remarksTpl
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
      operationType: this.searchParam.operationType,
      pageIndex: this.tableConfig.pageIndex,
      pageSize: this.tableConfig.pageSize
    };

    this.loading = true;
    this.tableConfig.loading = true;

    this.liquidityPoolService.getOperationList(params, this.id)
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
            // this.message.error(res.message || '获取操作记录失败');
            this.dataList = [];
            this.tableConfig.total = 0;
          }
        },
        error: (error) => {
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
      operationType: 0
    };
    this.getDataList(1);
  }

  getStatusColor(status: number): string {
    switch (status) {
      case 0:
        return 'processing';
      case 1:
        return 'success';
      case 2:
        return 'error';
      case 3:
        return 'default';
      default:
        return 'default';
    }
  }

  getStatusText(status: number): string {
    switch (status) {
      case 0:
        return 'In Progress';
      case 1:
        return 'Success';
      case 2:
        return 'Failed';
      case 3:
        return 'rejected';
      default:
        return 'Unknown';
    }
  }

  getOperationTypeText(type: number): string {

    switch (type) {
      case 1:
        return 'Register';
      case 2:
        return 'Activate';
      case 3:
        return 'Deactivate';
      default:
        return 'Unknown';
    }
  }
}
