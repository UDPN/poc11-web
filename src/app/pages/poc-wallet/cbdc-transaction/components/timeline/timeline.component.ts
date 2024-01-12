import { Component, Input, OnInit } from '@angular/core';


@Component({
  selector: 'app-cbdc-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.less']
})
export class TimelineComponent implements OnInit {
  @Input() info: any;
  ngOnInit() {}

}
