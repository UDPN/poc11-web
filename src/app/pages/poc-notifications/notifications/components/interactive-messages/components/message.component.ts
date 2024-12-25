import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { SearchCommonVO } from '@app/core/services/types';
import { NotificationsService } from '@app/core/services/http/poc-notifications/poc-notifications.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrl: './message.component.less'
})
export class MessageComponent implements OnInit {
  dataList: any = [];
  total: any = '';
  pageIndex: number = 1;
  // @Input() cardList: any;
  constructor(
    private notificationsService: NotificationsService,
    private cdr: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    this.getDataList();
  }
  getDataList(e?: NzTableQueryParams): void {
    const params: SearchCommonVO<any> = {
      pageSize: 10,
      pageNum: 1,
      filters: { sendType: 1 }
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
