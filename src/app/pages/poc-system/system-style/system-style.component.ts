import { ChangeDetectorRef, Component, Inject, OnInit, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { ThemeOptionsKey } from '@app/config/constant';
import { LoginInOutService } from '@app/core/services/common/login-in-out.service';
import { WindowService } from '@app/core/services/common/window.service';
import { UserService } from '@app/core/services/http/poc-system/user/user.service';
import { ThemeService } from '@app/core/services/store/common-store/theme.service';
import { SearchCommonVO } from '@app/core/services/types';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { NzConfigService } from 'ng-zorro-antd/core/config';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { finalize } from 'rxjs';
import { first } from 'rxjs/operators';
import { fnFormatToHump } from '@utils/tools';
import { DOCUMENT } from '@angular/common';

export interface SettingInterface {
  theme: 'dark' | 'light';
  color: string;
  mode: 'side' | 'top' | 'mixi';
  colorWeak: boolean;
  greyTheme: boolean;
  fixedHead: boolean;
  splitNav: boolean;
  fixedLeftNav: boolean;
  fixedTab: boolean;
  hasTopArea: boolean;
  hasFooterArea: boolean;
  hasNavArea: boolean;
  hasNavHeadArea: boolean;
}

interface NormalModel {
  image?: string;
  title: string;
  isChecked: boolean;
}

interface Theme extends NormalModel {
  key: 'dark' | 'light';
}

type SpecialTheme = 'color-weak' | 'grey-theme';
type SpecialThemeHump = 'colorWeak' | 'greyTheme';

interface Color extends NormalModel {
  key: string;
  color: string;
}

interface Mode extends NormalModel {
  key: 'side' | 'top' | 'mixi';
}


@Component({
  selector: 'app-system-style',
  templateUrl: './system-style.component.html',
  styleUrls: ['./system-style.component.less']
})
export class SystemStyleComponent implements OnInit {
  themesOptions$ = this.themesService.getThemesMode();
  isNightTheme$ = this.themesService.getIsNightTheme();
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumb: [],
    extra: '',
    desc: '',
    footer: ''
  };
  @ViewChild('operationTpl', { static: true })
  operationTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('numberTpl', { static: true })
  numberTpl!: TemplateRef<NzSafeAny>;
  tableConfig!: AntTableConfig;
  hex: string = '';
  _isNightTheme = false;
  _themesOptions: SettingInterface = {
    color: "#3c5686",
    colorWeak: false,
    fixedHead: true,
    fixedLeftNav: true,
    fixedTab: true,
    greyTheme: false,
    hasFooterArea: true,
    hasNavArea: true,
    hasNavHeadArea: true,
    hasTopArea: true,
    mode: "mixi",
    splitNav: false,
    theme: "dark"
  };
  tableQueryParams: NzTableQueryParams = { pageIndex: 1, pageSize: 10, sort: [], filter: [] }
  constructor(@Inject(DOCUMENT) private doc: Document, private rd2: Renderer2, private themesService: ThemeService, private nzConfigService: NzConfigService, private windowServe: WindowService, private userService: UserService, private message: NzMessageService, private cdr: ChangeDetectorRef, private modal: NzModalService, private loginOutService: LoginInOutService) { }
  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: `User Management`,
      breadcrumb: ['System Management', 'System Style'],
      extra: '',
      desc: '',
      footer: ''
    };
  }
  ngOnInit() {
    const themeOptionsKey:any = this.windowServe.getStorage(ThemeOptionsKey);
    this.hex = JSON.parse(themeOptionsKey).color;
    this.changeColor(this.hex);
  }

  changeColor(color: string) {
    this.nzConfigService.set('theme', {
      primaryColor: color
    });
    this._themesOptions.color = color;
    this.windowServe.setStorage(
      ThemeOptionsKey,
      JSON.stringify(this._themesOptions)
    );
  }

}
