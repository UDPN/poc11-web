import { Component, OnInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { LiquidityPoolService } from '@app/core/services/http/poc-liquidity/liquidity-pool/liquidity-pool.service';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { finalize } from 'rxjs';

interface SearchParams {
  operationTime: Date[];
  transactionHash: string;
  transactionTime: Date[];
  status: number;
}

@Component({
  selector: 'app-authorization',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.less']
})
export class AuthorizationComponent implements OnInit {
  @Input() id: string = '';
  @ViewChild('hashTpl', { static: false }) hashTpl!: TemplateRef<any>;
  @ViewChild('statusTpl', { static: false }) statusTpl!: TemplateRef<any>;
  @ViewChild('amountTpl', { static: false }) amountTpl!: TemplateRef<any>;

  tableConfig!: AntTableConfig;
  dataList: any[] = [];
  loading = false;

  searchParam: SearchParams = {
    operationTime: [],
    transactionHash: '',
    transactionTime: [],
    status: 0
  };

  statusOptions = [
    { label: 'All', value: 0 },
    { label: 'Pending Authorization', value: 1 },
    { label: 'Under Authorization', value: 2 },
    { label: 'Successful Authorization', value: 3 },
    { label: 'Failed Authorization', value: 4 }
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
          title: 'Token',
          field: 'tokenSymbol',
          width: 100
        },
        {
          title: 'Authorized Amount',
          field: 'authorizedAmount',
          width: 150,
          tdTemplate: this.amountTpl
        },
        {
          title: 'Operation Time',
          field: 'operationTime',
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

    this.loading = true;
    this.tableConfig.loading = true;

    this.liquidityPoolService.getAuthorizationList(this.searchParam, this.id)
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
            this.message.error(res.message || 'Failed to load authorization list');
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
      operationTime: [],
      transactionHash: '',
      transactionTime: [],
      status: 0
    };
    this.getDataList(1);
  }

  getStatusColor(status: number): string {
    switch (status) {
      case 3:
        return 'success';
      case 1:
        return 'processing';
      case 2:
        return 'blue';
      case 4:
        return 'red';
      default:
        return 'default';
    }
  }

  getStatusText(status: number): string {
    switch (status) {
      case 1:
        return 'Pending Authorization';
      case 2:
        return 'Under Authorization';
      case 3:
        return 'Successful Authorization';
      case 4:
        return 'Failed Authorization';
      default:
        return 'Unknown';
    }
  }

  formatAmount(amount: number, symbol: string): string {
    return `${amount.toFixed(2)} ${symbol}`;
  }
}
