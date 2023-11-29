import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DestroyService } from '@app/core/services/common/destory.service';
import { ResetPasswordService } from '@app/core/services/http/change-password/reset-password.service';
import { LoginService } from '@app/core/services/http/login/login.service';
import { DefaultStoreService } from '@app/layout/default/store/default.service';

import { LoginInOutService } from '@core/services/common/login-in-out.service';
import { WindowService } from '@core/services/common/window.service';
import { AccountService, UserPsd } from '@services/system/account.service';
import { SpinService } from '@store/common-store/spin.service';
import { UserInfoService } from '@store/common-store/userInfo.service';
import { ModalBtnStatus } from '@widget/base-modal';
import { ChangePasswordService } from '@widget/biz-widget/change-password/change-password.service';
import { LockWidgetService } from '@widget/common-widget/lock-widget/lock-widget.service';
import { SearchRouteService } from '@widget/common-widget/search-route/search-route.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ModalOptions, NzModalService } from 'ng-zorro-antd/modal';
import { Subscription } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-layout-head-right-menu',
  templateUrl: './layout-head-right-menu.component.html',
  styleUrls: ['./layout-head-right-menu.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyService]
})
export class LayoutHeadRightMenuComponent implements OnInit, OnDestroy {
  user!: UserPsd;
  loading: boolean = true;
  clientName: any = '';
  instance: any = '';
  subscribe!: Subscription;
  constructor(
    private router: Router,
    private changePasswordModalService: ChangePasswordService,
    private spinService: SpinService,
    private loginOutService: LoginInOutService,
    private lockWidgetService: LockWidgetService,
    private windowServe: WindowService,
    private activatedRoute: ActivatedRoute,
    private searchRouteService: SearchRouteService,
    public message: NzMessageService,
    private userInfoService: UserInfoService,
    private accountService: AccountService,
    private modalService: NzModalService,
    private loginService: LoginService,
    private resetPasswordService: ResetPasswordService,
    private cdr: ChangeDetectorRef,
    private _defaultStoreService: DefaultStoreService,
    private destroy$: DestroyService
  ) {}
  ngOnDestroy(): void {
    this.subscribe.unsubscribe();
  }

  lockScreen(): void {
    this.lockWidgetService
      .show({
        nzTitle: 'Lock screen',
        nzStyle: { top: '25px' },
        nzWidth: '520px',
        nzFooter: null,
        nzMaskClosable: true
      })
      .subscribe();
  }

  changePassWord(): void {
    this.changePasswordModalService
      .show({ nzTitle: 'Change Password' })
      .subscribe(({ modalValue, status }) => {
        if (status === ModalBtnStatus.Cancel) {
          return;
        }

        this.resetPasswordService.resetPassword(modalValue).subscribe((_) => {
          if (_.code === '0') {
            this.message
              .success('Password changed successfully !')
              .onClose!.pipe()
              .subscribe(() => {
                this.loginOutService.loginOut().then();
              });
          }
        });
      });
  }

  showSearchModal(): void {
    const modalOptions: ModalOptions = {
      nzClosable: false,
      nzMaskClosable: true,
      nzStyle: { top: '48px' },
      nzFooter: null,
      nzBodyStyle: { padding: '0' }
    };
    this.searchRouteService.show(modalOptions);
  }

  goLogout(): void {
    this.modalService.confirm({
      nzTitle: 'EXIT',
      nzContent: 'Are you sure you want to quit ?',
      nzOnOk: () =>
        new Promise((resolve, reject) => {
          this.loginService.loginOut().subscribe({
            next: (path) => {
              resolve(true);
              if (path.code === '0') {
                sessionStorage.clear();
                this.loginOutService.loginOut().then((_) => {
                  this.router.navigateByUrl('/login/login-modify');
                });
              }
            },
            error: (any) => {
              reject(true);
              this.cdr.markForCheck();
            }
          });
        }).catch(() => console.log('Oops errors!'))
    });
  }

  clean(): void {
    this.windowServe.clearStorage();
    this.windowServe.clearSessionStorage();
    this.loginOutService.loginOut().then();
    this.message.success('Clean up successfully, please login again');
  }

  showMessage(): void {
    this.message.info('Switch success');
  }

  goPage(path: string): void {
    this.router.navigateByUrl(`/default/page-demo/personal/${path}`);
  }

  ngOnInit(): void {
    this.clientName = sessionStorage.getItem('clientName');
    this.subscribe = this._defaultStoreService
      .getShowChangePassWordStore()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res === 'true') {
          this.changePassWord();
        }
      });
  }
}
