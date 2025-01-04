/*
 * @Author: chenyuting
 * @Date: 2024-07-02 14:33:55
 * @LastEditors: chenyuting
 * @LastEditTime: 2025-01-04 17:29:29
 * @Description:
 */
import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  Renderer2,
  TemplateRef,
  ViewChild
} from '@angular/core';
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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StyleService } from '@app/core/services/http/poc-system/system-style/style.service';
import { CommonService } from '@app/core/services/http/common/common.service';
import { Router } from '@angular/router';

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
  _isNightTheme = false;
  _themesOptions: SettingInterface = {
    color: '',
    colorWeak: false,
    fixedHead: true,
    fixedLeftNav: true,
    fixedTab: true,
    greyTheme: false,
    hasFooterArea: true,
    hasNavArea: true,
    hasNavHeadArea: true,
    hasTopArea: true,
    mode: 'mixi',
    splitNav: false,
    theme: 'dark'
  };
  validateForm!: FormGroup;
  fileImg: any = '';
  fileImgWord!: File;
  isLoading: boolean = false;
  originalLogo!: string;
  tableQueryParams: NzTableQueryParams = {
    pageIndex: 1,
    pageSize: 10,
    sort: [],
    filter: []
  };
  constructor(
    @Inject(DOCUMENT) private doc: Document,
    private fb: FormBuilder,
    private rd2: Renderer2,
    private themesService: ThemeService,
    private nzConfigService: NzConfigService,
    private windowServe: WindowService,
    private message: NzMessageService,
    private cdr: ChangeDetectorRef,
    private modal: NzModalService,
    private loginOutService: LoginInOutService,
    private styleService: StyleService,
    private commonService: CommonService,
    private router: Router
  ) {}

  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: `User Management`,
      breadcrumb: ['System Management', 'UI Configuration'],
      extra: '',
      desc: '',
      footer: ''
    };
  }
  ngOnInit() {
    this.validateForm = this.fb.group({
      systemName: [null, [Validators.required]],
      logoFileHash: [null, [Validators.required]],
      themeColor: ['#3c5686', [Validators.required]]
    });
    this.editTheme();
  }

  editTheme() {
    this.styleService.search().subscribe((res: any) => {
      if (res.logoFileHash) {
        this.validateForm.get('systemName')?.setValue(res.systemName);
        this.validateForm.get('themeColor')?.setValue(res.themeColor);
        this.validateForm.get('logoFileHash')?.setValue(res.logoFileHash);
        this.originalLogo = res.logoFileHash;
        this.changeColor(res.themeColor);
        this.commonService
          .downImg({ hash: res.logoFileHash })
          .subscribe((resu) => {
            this.fileImg = 'data:image/jpg;base64,' + resu;
            this.cdr.markForCheck();
          });
      } else {
        const themeOptionsKey: any =
          this.windowServe.getStorage(ThemeOptionsKey);
        const hex = JSON.parse(themeOptionsKey).color;
        this.validateForm.get('themeColor')?.setValue(hex);
      }
    });
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

  uploadFileImg($event: any) {
    if ($event.target.files.length === 0) {
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL($event.target.files[0]);
    reader.onload = () => {
      this.fileImg = reader.result;
      this.fileImgWord = $event.target.files[0];
      this.cdr.markForCheck();
      this.validateForm.get('logoFileHash')?.setValue(this.fileImg);
    };
  }

  onSubmit() {
    if (this.validateForm.valid) {
      this.isLoading = true;
      this.modal.confirm({
        nzTitle: 'Are you sure you want to modify the configuration?',
        nzContent: '',
        nzOnOk: () => {
          if (
            this.originalLogo === this.validateForm.get('logoFileHash')?.value
          ) {
            this.styleService
              .submit(this.validateForm.value)
              .subscribe((res) => {
                this.isLoading = false;
                if (res) {
                  this.message.success(`Submitted`).onClose!.subscribe(() => {
                    // sessionStorage.clear();
                    // this.loginOutService.loginOut().then((_) => {
                    //   this.router.navigateByUrl('/login/login-modify');
                    // });
                  });
                }
                this.cdr.markForCheck();
              });
          } else {
            this.commonService
              .uploadImg(this.fileImgWord)
              .subscribe((result) => {
                if (result) {
                  this.validateForm.get('logoFileHash')?.setValue(result);
                  this.styleService
                    .submit(this.validateForm.value)
                    .subscribe((res) => {
                      this.isLoading = false;
                      if (res) {
                        this.message
                          .success(`Submitted`)
                          .onClose!.subscribe(() => {
                            // sessionStorage.clear();
                            // this.loginOutService.loginOut().then((_) => {
                            //   this.router.navigateByUrl('/login/login-modify');
                            // });
                          });
                      }
                      this.cdr.markForCheck();
                    });
                }
              });
          }
        }
      });
    }
  }
}
