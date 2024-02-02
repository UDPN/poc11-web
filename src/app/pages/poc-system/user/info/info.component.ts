import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '@app/core/services/http/poc-system/user/user.service';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';

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
  info: any = {};
  roleList: any[] = [];
  constructor(public routeInfo: ActivatedRoute, private userService: UserService, private cdr: ChangeDetectorRef) { }
  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: `Details`,
      breadcrumbs: [
        { name: 'System Management' },
        { name: 'User Management', url: '/poc/poc-system/user' },
        { name: 'Details' }
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
      this.userService.info({ userId: params['userId'] }).subscribe((res: any) => {
        this.info = res;
        this.roleList = res.roleList;
        const array: any = [];
        if (res.roleList) {
          this.roleList.map((item) => {
            array.push(item.roleName)
          })
          this.roleList = array;
        }
        this.cdr.markForCheck();
        return;
      })
    });
  }
}
