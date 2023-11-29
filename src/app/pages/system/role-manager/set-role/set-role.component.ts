import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { concatMap } from 'rxjs/operators';

import { Menu } from '@core/services/types';
import { MenusService } from '@services/system/menus.service';
import { PutPermissionParam, RoleService } from '@services/system/role.service';
import { PageHeaderType } from '@shared/components/page-header/page-header.component';
import { fnAddTreeDataGradeAndLeaf, fnFlatDataHasParentToTree, fnFlattenTreeDataByDataList } from '@utils/treeTableTools';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-set-role',
  templateUrl: './set-role.component.html',
  styleUrls: ['./set-role.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class SetRoleComponent implements OnInit {
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: 'Set permissions',
    desc: 'Current Role:',
    breadcrumb: ['Home page', 'User management', 'Role management', 'Set permissions']
  };
  authCodeArr: string[] = [];
  permissionList: Array<Menu & { isOpen?: boolean; checked?: boolean }> = [];
  id!: number;
  roleName!: string;

  constructor(
    private dataService: RoleService,
    private cdr: ChangeDetectorRef,
    private menusService: MenusService,
    private routeInfo: ActivatedRoute,
    private router: Router,
    public message: NzMessageService
  ) {}

  
  initPermission(): void {
    
    this.dataService
      .getPermissionById(this.id)
      .pipe(
        concatMap(authCodeArr => {
          this.authCodeArr = authCodeArr;
          
          return this.menusService.getMenuList({ pageNum: 0, pageSize: 0 });
        })
      )
      .subscribe(response => {
        
        const menuArray: Array<Menu & { isOpen?: boolean; checked?: boolean }> = response.list;
        menuArray.forEach(item => {
          item.isOpen = false;
          item.checked = this.authCodeArr.includes(item.code!);
        });
        this.permissionList = fnAddTreeDataGradeAndLeaf(fnFlatDataHasParentToTree(menuArray));
        this.cdr.markForCheck();
      });
  }

  getRoleName(): void {
    this.dataService.getRolesDetail(this.id).subscribe(({ roleName }) => {
      this.pageHeaderInfo = { ...this.pageHeaderInfo, ...{ desc: `Current Role:${roleName}` } };
      this.cdr.markForCheck();
    });
  }

  back(): void {
    this.router.navigateByUrl(`/default/system/role-manager`);
  }

  submit(): void {
    const temp = [...this.permissionList];
    const flatArray = fnFlattenTreeDataByDataList(temp);
    const seledAuthArray: number[] = [];
    flatArray.forEach(item => {
      if (item['checked']) {
        seledAuthArray.push(+item.id);
      }
    });
    const param: PutPermissionParam = {
      permissionIds: seledAuthArray,
      roleId: +this.id
    };
    this.dataService.updatePermission(param).subscribe(() => {
      this.message.success('Successfully set, takes effect after logging in again');
    });
  }

  _onReuseInit(): void {
    this.ngOnInit();
  }

  ngOnInit(): void {
    this.routeInfo.queryParams.subscribe(res => {
      this.id = res['id'];
      this.getRoleName();
      this.initPermission();
    });
  }
}
