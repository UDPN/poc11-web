import { ChangeDetectorRef, inject, ViewRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OperatorFunction, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

const untilDestroyedFn = function untilDestroyed(): OperatorFunction<any, any> {
  const subject = new Subject<void>();
  const viewRef = inject(ChangeDetectorRef) as ViewRef;

  viewRef.onDestroy(() => {
    subject.next();
    subject.complete();
  });

  return takeUntil(subject.asObservable());
};


const getRouteParamFn = function getRouteParam(key: string): string {
  return inject(ActivatedRoute).snapshot.params[key];
};

export { untilDestroyedFn, getRouteParamFn };
