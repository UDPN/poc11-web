/*
 * @Author: zhangxuefeng
 * @Date: 2023-10-21 10:11:45
 * @LastEditors: chenyuting
 * @LastEditTime: 2024-12-18 11:25:18
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
  detailData: any = {};
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
      this.cdr.markForCheck();
    });
  }
  doAction() {
    this.router.navigateByUrl('/information/edit');
  }
  goToPdf() {
    window.open('/assets/api-documentation/Project Kissen APIs.pdf');
  }
}
