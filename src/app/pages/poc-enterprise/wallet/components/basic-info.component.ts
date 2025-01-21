/*
 * @Author: chenyuting
 * @Date: 2025-01-20 16:50:28
 * @LastEditors: chenyuting
 * @LastEditTime: 2025-01-21 16:43:21
 * @Description:
 */
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-basic-info',
  templateUrl: './basic-info.component.html',
  styleUrl: './basic-info.component.less'
})
export class BasicInfoComponent {
  @Input() info: any;
}
