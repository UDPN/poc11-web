import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ForeignExchangeApplyService } from '@app/core/services/http/poc-profile/foreign-exchange-apply/foreign-exchange-apply.service';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.less']
})
export class AddComponent implements OnInit, AfterViewInit {
  info: any = {};
  constructor(
    private _foreignExchangeApplyService: ForeignExchangeApplyService
  ) {}
  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: 'Activate Currency',
      breadcrumbs: [
        {
          name: 'Capital Pool Management',
          url: '/poc/poc-capital-pool/capital-pool'
        },
        { name: 'Activate Currency' }
      ],
      extra: '',
      desc: '',
      footer: ''
    };
  }
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumbs: [],
    extra: '',
    desc: '',
    footer: ''
  };
  ngOnInit(): void {
    this._foreignExchangeApplyService.getSpApprovedInfo().subscribe((res) => {
      this.info = res;
    });
  }
}
