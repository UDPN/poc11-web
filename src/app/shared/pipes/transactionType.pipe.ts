import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'transactionType'
})
export class TransactionTypePipe implements PipeTransform {

  transform(value: any, args?: any): string {
    const config: any = {
      1: 'Contract Deployment',
      2: 'Contract Call'
    };
    return config[value];
  }
}
