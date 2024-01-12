import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'transactionResult'
})
export class TransactionResultPipe implements PipeTransform {

  transform(value: any, args?: any): string {
    const config: any = {
      1: 'Pending',
      5: 'Success',
      10: 'Fail'
    };
    return config[value];
  }

}
