/*
 * @Author: chenyuting
 * @Date: 2024-12-23 14:21:04
 * @LastEditors: chenyuting
 * @LastEditTime: 2024-12-25 17:52:51
 * @Description:
 */

import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  isVisibleSend: boolean = false;
  bankNameList: any = [];
  dataList: any = [];
  total: any = '';
  pageIndex: number = 1;
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
    private message: NzMessageService
  ) {}
  ngAfterViewInit(): void {}
  ngOnInit(): void {
    this.getDataList();
    this.sendForm = this.fb.group({
      toClientType: [null, [Validators.required]],
      title: [null, [Validators.required]],
      content: [null],
      toClientCode: [null, [Validators.required]]
    });
  }

  // onSelect(value: any) {
  //   if (value === 1) {
  //     this.getDataList(1);
  //     this.cdr.markForCheck();
  //   } else {
  //     this.getDataList(2);
  //     this.cdr.markForCheck();
  //   }
  // }

  onSelectBank(value: any) {
    if (value === 1) {
      console.log(value, '1111');
      this.notificationsService.getCentralBankList().subscribe((res: any) => {
        this.bankNameList = res;
        this.cdr.markForCheck();
        return;
      });
    } else {
      console.log(value, 222);

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
    this.isVisibleSend = false;
  }

  send() {
    if (!fnCheckForm(this.sendForm)) {
      return;
    }
    this.isLoading = true;
    this.notificationsService
      .addChat(this.sendForm.value)
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
          this.isVisibleSend = false;
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.isLoading = false;
          this.isVisibleSend = false;
          this.cdr.markForCheck();
        }
      });
  }

  toCompose() {
    this.isVisibleSend = true;
  }

  getDataList(sendType?: any): void {
    const params: SearchCommonVO<any> = {
      pageSize: 10,
      pageNum: 1,
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
