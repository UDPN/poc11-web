import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';

import { DrawerWrapService } from '@app/drawer/base-drawer';
import { PreloaderService } from '@core/services/common/preloader.service';
import { LockScreenStoreService } from '@store/common-store/lock-screen-store.service';
import { SpinService } from '@store/common-store/spin.service';
import { fnStopMouseEvent } from '@utils/tools';
import { ModalWrapService } from '@widget/base-modal';
import { NzSafeAny } from 'ng-zorro-antd/core/types';

import { fadeRouteAnimation } from './animations/fade.animation';
import { TranslateService } from '@ngx-translate/core';
import { ThemeOptionsKey } from './config/constant';
import { WindowService } from './core/services/common/window.service';
import { ThemeService } from './core/services/store/common-store/theme.service';
import { NzConfigService } from 'ng-zorro-antd/core/config';
import { SocketService } from './core/services/common/socket.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MapPipe } from './shared/pipes/map.pipe';

@Component({
  selector: 'app-root',
  template: `
    <app-lock-screen *ngIf="(lockedState$ | async)!.locked"></app-lock-screen>
    <nz-back-top></nz-back-top>
    <div class="full-height" [@fadeRouteAnimation]="prepareRoute(outlet)">
      <router-outlet #outlet="outlet"></router-outlet>
    </div>
    <div
      *ngIf="loading$ | async"
      style="position:fixed;top:0;left:0;width:100%;height:100%;z-index:1001;background:rgba(24,144,255,0.1);"
    >
      <div style="position:absolute;top: 50%;left:50%;margin:-16px 0 0 -16px;">
        <nz-spin nzSize="large"></nz-spin>
      </div>
    </div>

    <ng-template #modalBtnTpl>
      <div class="center">
        <span
          class="hover-blue full-height flex-auto text-right d-i-b"
          (click)="fullScreenIconClick($event)"
        >
          <i
            class="m-r-8"
            nz-icon
            [nzType]="!modalFullScreenFlag ? 'fullscreen' : 'fullscreen-exit'"
            nzTheme="outline"
          ></i>
        </span>
        <span
          (click)="modalFullScreenFlag = false"
          class="hover-red full-height flex-auto d-i-b"
        >
          <i nz-icon nzType="close" nzTheme="outline"></i>
        </span>
      </div>
    </ng-template>

    <ng-template #drawerFootDefaultTpl>
      <div class="end-start-center">
        <button
          nzType="default"
          class="m-r-8"
          (click)="drawerWrapService.cancel()"
          nz-button
        >
          Cancel
        </button>
        <button nzType="primary" (click)="drawerWrapService.sure()" nz-button>
          Confirm
        </button>
      </div>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeRouteAnimation]
})
export class AppComponent implements OnInit, AfterViewInit {
  loading$ = this.spinService.getCurrentGlobalSpinStore();
  lockedState$ = this.lockScreenStoreService.getLockScreenStore();
  @ViewChild('modalBtnTpl') modalBtnTpl!: TemplateRef<any>;
  @ViewChild('drawerFootDefaultTpl') drawerFootDefaultTpl!: TemplateRef<any>;
  modalFullScreenFlag = false;

  constructor(
    public drawerWrapService: DrawerWrapService,
    private modalWrapService: ModalWrapService,
    private lockScreenStoreService: LockScreenStoreService,
    private preloader: PreloaderService,
    private spinService: SpinService,
    public router: Router,
    public translateService: TranslateService,
    private windowService: WindowService,
    private themesService: ThemeService,
    private nzConfigService: NzConfigService,
    private socketService: SocketService,
    private notification: NzNotificationService,

  ) {
    this.initTranslate();
  }

  initTranslate() {
    this.translateService.addLangs(['en', 'zh']);
    this.translateService.setDefaultLang('en');
  }

  fullScreenIconClick($event: MouseEvent): void {
    this.modalFullScreenFlag = !this.modalFullScreenFlag;
    fnStopMouseEvent($event);
    this.modalWrapService.fullScreenIconClick();
  }

  prepareRoute(outlet: RouterOutlet): string {
    return outlet?.activatedRouteData?.['key'];
  }

  ngOnInit(): void {
    const themeOptionsKey: any = this.windowService.getStorage(ThemeOptionsKey);
    this.nzConfigService.set('theme', {
      primaryColor: JSON.parse(themeOptionsKey).color
    });
    this.router.events
      .pipe(filter((event: NzSafeAny) => event instanceof NavigationEnd))
      .subscribe((event: NzSafeAny) => {
        this.spinService.setCurrentGlobalSpinStore(false);
      });
  }

  ngAfterViewInit(): void {
    this.preloader.removePreLoader();
    this.modalWrapService.setTemplate(this.modalBtnTpl);
    this.drawerWrapService.setTemplate(this.drawerFootDefaultTpl);
  }
}
