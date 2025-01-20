/*
 * @Author: chenyuting
 * @Date: 2025-01-20 14:03:37
 * @LastEditors: chenyuting
 * @LastEditTime: 2025-01-20 17:14:22
 * @Description:
 */
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fnCheckForm } from '@app/utils/tools';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.less'
})
export class TimelineComponent implements OnInit {
  @Input() info: any;
  @Input() type: any;
  rejectStatus: boolean = false;
  isLoading: boolean = false;
  validateForm!: FormGroup;
  constructor(private fb: FormBuilder) {}
  ngOnInit(): void {
    this.validateForm = this.fb.group({
      reason: [null, [Validators.required]]
    });
  }
  getStatus(value: number, approval?: boolean) {
    // 1: reject  2:approve
    if (value === 1) {
      this.rejectStatus = true;
    } else {
      this.rejectStatus = false;
      this.validateForm.reset();
      if (approval) {
        this.getApproval('approve');
      }
    }
  }

  getApproval(value: string) {
    if (value === 'reject') {
      if (!fnCheckForm(this.validateForm)) {
        return;
      }
    }
    this.isLoading = true;
  }
}
