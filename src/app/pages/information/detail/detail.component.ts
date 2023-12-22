/*
 * @Author: zhangxuefeng
 * @Date: 2023-10-21 10:11:45
 * @LastEditors: zhangxuefeng
 * @LastEditTime: 2023-10-25 18:34:42
 * @Description:
 */
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InformationService } from '@app/core/services/http/information/information.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.less']
})
export class DetailComponent implements OnInit {
  detailData = {
    spCode: '',
    spName: '',
    bankBic: '',
    centralBankName: '',
    centralBankId: '',
    spBriefIntroduction: '',
    spDescription: '',
    spBesuWalletAddress: '',
    bnCode: '',
    contactName: '',
    mobileNumber: '',
    email: '',
    detailedAddress: '',
    businessLicenseUrl: '',
    spStatus: 0,
    remark: ''
  };
  srcUrl: string = '';
  constructor(
    private detailService: InformationService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.getDetail();
  }
  private getDetail() {
    this.detailService.detail().subscribe((res) => {
      this.detailData = res;
      this.detailService
        .downImg({ hash: res.businessLicenseUrl })
        .subscribe((resu) => {
          this.srcUrl = 'data:image/jpg;base64,' + resu;
          this.cdr.markForCheck();
        });
      this.cdr.markForCheck();
    });
  }
  doAction() {
    this.router.navigateByUrl('/information/edit');
  }
}
