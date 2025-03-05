/*
 * @Author: chenyuting
 * @Date: 2024-12-09 15:40:45
 * @LastEditors: chenyuting
 * @LastEditTime: 2025-02-12 10:56:46
 * @Description:
 */
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-record-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.less']
})
export class TimelineComponent implements OnInit {
  @Input() info: any;
  ngOnInit() {}
}
