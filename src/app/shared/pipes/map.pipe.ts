import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import {
  thousandRate,
  thousandthMark,
  timestampToMonth,
  timestampToTime
} from '@app/utils/tools';

import { NzSafeAny } from 'ng-zorro-antd/core/types';

export const enum DateFormat {
  Date = 'yyyy-MM-dd',
  DateHour = 'yyyy-MM-dd HH',
  DateTime = 'yyyy-MM-dd HH:mm'
}

export const enum MapKeyType {
  String,
  Number,
  Boolean
}

export const MapSet = {
  contractStatus: {
    0: 'To be submitted',
    1: 'Voting',
    5: 'Approved',
    10: 'Declined',
    15: 'Compilation error'
  },
  resultStatus: {
    10: 'Deployment successful'
  },
  sex: {
    0: 'female',
    1: 'male'
  },
  available: {
    true: 'enable',
    false: 'disable'
  },
  isOrNot: {
    true: 'yes',
    false: 'no'
  },
  visible: {
    true: 'open',
    false: 'hide'
  },
  transactionType: {
    1: 'Contract Deployment',
    2: 'Contract Call'
  },
  transactionResult: {
    1: 'Pending',
    5: 'Success',
    10: 'Fail'
  },
  accessStatus: {
    0: 'Enabled',
    1: 'Disabled',
    2: 'Expired'
  },
  receiptStatus: {
    0: 'Failed',
    1: 'Successful'
  },
  version: {
    1: 'enterprise',
    0: 'standard'
  },
  accessibleType: {
    1: 'Myself',
    2: 'From BN',
    3: 'Public',
    4: 'Official'
  },
  lockable: {
    1: 'Disable',
    2: 'Enable'
  },
  foreignStatus: {
    0: 'Pending',
    1: 'Approved',
    2: 'Rejected',
    3: 'Repealed'
  },
  approvalResult: {
    0: '--',
    1: 'Agree',
    2: 'Reject'
  },
  chargingModel: {
    1: 'Proportional Charges',
    2: 'Fixed Charges'
  },
  transactionsStatus: {
    1: 'Success',
    2: 'Failure'
  },
  foreignStatusPool: {
    0: 'Pending',
    5: 'Approved',
    10: 'Rejected'
  },
  exchangeBusinessType: {
    0: 'Activate',
    1: 'Reduce'
  },
  walletTransactionsStatus: {
    1: 'Pending Approval',
    2: 'Rejected',
    3: 'Processing',
    5: 'Success',
    6: 'Failed',
    7: 'Processing',
    
  },
  walletTransactionsRecordStatus: {
    1: 'Pending',
    4: 'Processing',
    5: 'Success',
    6: 'Failed'
  },
  walletTransactionsStatusColor: {
    1: 'volcano',
    2: 'red',
    3: 'purple',
    5: 'cyan',
    6: 'red',
    7: 'purple',
  },
  walletTransactionsType: {
    1: 'Top-up',
    2: 'Withdrawal'
  },
  transactionsRecordType: {
    1: 'Swap',
    2: 'Exchange',
    3: 'Transfer'
  },
  transactionsRecordStatusColor: {
    1: 'volcano',
    4: 'purple',
    5: 'cyan',
    6: 'red'
  },
  region: {
    1: 'Domestic',
    2: 'Foreign'
  },
  walletStatus: {
    1: 'Pending Approval',
    2: 'Rejected',
    3: 'Processing',
    4: 'Processing',
    5: 'Active',
    6: 'Failed',
    7: 'Processing',
    8: 'Inactive'
  },
  walletStatusColor: {
    1: 'volcano',
    2: 'red',
    3: 'purple',
    4: 'purple',
    5: 'cyan',
    6: 'red',
    7: 'purple',
    8: 'default'
  },
  walletApprovalResult: {
    1: '--',
    2: 'Rejected',
    3: 'Agree',
    4: 'Agree',
    5: 'Agree',
    6: '--',
    7: '--',
    8: '--'
  },
  walletInfoType: {
    1: 'Swap',
    2: 'Exchange',
    3: 'Transfer',
    4: 'Top-up',
    5: 'Withdrawal'
  },
  walletInfoTransactionStatus: {
    1: 'Pending',
    2: 'Processing',
    3: 'Failed',
    4: 'Processing',
    5: 'Success',
    6: 'Failed',
    7: 'Failed'
  },
  walletInfoTopUpStatus: {
    1: 'Pending Approval',
    2: 'Rejected',
    3: 'Processing',
    4: 'Processing',
    7: 'Processing',
    5: 'Active',
    6: 'Failed'
  },
  logTreeStatus: {
    1: 'process',
    2: 'finish',
    3: 'error'
  },
  operationType: {
    0: 'Create',
    1: 'Freeze',
    2: 'Unfreeze'
  },
  operationStatus: {
    3: 'Pending Approval',
    4: 'Processing',
    5: 'Success',
    6: 'Rejected'
  }
};

export interface MapItem {
  label: string;
  value: NzSafeAny;
}

@Pipe({
  name: 'map'
})
export class MapPipe implements PipeTransform {
  private datePipe: DatePipe = new DatePipe('en-US');
  private mapObj = MapSet;

  static transformMapToArray(
    data: NzSafeAny,
    mapKeyType: MapKeyType = MapKeyType.Number
  ): MapItem[] {
    return Object.keys(data || {}).map((key) => {
      let value: NzSafeAny;
      switch (mapKeyType) {
        case MapKeyType.Number:
          value = Number(key);
          break;
        case MapKeyType.Boolean:
          value = key === 'true';
          break;
        case MapKeyType.String:
        default:
          value = key;
          break;
      }
      return { value, label: data[key] };
    });
  }

  transform(value: NzSafeAny, arg?: NzSafeAny): NzSafeAny {
    if (arg === undefined) {
      return value;
    }
    if (arg === 'nullValue') {
      if (!value) {
        return (value = '--');
      } else {
        return value;
      }
    }
    if (arg === 'null') {
      if (value?.indexOf(undefined) !== -1 || value.indexOf('null') !== -1) {
        return (value = '--');
      } else {
        return value;
      }
    }
    if (arg === 'timeStamp') {
      if (!value) {
        return (value = '--');
      } else {
        // return timestampToTime(value);
        value = value.toString();
        if (value.length === 10) {
          value = Number(value) * 1000;
        }
        let res = this.datePipe.transform(value, 'MMMM d, y HH:mm:ss a zzzz');
        return res?.replace('GMT', 'UTC');
      }
    }
    if (arg === 'toThousandthMark') {
      if (value === null || value === '' || value === undefined) {
        return (value = '--');
      } else {
        return thousandthMark(value);
      }
    }
    // Rate
    if (arg === 'toThousandRate') {
      if (value === null || value === '' || value === undefined) {
        return (value = '--');
      } else {
        return thousandRate(value);
      }
    }
    
    if (arg === 'monthStamp') {
      if (!value) {
        return (value = '--');
      } else {
        return timestampToMonth(value);
      }
    }
    let type: string = arg;
    let param = '';

    if (arg.indexOf(':') !== -1) {
      type = arg.substring(0, arg.indexOf(':'));
      param = arg.substring(arg.indexOf(':') + 1, arg.length);
    }
    switch (type) {
      case 'date':
        return this.datePipe.transform(value, param);
      default:
        // @ts-ignore
        return this.mapObj[type] ? this.mapObj[type][value] : '';
    }
  }
}
