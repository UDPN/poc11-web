import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'contract'
})
export class ContractPipe implements PipeTransform {

  transform(value: number): string {
    switch (value) {
      case 1:
        return 'To be deployed';
      case 10:
        return 'Deployment successful';
      case 15:
        return 'Deployment failed';
      case 16:
        return 'Voting ';
      case 17:
        return 'Vote not passed';
      default:
        return '';
    }
  }

}
