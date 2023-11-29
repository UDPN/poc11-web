import { CdkVirtualForOf } from '@angular/cdk/scrolling';
import { NgForOf } from '@angular/common';
import { Directive, Host, Input, Optional } from '@angular/core';

/*
 *
 * <some-tag *ngFor="let item of models; trackByProperty: 'yourDiscriminantProp'">
 * */

@Directive({
  selector: '[ngForTrackByProperty]'
})
export class TrackByPropertyDirective {
  private _propertyName: string = '';

  public constructor(@Host() @Optional() private readonly _ngFor: NgForOf<any>, @Host() @Optional() private readonly _cdkFor: CdkVirtualForOf<any>) {
    if (this._ngFor) {
      this._ngFor.ngForTrackBy = (_: number, item: any) => (this._propertyName ? item[this._propertyName] : item);
    }
    if (this._cdkFor) {
      this._cdkFor.cdkVirtualForTrackBy = (_: number, item: any) => (this._propertyName ? item[this._propertyName] : item);
    }
  }

  @Input('ngForTrackByProperty')
  public set propertyName(value: string | null) {
    
    this._propertyName = value ?? '';
  }
}
