import { Directive, Input, OnInit, TemplateRef } from '@angular/core';

import { NzSafeAny } from 'ng-zorro-antd/core/types';

@Directive({
  selector: 'ng-template[named]'
})
export class NamedTemplate<T> implements OnInit {

  @Input() named!: string;
  constructor(public template: TemplateRef<T>) {}

  ngOnInit(): void {
    this.resolveName();
  }

  resolveName(): void {
    if (!this.named && this.template) {
      const tplRef = this.template as NzSafeAny;
      
      this.named = tplRef._declarationTContainer.localNames?.[0];
    }
  }
}
