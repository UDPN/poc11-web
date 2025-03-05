import { Component, OnInit, Input, ChangeDetectorRef, ViewChild, TemplateRef } from '@angular/core';
import { TokenPairService } from '@app/core/services/http/poc-liquidity/token-pair/token-pair.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';

interface OperationRecord {
  createTime: number;
  createUser: string;
  exchangeRate: number;
  fromCurrency: string;
  operationType: number;
  rateId: number;
  rateRecordId: number;
  remarks: string;
  state: number;
  toCurrency: string;
  txHash: string;
  txTime: number;
}

@Component({
  selector: 'app-info-operation',
  templateUrl: './info-operation.component.html',
  styleUrl: './info-operation.component.less'
})
export class InfoOperationComponent implements OnInit {
  @Input() rateId: number = 0;
  @ViewChild('statusTpl', { static: true }) statusTpl!: TemplateRef<any>;
  @ViewChild('operationTypeTpl', { static: true }) operationTypeTpl!: TemplateRef<any>;
  
  loading = false;
  operationRecords: OperationRecord[] = [];
  total = 0;
  tableConfig!: AntTableConfig;
  operationType = 0;

  constructor(
    private tokenPairService: TokenPairService,
    private message: NzMessageService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.initTableConfig();
    this.getOperationRecords();
  }

  initTableConfig() {
    this.tableConfig = {
      headers: [
        {
          title: 'Operation Type',
          width: 160,
          tdTemplate: this.operationTypeTpl
        },
        {
          title: 'Created by',
          field: 'createUser',
          width: 160
        },
        {
          title: 'Created on',
          field: 'createTime',
          width: 180,
          pipe: 'timeStamp',
        },
        {
          title: 'Comments',
          field: 'remarks',
          width: 200
        },
        {
          title: 'Status',
          width: 120,
          tdTemplate: this.statusTpl
        }
      ],
      total: 0,
      pageSize: 10,
      pageIndex: 1,
      loading: false,
      xScroll: 800
    };
  }

  onPageSizeChange(pageSize: number): void {
    this.tableConfig.pageSize = pageSize;
    this.getOperationRecords();
  }

  getOperationRecords(e?: NzTableQueryParams | number): void {
    if (typeof e === 'number') {
      this.tableConfig.pageIndex = e;
    } else if (e) {
      this.tableConfig.pageIndex = e.pageIndex;
    }
    this.tableConfig.loading = true;
    const params = {
      data: {
        rateId: this.rateId,
        operationType: this.operationType
      },
      page: {
        pageNum: this.tableConfig.pageIndex,
        pageSize: this.tableConfig.pageSize
      }
    };

    this.tokenPairService.getOperationRecords(params).subscribe({
      next: (res) => {
        this.tableConfig.loading = false;
        if (res.code === 0) {
          this.operationRecords = res.data.rows;
          this.tableConfig.total = res.data.page.total;
        } 
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err.message || 'Failed to get operation records');
        this.tableConfig.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  resetSearch(): void {
    this.operationType = 0;
    this.tableConfig.pageIndex = 1;
    this.getOperationRecords();
  }

  getStatusColor(state: number): string {
    switch (state) {
      case 1:
        return 'success';
      case 0:
        return 'processing';
      case 2:
        return 'error';
      default:
        return 'default';
    }
  }

  getStatusText(state: number): string {
    switch (state) {
      case 1:
        return 'Success';
      case 0:
        return 'Processing';
      case 2:
        return 'Failed';
      default:
        return 'Unknown';
    }
  }

  getOperationTypeText(type: number): string {
    switch (type) {
      case 1:
        return 'Add';
      case 3:
        return 'Activate';
      case 4:
        return 'Deactivate';
      default:
        return 'Unknown';
    }
  }
}
