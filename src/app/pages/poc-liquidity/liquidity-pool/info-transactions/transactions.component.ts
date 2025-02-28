import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  Input
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { LiquidityPoolService } from '@app/core/services/http/poc-liquidity/liquidity-pool/liquidity-pool.service';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { finalize } from 'rxjs';
import { timeToTimestampMillisecond } from '@app/utils/tools';

interface SearchParams {
  walletAddress: string;
  txType: number;
  txHash: string;
  status: number;
  txTime: Date[];
}

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.less']
})
export class TransactionsComponent implements OnInit {
  @ViewChild('addressTpl', { static: false }) addressTpl!: TemplateRef<any>;
  @ViewChild('amountTpl', { static: false }) amountTpl!: TemplateRef<any>;
  @ViewChild('statusTpl', { static: false }) statusTpl!: TemplateRef<any>;
  @ViewChild('actionTpl', { static: true }) actionTpl!: TemplateRef<any>;

  @Input() id: string = '';

  tableConfig!: AntTableConfig;
  tableData: any[] = [];
  loading = false;

  searchParam: SearchParams = {
    walletAddress: '',
    txType: 0,
    txHash: '',
    status: 0,
    txTime: []
  };

  transactionTypes = [
    { label: 'All', value: 0 },
    { label: 'Transfer', value: 1 },
    { label: 'FX Purchasing', value: 2 }
  ];

  statusOptions = [
    { label: 'All', value: 0 },
    { label: 'Processing', value: 20 },
    { label: 'Successful', value: 35 },
    { label: 'Failed', value: 40 }
  ];

  constructor(
    private route: ActivatedRoute,
    private message: NzMessageService,
    private liquidityPoolService: LiquidityPoolService
  ) {}

  ngOnInit() {
    this.initTableConfig();
    this.getDataList();
  }

  changePageSize(pageSize: number): void {
    this.tableConfig.pageSize = pageSize;
    this.getDataList(1);
  }

  initTableConfig() {
    this.tableConfig = {
      headers: [
        {
          title: 'Transaction No.',
          field: 'transactionNo',
          width: 120,
          tdTemplate: this.addressTpl
        },
        {
          title: 'From',
          field: 'fromAddress',
          width: 160,
          tdTemplate: this.addressTpl
        },
        {
          title: 'To',
          field: 'toAddress',
          width: 160,
          tdTemplate: this.addressTpl
        },
        {
          title: 'Transaction Type',
          field: 'txType',
          width: 120
        },
        {
          title: 'Amount',
          field: 'amount',
          width: 120,
          tdTemplate: this.amountTpl
        },
        {
          title: 'FX Rate',
          field: 'fxRate',
          width: 100
        },
        {
          title: 'Transaction Time',
          field: 'txTime',
          width: 160,
          pipe: 'timeStamp'
        },
        {
          title: 'Transaction Hash',
          field: 'txHash',
          width: 160,
          tdTemplate: this.addressTpl
        },
        {
          title: 'Status',
          field: 'status',
          width: 100,
          tdTemplate: this.statusTpl
        },
        {
          title: 'Actions',
          tdTemplate: this.actionTpl,
          width: 80,
          fixed: true,
          fixedDir: 'right'
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
      data: {
        liquidityPoolId: Number(this.id),
        status: this.searchParam.status,
        txEndTime: this.searchParam.txTime?.[1]
          ? timeToTimestampMillisecond(this.searchParam.txTime[1])
          : 0,
        txHash: this.searchParam.txHash,
        txStartTime: this.searchParam.txTime?.[0]
          ? timeToTimestampMillisecond(this.searchParam.txTime[0])
          : 0,
        txType: this.searchParam.txType,
        walletAddress: this.searchParam.walletAddress
      },
      page: {
        pageNum: this.tableConfig.pageIndex,
        pageSize: this.tableConfig.pageSize
      }
    };

    this.loading = true;
    this.tableConfig.loading = true;

    this.liquidityPoolService
      .getTransactionList(params)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.tableConfig.loading = false;
        })
      )
      .subscribe({
        next: (res) => {
          if (res.code === 0) {
            this.tableData = res.data.rows || [];
            this.tableConfig.total = res.data.page.total || 0;
          } else {
            this.message.error(
              res.message || 'Failed to load transaction list'
            );
            this.tableData = [];
            this.tableConfig.total = 0;
          }
        },
        error: (error) => {
          console.error('Failed to load transaction list:', error);
          this.message.error('Failed to load transaction list');
          this.tableData = [];
          this.tableConfig.total = 0;
        }
      });
  }

  resetForm() {
    this.searchParam = {
      walletAddress: '',
      txType: 0,
      txHash: '',
      status: 0,
      txTime: []
    };
    this.getDataList(1);
  }

  getStatusColor(status: number): string {
    switch (status) {
      case 35:
        return 'success';
      case 20:
        return 'processing';
      case 40:
        return 'red';
      default:
        return 'default';
    }
  }

  getStatusText(status: number): string {
    switch (status) {
      case 20:
        return 'processing';
      case 35:
        return 'successful';
      case 40:
        return 'failed';
      default:
        return 'Unknown';
    }
  }

  getTransactionTypeText(type: number): string {
    switch (type) {
      case 1:
        return 'local Rate';
      case 2:
        return 'network rate';
      default:
        return 'Unknown';
    }
  }

  formatAmount(amount: number, symbol: string): string {
    return `${amount >= 0 ? '+' : ''}${amount.toFixed(2)} ${symbol}`;
  }

  formatFxRate(rate: number, fromSymbol: string, toSymbol: string): string {
    return `${fromSymbol}/${toSymbol} = ${rate.toFixed(2)}`;
  }
}
