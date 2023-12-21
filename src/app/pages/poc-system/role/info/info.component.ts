import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { NzTreeFlatDataSource, NzTreeFlattener } from 'ng-zorro-antd/tree-view';
import { RoleService } from '@app/core/services/http/poc-system/role/role.service';


interface TreeNode {
  rsucName: string;
  disabled?: boolean;
  childNodes?: TreeNode[];
}

interface FlatNode {
  expandable: boolean;
  name: string;
  level: number;
  disabled: boolean;
}

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.less']
})
export class InfoComponent implements OnInit {
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumbs: [],
    extra: '',
    desc: '',
    footer: ''
  };
  isOkLoading: boolean = false;
  info: any = {};
  loading: boolean = false;
  roleList: any[] = [];
  permissionList: TreeNode[] = [];
  selectListSelection = new SelectionModel<FlatNode>(true);

  private transformer = (node: TreeNode, level: number): FlatNode => ({
    expandable: !!node.childNodes && node.childNodes.length > 0,
    name: node.rsucName,
    level,
    disabled: !!node.disabled
  });
  treeControl: any = new FlatTreeControl<FlatNode>(
    node => node.level,
    node => node.expandable
  );

  treeFlattener = new NzTreeFlattener(
    this.transformer,
    node => node.level,
    node => node.expandable,
    node => node.childNodes
  );


  dataSource = new NzTreeFlatDataSource(this.treeControl, this.treeFlattener);

  hasChild = (_: number, node: FlatNode): boolean => node.expandable;
  constructor(public routeInfo: ActivatedRoute, private roleService: RoleService, private cdr: ChangeDetectorRef) { }
  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: `Detail`,
      breadcrumbs: [
        { name: 'System Management' },
        { name: 'Role Management', url: '/poc/poc-system/role' },
        { name: 'Detail' }
      ],
      extra: '',
      desc: '',
      footer: ''
    };
  }
  ngOnInit() {
    this.getInfo();
  }

  getInfo(): void {
    this.routeInfo.queryParams.subscribe(params => {
      this.roleService.info({ roleCode: params['roleCode'] }).subscribe((res: any) => {
        this.info = res;
        this.permissionList = res.myResourceList;
        this.dataSource.setData(this.permissionList);
        this.cdr.markForCheck();
        return;
      })
    });
  }

}
