/*
 * @Author: chenyuting
 * @Date: 2024-12-23 14:21:04
 * @LastEditors: chenyuting
 * @LastEditTime: 2024-12-26 16:30:12
 * @Description:
 */

import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { NotificationsService } from '@app/core/services/http/poc-notifications/poc-notifications.service';
import { SearchCommonVO } from '@app/core/services/types';
import { fnCheckForm } from '@app/utils/tools';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-interactive-messages',
  templateUrl: './interactive-messages.component.html',
  styleUrl: './interactive-messages.component.less'
})
export class InteractiveMessagesComponent implements OnInit, AfterViewInit {
  sendForm!: FormGroup;
  isLoading: boolean = false;
  isVisible: boolean = false;
  visibleTitle: string = '';
  chatMsgId: any = '';
  msgCode: any = '';
  bankNameList: any = [];
  dataList: any = [];
  chatInfo: any = [];
  total: any = '';
  infoTotal: any = '';
  current: any = 1;
  pageIndex: number = 1;
  sendType: any = '';
  modules: any = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ size: [] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ['clean']
    ]
  };
  constructor(
    private fb: FormBuilder,
    private notificationsService: NotificationsService,
    private cdr: ChangeDetectorRef,
    private modal: NzModalService,
    private message: NzMessageService,
    private sanitizer: DomSanitizer
  ) {}
  ngAfterViewInit(): void {}
  ngOnInit(): void {
    this.getDataList(this.sendType, 1);
    this.sendForm = this.fb.group({
      toClientType: [null, [Validators.required]],
      title: [null, [Validators.required]],
      content: [null, [Validators.required]],
      toClientCode: [null, [Validators.required]]
    });
  }

  onSelectBank(value: any) {
    if (value === 1) {
      this.notificationsService.getCentralBankList().subscribe((res: any) => {
        this.bankNameList = res;
        this.cdr.markForCheck();
        return;
      });
    } else {
      this.notificationsService
        .getCommercialBankList()
        .subscribe((res: any) => {
          this.bankNameList = res;
          this.cdr.markForCheck();
          return;
        });
    }
  }
  cancelSend() {
    this.isVisible = false;
    this.sendForm.reset();
    this.chatMsgId = '';
    this.msgCode = '';
  }

  send() {
    if (!fnCheckForm(this.sendForm)) {
      return;
    }
    const params = this.sendForm.value;
    if (this.visibleTitle === 'Reply') {
      params.msgCode = this.msgCode;
    }
    this.isLoading = true;
    this.notificationsService
      .addChat(params)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (res) => {
          if (res) {
            this.message
              .success('Add successfully!', { nzDuration: 1000 })
              .onClose.subscribe(() => {
                this.sendForm.reset();
              });
          }
          this.isLoading = false;
          this.isVisible = false;
          this.sendType = '';
          this.getDataList(this.sendType, 1);
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.isLoading = false;
          this.isVisible = false;
          this.cdr.markForCheck();
        }
      });
  }

  getCurrentIndex(value: any) {
    this.getDataList(this.sendType, value);
  }

  getInfoCurrentIndex(value: any) {
    this.getChatInfoList(this.chatMsgId, this.msgCode, value);
  }

  toCompose(visibleTitle: string, chatMsgId?: any, msgCode?: any) {
    this.isVisible = true;
    this.visibleTitle = visibleTitle;
    this.chatMsgId = chatMsgId;
    this.msgCode = msgCode;
    if (chatMsgId && msgCode) {
      this.getChatInfoList(chatMsgId, msgCode, 1);
    }
  }

  getSendType(value: any) {
    this.sendType = value;
    this.getCurrentIndex(1);
  }
  getChatInfoList(chatMsgId: any, msgCode: any, pageNum: number): void {
    const params: SearchCommonVO<any> = {
      pageSize: 10,
      pageNum: pageNum,
      filters: { chatMsgId, msgCode }
    };
    this.notificationsService
      .getChatInfo(params.pageNum, params.pageSize, params.filters)
      .pipe(finalize(() => {}))
      .subscribe((_: any) => {
        this.chatInfo = _.data?.rows;
        this.sendForm
          .get('toClientType')
          ?.setValue(
            _.data?.rows[0].sendType === 1
              ? _.data?.rows[0].toClientType
              : _.data?.rows[0].fromClientType
          );
        this.sendForm.get('title')?.setValue(_.data?.rows[0].title);
        this.sendForm
          .get('toClientCode')
          ?.setValue(
            _.data?.rows[0].sendType === 1
              ? _.data?.rows[0].toClientCode
              : _.data?.rows[0].fromClientCode
          );
        this.chatInfo.map((item: any) => {
          item.content = this.sanitizer.bypassSecurityTrustHtml(item.content);
        });
        this.infoTotal = _.data.page.total;
        this.cdr.markForCheck();
      });
  }

  getDataList(sendType: any, pageNum: number): void {
    const params: SearchCommonVO<any> = {
      pageSize: 10,
      pageNum: pageNum,
      filters: { sendType }
    };
    this.notificationsService
      .getChatList(params.pageNum, params.pageSize, params.filters)
      .pipe(finalize(() => {}))
      .subscribe((_: any) => {
        this.dataList = _.data?.rows;
        this.total = _.data.page.total;
        // this.pageIndex = params.pageNum;
        this.cdr.markForCheck();
      });
  }
}
