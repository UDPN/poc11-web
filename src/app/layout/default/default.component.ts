import { Component, OnInit, ChangeDetectionStrategy, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { takeUntil } from 'rxjs/operators';

import { fadeRouteAnimation } from '@app/animations/fade.animation';
import { IsFirstLogin } from '@config/constant';
import { DestroyService } from '@core/services/common/destory.service';
import { DriverService } from '@core/services/common/driver.service';
import { WindowService } from '@core/services/common/window.service';
import { ThemeService } from '@store/common-store/theme.service';

import { NavDrawerComponent } from './nav-drawer/nav-drawer.component';
import { LogoService } from '@app/core/services/http/poc-system/logo.service';
import { CommonService } from '@app/core/services/http/common/common.service';
import { StyleService } from '@app/core/services/http/poc-system/system-style/style.service';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeRouteAnimation],
  providers: [DestroyService]
})
export class DefaultComponent implements OnInit, AfterViewInit {
  isCollapsed$ = this.themesService.getIsCollapsed();
  themeOptions$ = this.themesService.getThemesMode();
  isCollapsed = false;
  isOverMode = false;
  isDefaultLogo: boolean = true;
  logoImg: any = '';
  systemName: any = '';
  @ViewChild('navDrawer') navDrawer!: NavDrawerComponent;
  version: any;
  constructor(
    private styleService: StyleService, private commonService: CommonService, private destroy$: DestroyService, private logoService: LogoService, private cdr: ChangeDetectorRef, private themesService: ThemeService, private driverService: DriverService, private windowService: WindowService) { }

  changeCollapsed(): void {
    if (this.isOverMode) {
      this.navDrawer.showDraw();
      return;
    }
    this.isCollapsed = !this.isCollapsed;
    this.themesService.setIsCollapsed(this.isCollapsed);
  }


  subTheme(): void {
    this.themesService
      .getIsCollapsed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => (this.isCollapsed = res));
    this.themesService
      .getIsOverMode()
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => (this.isOverMode = res));
  }

  prepareRoute(outlet: RouterOutlet): string {
    return outlet?.activatedRouteData?.['key'];
  }

  ngAfterViewInit(): void {
    if (this.windowService.getStorage(IsFirstLogin) === 'false') {
      return;
    }
    this.windowService.setStorage(IsFirstLogin, 'false');

  }

  ngOnInit(): void {
    this.subTheme();
    this.systemName = sessionStorage.getItem('systemName');
    this.version = sessionStorage.getItem('version');
    this.styleService.search().subscribe((res: any) => {
      if (res) {
        this.systemName = res.systemName;
        if (res.logoFileHash) {
          this.commonService
            .downImg({ hash: res.logoFileHash })
            .subscribe((resu) => {
              this.logoImg = 'data:image/jpg;base64,' + resu;
              this.cdr.markForCheck();
            });
        }
      }
    })
    // this.logoService.search({ logoType: 2 }).subscribe((res: any) => {
    //   if (res.length <= 0) {
    //     this.logoImg = '../../../../assets/imgs/system/bn.png';
    //     this.isDefaultLogo = true;
    //   } else {
    //     this.logoImg = res[0].logoBase64;
    //     this.isDefaultLogo = false;
    //   }
    //   this.cdr.markForCheck();
    // })
  }
}
