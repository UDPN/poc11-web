
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Data, Router } from '@angular/router';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { delay, finalize } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd/message';
import { WindowService } from '@app/core/services/common/window.service';
import { PocJoinService } from '@app/core/services/http/poc-join/poc-join.service';

@Component({
  selector: 'app-u-modal',
  templateUrl: './u-modal.component.html',
  styleUrls: ['./u-modal.component.less'],
})
export class UModalComponent implements OnInit {

  @Input()
  list!: any[];
  @Input()
  type!: string;
  @Input()
  initData!: string;

  isChecked = false;
  setOfCheckedId = new Set<number>();
  listOfData: readonly Data[] = [];
  loading = false;
  btLoading = false;

  constructor(private modal: NzModalRef, public pocJoinService: PocJoinService, private cdr: ChangeDetectorRef, private router: Router, private message: NzMessageService, private windowSrc: WindowService) { }

  ngOnInit(): void {
    this.initPage();
  }

  private initPage(): void {
    

    if (this.type === 'init') {
      this.list.forEach((element, i) => {
        element['id'] = i;
      });
      this.listOfData = this.list;
    }
    if (this.type === 'change') {
      this.pocJoinService.fetchSwitchVnList({ inPage: { pageNum: 1, pageSize: 10 } }).pipe(finalize(() => this.loading = false)).subscribe(res => {
        (res as []).forEach((element: any, i) => {
          element['id'] = i;
        });
        this.listOfData = res;
      })
    }
    let indexData = this.list.findIndex((ev) => {
      return ev.vnId === this.initData;
    })

    indexData >= 0 ? this.onItemChecked(indexData, true) : "";
  }

  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
  }

  updateCheckedSet(id: number, checked: boolean): void {
    this.setOfCheckedId.clear();
    if (checked) {
      this.setOfCheckedId.add(id);
      this.isChecked = true;
    } else {
      this.setOfCheckedId.delete(id);
      this.isChecked = false;
    }
  }

  destroyModal() {
    this.modal.destroy();
  }

  onSubmit() {
    this.btLoading = true;
    if (this.type === 'init') {
      this.setOfCheckedId.forEach(item => {
        this.pocJoinService.bindVnId({ vnId: this.listOfData[item]['vnId'] }).pipe(finalize(() => this.btLoading = false)).subscribe(res => {
          this.modal.destroy(this.listOfData[item]);
          this.cdr.markForCheck();
        })
      })
    } else {
      this.setOfCheckedId.forEach(item => {
        this.pocJoinService.switchVnId({ vnId: this.listOfData[item]['vnId'] }).pipe(finalize(() => this.btLoading = false)).subscribe(res => {
          this.message.success("Switch VN successfully!").onClose.subscribe(_ => {
            this.windowSrc.removeSessionStorage('setVN');
            this.router.navigateByUrl('/onboarding/bn-onboarding-details')
          })
        })
      })

    }

  }
}
