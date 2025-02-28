/*
 * @Author: chenyuting
 * @Date: 2024-12-27 13:38:17
 * @LastEditors: chenyuting
 * @LastEditTime: 2024-12-27 14:30:21
 * @Description:
 */
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { PocAccessKeyService } from '@app/core/services/http/poc-access-key/poc-access-key.service';
interface SearchParam {
  gatewayUrl: string;
  accessKey: any;
}
@Component({
  selector: 'app-access-key',
  templateUrl: './access-key.component.html',
  styleUrl: './access-key.component.less'
})
export class AccessKeyComponent implements OnInit, AfterViewInit {
  @ViewChild('headerContent', { static: false })
  headerContent!: TemplateRef<NzSafeAny>;
  @ViewChild('headerExtra', { static: false })
  headerExtra!: TemplateRef<NzSafeAny>;
  searchParam: Partial<SearchParam> = {
    gatewayUrl: '',
    accessKey: ''
  };
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumb: [],
    extra: '',
    desc: '',
    footer: ''
  };

  constructor(
    private pocAccessKeyService: PocAccessKeyService,
    private cdr: ChangeDetectorRef
  ) {}
  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: ``,
      breadcrumb: ['OpenAPI Access Key'],
      extra: this.headerExtra,
      desc: this.headerContent,
      footer: ''
    };
  }

  ngOnInit(): void {
    this.searchParam.accessKey = sessionStorage.getItem('token');
    this.gatewayUrl();
  }

  gatewayUrl() {
    this.pocAccessKeyService.gatewayUrl().subscribe((res) => {
      this.searchParam.gatewayUrl = res.gatewayUrl;
      this.cdr.markForCheck();
      return;
    });
  }
}
