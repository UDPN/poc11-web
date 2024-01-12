import { Directive, HostBinding, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appEnable]',
})
export class DisabledDirective {
  private _appEnable!:boolean;
  
  @Input('appEnable') set appDisabled(value: boolean) {
    this._appEnable = value;
    this.enable = value;
    this.disabledStyle = !value;
  }


  @HostBinding('class.operate-text') enable = false;
  @HostBinding('class.operate-text-disabled') disabledStyle = false;

  // @HostListener("click", ["$event"])
  
  
  
  
  
  
  constructor() {}
}
