import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs';

import { ThemeService } from '@store/common-store/theme.service';
import { LogoService } from '@app/core/services/http/poc-system/logo.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SideNavComponent implements OnInit {
  themesOptions$ = this.themesService.getThemesMode();
  isNightTheme$ = this.themesService.getIsNightTheme();
  isCollapsed$: Observable<boolean> = this.themesService.getIsCollapsed();

  isDefaultLogo: boolean = true;
  logoImg: any = '';
  constructor(private themesService: ThemeService, private logoService: LogoService, private cdr: ChangeDetectorRef ) {}

  ngOnInit(): void {
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
