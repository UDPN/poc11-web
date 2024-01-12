import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { AfterContentInit, ChangeDetectionStrategy, Component, ContentChild, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';

import { AntTreeTableComponentToken } from '@shared/components/tree-table/tree-table.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzTableSize } from 'ng-zorro-antd/table';

import { AntTableComponentToken, TableHeader } from '../ant-table/ant-table.component';

interface TableSizeItem {
  sizeName: string;
  selected: boolean;
  value: NzTableSize;
}

@Component({
  selector: 'app-card-table-wrap',
  templateUrl: './card-table-wrap.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardTableWrapComponent implements OnInit, AfterContentInit {
  @Input() tableTitle: string | TemplateRef<NzSafeAny> | undefined;
  @Input() btnTpl: TemplateRef<NzSafeAny> | undefined;
  @Input() isNormalTable = true; 
  @Output() readonly reload = new EventEmitter<NzSafeAny>();
  @ContentChild(AntTableComponentToken) antTableComponent!: AntTableComponentToken;
  @ContentChild(AntTreeTableComponentToken) antTreeTableComponent!: AntTreeTableComponentToken;
  tableConfigVisible = false;
  tableSizeOptions: TableSizeItem[] = [
    { sizeName: 'Default', selected: true, value: 'default' },
    { sizeName: 'Middle', selected: false, value: 'middle' },
    { sizeName: 'Small', selected: false, value: 'small' }
  ];
  tableHeaders: TableHeader[] = [];
  currentTableComponent!: AntTableComponentToken | AntTreeTableComponentToken;
  allTableFieldChecked = false; 
  allTableFieldIndeterminate = false; 
  copyHeader: TableHeader[] = []; 

  constructor() {}

  
  changeTableCheckBoxShow(e: boolean): void {
    this.currentTableComponent.tableConfig.showCheckbox = e;
    this.tableChangeDectction();
  }

  
  tableSizeMenuClick(item: TableSizeItem): void {
    this.tableSizeOptions.forEach(tableSizeItem => (tableSizeItem.selected = false));
    item.selected = true;
    this.currentTableComponent.tableSize = item.value;
  }

  
  changeAllTableTableConfigShow(e: boolean): void {
    if (e) {
      this.allTableFieldChecked = e;
      this.allTableFieldIndeterminate = false;
    }
    this.tableHeaders.forEach(item => (item.show = e));
    this.tableChangeDectction();
  }

  
  changeTableConfigShow(): void {
    const tempArray = [...this.tableHeaders];
    const fixedLeftArray: TableHeader[] = [];
    const fixedRightArray: TableHeader[] = [];
    const noFixedArray: TableHeader[] = [];
    tempArray.forEach(item => {
      if (item.fixed) {
        if (item.fixedDir === 'left') {
          fixedLeftArray.push(item);
        } else {
          fixedRightArray.push(item);
        }
      } else {
        noFixedArray.push(item);
      }
    });
    this.currentTableComponent.tableConfig.headers = [...fixedLeftArray, ...noFixedArray, ...fixedRightArray];
    this.tableChangeDectction();
  }

  dropTableConfig(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.tableHeaders, event.previousIndex, event.currentIndex);
    this.changeTableConfigShow();
  }

  fixedTableHead(dir: 'right' | 'left', item: TableHeader): void {
    item.fixed = !(item.fixed && item.fixedDir === dir);
    item.fixedDir = dir;
    this.changeTableConfigShow();
  }

  reloadClick(): void {
    this.reload.emit();
  }

  
  changeSignalCheck(e: boolean, item: TableHeader): void {
    item.show = e;
    this.judgeAllChecked();
    this.tableChangeDectction();
  }

  
  tableChangeDectction(): void {
    this.currentTableComponent.tableChangeDectction();
  }

  
  judgeAllChecked(): void {
    this.allTableFieldChecked = this.tableHeaders.every(item => item.show === true);
    const allUnChecked = this.tableHeaders.every(item => !item.show);
    this.allTableFieldIndeterminate = !this.allTableFieldChecked && !allUnChecked;
  }

  
  reset(): void {
    this.tableHeaders = [];
    this.copyHeader.forEach(item => {
      this.tableHeaders.push({ ...item });
    });
    this.currentTableComponent.tableConfig.headers = [...this.tableHeaders];
    this.tableChangeDectction();
  }

  ngOnInit(): void {}

  ngAfterContentInit(): void {
    this.currentTableComponent = this.antTableComponent || this.antTreeTableComponent;

    if (this.isNormalTable) {
      this.tableHeaders = [...this.currentTableComponent.tableConfig.headers];
      this.tableHeaders.forEach(item => {
        if (item.show === undefined) {
          item.show = true;
        }
      });
      this.copyHeader.length = 0;
      this.tableHeaders.forEach(item => {
        this.copyHeader.push({ ...item });
      });
      this.judgeAllChecked();
    }
  }
}
