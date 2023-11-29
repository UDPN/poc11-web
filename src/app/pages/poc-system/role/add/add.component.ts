import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { Location } from '@angular/common';
import { NzMessageService } from 'ng-zorro-antd/message';
import { fnCheckForm } from '@app/utils/tools';
import { finalize } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { NzTreeFlatDataSource, NzTreeFlattener } from 'ng-zorro-antd/tree-view';
import { RoleService } from '@app/core/services/http/poc-system/role/role.service';



interface TreeNode {
  rsucName: string;
  disabled?: boolean;
  childNodes?: TreeNode[];
  rsucId: string;
}

interface FlatNode {
  expandable: boolean;
  name: string;
  level: number;
  disabled: boolean;
  id: string;
}

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.less']
})
export class AddComponent implements OnInit {
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumbs: [],
    extra: '',
    desc: '',
    footer: ''
  };
  validateForm!: FormGroup;
  tempStatus: boolean = true;
  isLoading: boolean = false;
  permissionList: any[] = [];
  resourceList: any[] = [];
  roleCode: any = '';
  private transformer = (node: TreeNode, level: number): FlatNode => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode =
      existingNode && existingNode.name === node.rsucName
        ? existingNode
        : {
          expandable: !!node.childNodes && node.childNodes.length > 0,
          name: node.rsucName,
          level,
          disabled: !!node.disabled,
          id: node.rsucId,
        };
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  };
  flatNodeMap = new Map<FlatNode, TreeNode>();
  nestedNodeMap = new Map<TreeNode, FlatNode>();
  checklistSelection = new SelectionModel<FlatNode>(true);

  treeControl = new FlatTreeControl<any>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new NzTreeFlattener(
    this.transformer,
    node => node.level,
    node => node.expandable,
    node => node.childNodes
  );

  dataSource = new NzTreeFlatDataSource(this.treeControl, this.treeFlattener);
  hasChild = (_: number, node: FlatNode): boolean => node.expandable;
  getLevel = (node: FlatNode) => node.level;
  constructor(private fb: FormBuilder, public routeInfo: ActivatedRoute, private message: NzMessageService, private roleService: RoleService, private cdr: ChangeDetectorRef, private location: Location) {}
  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: this.tempStatus === true ? 'Create' : 'Edit',
      breadcrumbs: [
        { name: 'System Management' },
        { name: 'Role Management', url: '/poc/poc-system/role' },
        { name: this.tempStatus === true ? 'Create' : 'Edit' }
      ],
      extra: '',
      desc: '',
      footer: ''
    };
  }

  ngOnInit() {
    this.treeList();
    this.routeInfo.queryParams.subscribe((params: any) => {
      if (JSON.stringify(params) !== '{}') {
        this.tempStatus = false;
        setTimeout(() => {
          this.getInfo(params['roleCode']);
        }, 100);
      }
    })
    this.validateForm = this.fb.group({
      roleName: [null, [Validators.required]],
      description: [null],
      lockable: [2, [Validators.required]],
    })
  }

  treeList() {
    this.roleService.treeList().subscribe(data => {
      this.dataSource.setData(data);
      this.cdr.markForCheck();
    });
  }

  checkAll() {
    const arrAll = [];
    const arrHalf = [];
    for (let i = 0; i < this.treeControl.dataNodes.length; i++) {
      if (this.checklistSelection.isSelected(this.treeControl.dataNodes[i])) {
        arrAll.push(this.treeControl.dataNodes[i].id);
      } else
        if (this.descendantsAllSelected(this.treeControl.dataNodes[i])) {
          arrAll.push(this.treeControl.dataNodes[i].id);
        } else if (
          this.descendantsPartiallySelected(this.treeControl.dataNodes[i])
        ) {
          arrHalf.push(this.treeControl.dataNodes[i].id);
        }
    }
    this.permissionList = arrAll.concat(arrHalf);
  }

  getSelectList() {
    const array = this.resourceList;
    for (let i = 0; i <= this.treeControl.dataNodes.length; i++) {
      if (array.indexOf(this.treeControl.dataNodes[i]?.id) >= 0) {
        if (!this.checklistSelection.isSelected(this.treeControl.dataNodes[i])) {
          this.checklistSelection.toggle(this.treeControl.dataNodes[i]);
          this.checkAllParentsSelection(this.treeControl.dataNodes[i]);
        }
      }
    }
  }

  selectTeeList(array: any[]) {
    array.forEach(item => {
      if (item.childNodes && item.childNodes.length >= 0) {
        this.selectTeeList(item.childNodes)
        if (item.childNodes.length === 0) {
          this.selectTeeList(item.childNodes)
          this.resourceList.push(item.rsucId)
        }
      }
      if (this.permissionList.indexOf(item.rsucId) < 0) {
        this.permissionList.push(item.rsucId)
      }
    })
  }

  descendantsAllSelected(node: FlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected =
      descendants.length > 0 &&
      descendants.every(child => {
        return this.checklistSelection.isSelected(child);
      });
    return descAllSelected;
  }

  descendantsPartiallySelected(node: FlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  leafItemSelectionToggle(node: FlatNode): any {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
    this.checkAll();
  }

  itemSelectionToggle(node: FlatNode): any {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);
    descendants.forEach(child => this.checklistSelection.isSelected(child));
    this.checkAllParentsSelection(node);
    this.checkAll();

  }

  checkAllParentsSelection(node: FlatNode): any {
    let parent: FlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  checkRootNodeSelection(node: FlatNode): any {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected =
      descendants.length > 0 && descendants.every(child => this.checklistSelection.isSelected(child));
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  getParentNode(node: FlatNode): FlatNode | null {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

  getInfo(roleCode: string): void {
    this.roleService.info({ roleCode }).subscribe((res: any) => {
      this.roleCode = roleCode;
      this.validateForm.get('roleName')?.setValue(res.roleName),
        this.validateForm.get('description')?.setValue(res.description),
        this.validateForm.get('lockable')?.setValue(res.lockable),
        this.cdr.markForCheck();
      this.selectTeeList(res.myResourceList);
      this.getSelectList();
      return;
    })
  }

  onSubmit() {
    if (!fnCheckForm(this.validateForm)) {
      return;
    }
    this.isLoading = true;
    const addParam = {
      lockable: this.validateForm.get('lockable')?.value,
      description: this.validateForm.get('description')?.value,
      roleName: this.validateForm.get('roleName')?.value,
      rsucIdList: this.permissionList
    }
    const editParam = {
      roleCode: this.roleCode,
      lockable: this.validateForm.get('lockable')?.value,
      description: this.validateForm.get('description')?.value,
      roleName: this.validateForm.get('roleName')?.value,
      rsucIdList: this.permissionList
    }
    if (this.tempStatus === true) {
      this.roleService.add(addParam).pipe(finalize(() => this.isLoading = false)).subscribe({
        next: res => {
          if (res) {
            this.message.success('Add successfully!',{ nzDuration: 1000}).onClose.subscribe(() => {
              this.validateForm.reset();
              this.location.back();
            });
          }
          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error: err => {
          this.isLoading = false;
          this.cdr.markForCheck();
        }
      })
    } else {
      this.roleService.edit(editParam).pipe(finalize(() => this.isLoading = false)).subscribe({
        next: res => {
          if (res) {
            this.message.success('Edit successfully!',{ nzDuration: 1000}).onClose.subscribe(() => {
              this.validateForm.reset();
              this.location.back();
            });
          }
          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error: err => {
          this.isLoading = false;
          this.cdr.markForCheck();
        }
      })
    }

  }

  onBack() {
    this.location.back();
  }

}
