import {
  Component,
  OnInit,
  AfterViewInit,
  ChangeDetectorRef,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  UntypedFormControl
} from '@angular/forms';
import { Router } from '@angular/router';
import { WindowService } from '@app/core/services/common/window.service';
import { UModalComponent } from '@app/shared/components/u-modal/u-modal.component';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Location } from '@angular/common';
import { InformationService } from '@app/core/services/http/information/information.service';
import { fnCheckForm } from '@app/utils/tools';
import { NzMessageService } from 'ng-zorro-antd/message';
import { delay, filter, finalize, interval, take, takeUntil, tap } from 'rxjs';
import { UpdateStoreService } from '@app/core/services/store/onboarding-store/update.service';
import { DestroyService } from '@app/core/services/common/destory.service';
import { CommonService } from '@app/core/services/http/common/common.service';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { PocActivateSettlementService } from '@app/core/services/http/poc-activate-settlement/poc-activate-settlement.service';
import { LoginService } from '@app/core/services/http/login/login.service';
import { LoginInOutService } from '@app/core/services/common/login-in-out.service';

interface SearchParam {
  nodeName: string;
  nodeCode: string;
  status: string;
  key: string;
  bizSN: string;
  nodeType: string;
  nodeTitle: string;
  remark: string;
  creation: any;
  fromVn: string;
}

@Component({
  selector: 'app-activate-settlement',
  templateUrl: './activate-settlement.component.html',
  styleUrls: ['./activate-settlement.component.less']
})
export class ActivateSettlementComponent implements OnInit, AfterViewInit {
  @ViewChild('authorizedTpl', { static: true })
  authorizedTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('headerContent', { static: false })
  headerContent!: TemplateRef<NzSafeAny>;
  @ViewChild('headerExtra', { static: false })
  headerExtra!: TemplateRef<NzSafeAny>;
  infoMemberLicense: any = '';
  info: any = [];
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumb: [],
    extra: '',
    desc: '',
    footer: ''
  };
  updateStatus: any = 0;
  isEdit: boolean = false;
  constructor(
    private fb: FormBuilder,
    private modalService: NzModalService,
    private windowSrc: WindowService,
    private _location: Location,
    public _informationService: InformationService,
    public pocActivateSettlementService: PocActivateSettlementService,
    private loginService: LoginService,
    public _commonService: CommonService,
    private loginOutService: LoginInOutService,
    private cdr: ChangeDetectorRef,
    private router: Router

  ) { }
  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: ``,
      breadcrumb: ['Become A FX Service Provider'],
      extra: this.headerExtra,
      desc: this.headerContent,
      footer: ''
    };
  }

  ngOnInit(): void {
    this.getInfo();
    this.getResourceInfo();
    this.getEdit();
  }

  getEdit(e?: any) {
    if (e) {
      this.isEdit = e;
    }
    console.log(this.isEdit);
  }

  getInfo() {
    this._informationService.detail().subscribe((res) => {
      this.info = res;
      this._informationService
        .downImg({ hash: res.businessLicenseUrl })
        .subscribe((resu) => {
          this.infoMemberLicense = 'data:image/jpg;base64,' + resu;
          this.cdr.markForCheck();
        });
    })
  }

  getResourceInfo(): void {
    this.pocActivateSettlementService.getInfo().subscribe((res: any) => {
      this.updateStatus = res.updateStatus;
      if (this.updateStatus === 10) {
        this.modalService.success({
          nzTitle: 'Please log in again',
          nzContent: 'You have been upgraded to a FX Service Provider !',
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
      this.cdr.markForCheck();
      return;
    })
  }
}
