/*
 * @Author: chenyuting
 * @Date: 2024-12-09 15:40:45
 * @LastEditors: chenyuting
 * @LastEditTime: 2024-12-19 15:32:50
 * @Description: 
 */
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
