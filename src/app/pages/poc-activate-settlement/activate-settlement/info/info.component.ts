import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginInOutService } from '@app/core/services/common/login-in-out.service';
import { CommonService } from '@app/core/services/http/common/common.service';
import { InformationService } from '@app/core/services/http/information/information.service';
import { PocActivateSettlementService } from '@app/core/services/http/poc-activate-settlement/poc-activate-settlement.service';
// import { PocProviderService } from '@app/core/services/http/poc-provider/poc-provider.service';
import { AntTableConfig } from '@app/shared/components/ant-table/ant-table.component';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.less']
})
export class InfoComponent implements OnInit {
  @ViewChild('authorizedTpl', { static: true })
  authorizedTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('currencyTpl', { static: true })
  currencyTpl!: TemplateRef<NzSafeAny>;
  @ViewChild('headerContent', { static: false })
  headerContent!: TemplateRef<NzSafeAny>;
  @ViewChild('headerExtra', { static: false })
  headerExtra!: TemplateRef<NzSafeAny>;
  @Output() toEdit = new EventEmitter();
  info: any = {};
  documentDid: any = '';
  infoMemberLicense: any = '';
  tableConfig!: AntTableConfig;
  dataList: NzSafeAny[] = [];
  attachmentsList: any[] = [];
  updateStatus: any = 0;
  reason: any = '';
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumb: [],
    extra: '',
    desc: '',
    footer: ''
  };
  constructor(
    public routeInfo: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    public _informationService: InformationService,
    public pocActivateSettlementService: PocActivateSettlementService,
    private router: Router,
    private commonService: CommonService,
    private loginOutService: LoginInOutService
  ) {}

  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: ``,
      breadcrumb: ['Activate Settlement Business'],
      extra: this.headerExtra,
      desc: this.headerContent,
      footer: ''
    };
  }

  ngOnInit() {
    this.initTable();
    this.getInfo();
    this.getResourceInfo();
  }

  changePageSize(e: number): void {
    this.tableConfig.pageSize = e;
  }
  login() {
    sessionStorage.clear();
    this.loginOutService.loginOut().then((_) => {
      this.router.navigateByUrl('/login/login-modify');
    });
  }
  getInfo(): void {
    this._informationService.detail().subscribe((res) => {
      this.info = res;
      this.cdr.markForCheck();
    });
  }

  getResourceInfo(): void {
    this.pocActivateSettlementService.getInfo().subscribe((res: any) => {
      this.updateStatus = res.updateStatus;
      if (this.updateStatus === 0) {
        this.router.navigateByUrl(
          '/poc/poc-activate-settlement/activate-settlement'
        );
      }
      this.reason = res.remark;
      this.dataList = res.capitalPoolList;
      this.attachmentsList = res.fileList;
      this.cdr.markForCheck();
      return;
    });
  }

  private base64ToBlob(urlData: string, type: string) {
    let arr = urlData.split(',');
    let array = arr[0].match(/:(.*?);/);
    let mime = (array && array.length > 1 ? array[1] : type) || type;
    let bytes = window.atob(arr[1]);
    let ab = new ArrayBuffer(bytes.length);
    let ia = new Uint8Array(ab);
    for (let i = 0; i < bytes.length; i++) {
      ia[i] = bytes.charCodeAt(i);
    }
    return new Blob([ab], {
      type: mime
    });
  }

  private downloadFile(base64: any, fileName: string) {
    const fileType = fileName.slice(fileName.lastIndexOf('.') + 1);
    let typeHeader = 'data:application/' + fileType + ';base64,';
    let converedBase64 = typeHeader + base64;
    let blob = this.base64ToBlob(converedBase64, fileType);
    this.downloadExportFile(blob, fileName);
  }

  private downloadExportFile(blob: any, fileName: string) {
    let downloadElement = document.createElement('a');
    let href = blob;
    if (typeof blob == 'string') {
      downloadElement.target = '_blank';
    } else {
      href = window.URL.createObjectURL(blob);
    }
    downloadElement.href = href;
    downloadElement.download = fileName;
    document.body.appendChild(downloadElement);
    downloadElement.click();
    document.body.removeChild(downloadElement);
    if (typeof blob != 'string') {
      window.URL.revokeObjectURL(href);
    }
  }

  onLoad(settlementBankFileHash: string, fileUrl: string) {
    this.commonService
      .downImg({ hash: settlementBankFileHash })
      .subscribe((res) => {
        this.downloadFile(res, fileUrl);
      });
  }

  onUpdate() {
    const status = true;
    this.toEdit.emit(status);
  }

  private initTable(): void {
    this.tableConfig = {
      headers: [
        {
          title: 'Currency',
          tdTemplate: this.currencyTpl,
          width: 180
        },
        {
          title: 'Account/Wallet (Capital Pool Address)',
          field: 'capitalPoolAddress',
          width: 300
        },
        {
          title: 'Pre-authorized Debit',
          tdTemplate: this.authorizedTpl,
          width: 120
        }
      ],
      total: 0,
      showCheckbox: false,
      loading: false,
      pageSize: 10,
      pageIndex: 1
    };
  }
}
