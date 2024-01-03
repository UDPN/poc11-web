import { Component, OnInit } from '@angular/core';
import { timestampToTime } from '@app/utils/tools';

@Component({
  selector: 'app-logo-title',
  templateUrl: './logo-title.component.html',
  styleUrls: ['./logo-title.component.less']
})
export class LogoTitleComponent implements OnInit {
  systemName: any = '';

  ngOnInit(): void {
    this.systemName = localStorage.getItem('systemName');
  }
}
