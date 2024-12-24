/*
 * @Author: chenyuting
 * @Date: 2024-12-23 14:21:04
 * @LastEditors: chenyuting
 * @LastEditTime: 2024-12-24 10:02:37
 * @Description: 
 */

import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-interactive-messages',
  templateUrl: './interactive-messages.component.html',
  styleUrl: './interactive-messages.component.less'
})
export class InteractiveMessagesComponent implements OnInit, AfterViewInit {
  sendForm!: FormGroup;
  isLoading: boolean = false;
  isVisibleSend: boolean = false;

  ngAfterViewInit(): void {
      
  }
  ngOnInit(): void {
      
  }

  cancelSend() {
    this.isVisibleSend = false;
  }

  openSend() {
    this.isVisibleSend = true;
  }

  send() {
    console.log(this.sendForm.value);
  }
}
