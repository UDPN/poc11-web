import { Component, OnInit, ChangeDetectionStrategy, ViewChild, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { ActionCode } from '@app/config/actionCode';
import { OptionsInterface, SearchCommonVO } from '@core/services/types';
import { Dept, DeptService } from '@services/system/dept.service';
import { AntTableConfig } from '@shared/components/ant-table/ant-table.component';
import { PageHeaderType } from '@shared/components/page-header/page-header.component';
import { TreeNodeInterface } from '@shared/components/tree-table/tree-table.component';
import { MapKeyType, MapPipe, MapSet } from '@shared/pipes/map.pipe';
import { fnFlatDataHasParentToTree, fnFlattenTreeDataByDataList } from '@utils/treeTableTools';
import { ModalBtnStatus } from '@widget/base-modal';
import { DeptManageModalService } from '@widget/biz-widget/system/dept-manage-modal/dept-manage-modal.service';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

interface SearchParam {
  departmentName: string;
  state: boolean;
}

@Component({
  selector: 'app-dept',
  templateUrl: './dept.component.html',
  styleUrls: ['./dept.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeptComponent implements OnInit {
  @ViewChild('operationTpl', { static: true }) operationTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('state', { static: true }) state!: TemplateRef<NzSafeAny>;
  ActionCode = ActionCode;
  searchParam: Partial<SearchParam> = {};

  tableConfig!: AntTableConfig;
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: 'Department of management (database once every 10 minutes to recover from a backup)',
    breadcrumb: ['Home page', 'System management', 'Department of management']
  };
  dataList: TreeNodeInterface[] = [];
  stateOptions: OptionsInterface[] = [];

  constructor(
    private fb: FormBuilder,
    private deptModalService: DeptManageModalService,
    private dataService: DeptService,
    private modalSrv: NzModalService,
    public message: NzMessageService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  reloadTable(): void {
    this.message.info('Have refreshed the');
    this.getDataList();
  }

  
  tableChangeDectction(): void {
    
    this.dataList = [...this.dataList];
    this.cdr.detectChanges();
  }

  tableLoading(isLoading: boolean): void {
    this.tableConfig.loading = isLoading;
    this.tableChangeDectction();
  }

  getDataList(e?: NzTableQueryParams): void {
    this.tableConfig.loading = true;
    const params: SearchCommonVO<any> = {
      pageSize: 0,
      pageNum: 0,
      filters: this.searchParam
    };
    this.dataService
      .getDepts(params)
      .pipe(
        finalize(() => {
          this.tableLoading(false);
        })
      )
      .subscribe(deptList => {
        const target = fnFlatDataHasParentToTree(deptList.list);
        this.dataList = fnFlattenTreeDataByDataList(target);
        this.tableLoading(false);
      });
  }


  check(id: string, children: any[], parent: any[]): void {
    this.message.success(id);
  }


  resetForm(): void {
    this.searchParam = {};
    this.getDataList();
  }

  add(fatherId: number): void {
    this.deptModalService.show({ nzTitle: 'add' }).subscribe(
      res => {
        if (!res || res.status === ModalBtnStatus.Cancel) {
          return;
        }
        const param = { ...res.modalValue };
        param.fatherId = fatherId;
        this.tableLoading(true);
        this.addEditData(param, 'addDepts');
      },
      error => this.tableLoading(false)
    );
  }

  addEditData(param: Dept, methodName: 'editDepts' | 'addDepts'): void {
    this.dataService[methodName](param)
      .pipe(
        finalize(() => {
          this.tableLoading(false);
        })
      )
      .subscribe(() => {
        this.getDataList();
      });
  }

  del(id: number): void {
    const ids: number[] = [id];
    this.modalSrv.confirm({
      nzTitle: 'Sure you want to delete?',
      nzContent: 'Cannot be retrieved after deletion',
      nzOnOk: () => {
        this.tableLoading(true);
        this.dataService.delDepts(ids).subscribe(
          () => {
            if (this.dataList.length === 1) {
              this.tableConfig.pageIndex--;
            }
            this.getDataList();
          },
          error => this.tableLoading(false)
        );
      }
    });
  }

  
  edit(id: number, fatherId: number): void {
    this.dataService.getDeptsDetail(id).subscribe(res => {
      this.deptModalService.show({ nzTitle: 'edit' }, res).subscribe(
        ({ modalValue, status }) => {
          if (status === ModalBtnStatus.Cancel) {
            return;
          }
          modalValue.id = id;
          modalValue.fatherId = fatherId;
          this.tableLoading(true);
          this.addEditData(modalValue, 'editDepts');
        },
        error => this.tableLoading(false)
      );
    });
  }

  
  changePageSize(e: number): void {
    this.tableConfig.pageSize = e;
  }

  private initTable(): void {
    this.tableConfig = {
      headers: [
        {
          title: 'Department name',
          width: 230,
          field: 'departmentName'
        },
        {
          title: 'Department of state',
          field: 'state',
          tdTemplate: this.state,
          width: 100
        },
        {
          title: 'The sorting',
          field: 'orderNum',
          width: 100
        },
        {
          title: 'Creation time',
          field: 'createTime',
          pipe: 'date:yyyy-MM-dd HH:mm',
          width: 180
        },
        {
          title: 'operation',
          tdTemplate: this.operationTpl,
          fixed: true,
          fixedDir: 'right',
          showAction: false,
          width: 180,
        }
      ],
      total: 0,
      showCheckbox: false,
      loading: false,
      pageSize: 10,
      pageIndex: 1
    };
  }

  ngOnInit(): void {
    this.initTable();
    this.stateOptions = [...MapPipe.transformMapToArray(MapSet.available, MapKeyType.Boolean)];
  }
}
