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
    1: 'Inactive',
    2: 'Active'
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
    1: 'Deactivate'
  },
  walletTransactionsStatus: {
    1: 'Pending Approval',
    2: 'Rejected',
    3: 'Processing',
    5: 'Success',
    6: 'Failed',
    7: 'Processing'
  },
  walletInfoTransactionsStatus: {
    5: 'Pending Approval',
    10: 'Processing',
    15: 'Rejected',
    20: 'Processing',
    30: 'Processing',
    35: 'Success',
    40: 'Failed'
  },
  walletInfoTransactionsStatusColor: {
    5: 'volcano',
    10: 'blue',
    15: 'red',
    20: 'blue',
    30: 'blue',
    35: 'green',
    40: 'red'
  },
  walletTransactionsRecordStatus: {
    5: 'Pending Approval',
    10: 'Processing',
    15: 'Rejected',
    20: 'Processing',
    30: 'Processing',
    35: 'Success',
    40: 'Failed'
  },
  EnterpriseStatus: {
    0: 'Pending Approval',
    1: 'Active',
    2: 'Inactive',
    3: 'Failed'
  },
  EnterpriseStatusColor: {
    0: 'warning',
    1: 'green',
    2: 'default',
    3: 'red'
  },
  walletTransactionsStatusColor: {
    1: 'volcano',
    2: 'red',
    3: 'purple',
    5: 'cyan',
    6: 'red',
    7: 'purple'
  },
  walletTransactionsType: {
    1: 'Top-up',
    2: 'Withdrawal'
  },
  transactionsRecordType: {
    1: 'Cross-Token Transfer',
    2: 'Exchange',
    3: 'Transfer'
  },
  transactionsRecordStatusColor: {
    5: 'volcano',
    10: 'purple',
    15: 'red',
    20: 'purple',
    30: 'purple',
    35: 'green',
    40: 'red'
  },
  region: {
    1: 'Home',
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
    5: 'Success',
    6: 'Failed'
  },
  enterpriseTransactionStatus: {
    5: 'Pending Approval',
    15: 'Rejected',
    20: 'Processing',
    35: 'Success',
    40: 'Failed'
  },
  enterpriseTransactionStatusColor: {
    5: 'volcano',
    15: 'red',
    20: 'blue',
    35: 'green',
    40: 'red'
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
    5: 'Pending Approval',
    20: 'Processing',
    35: 'Active',
    15: 'Rejected',
    40: 'Failed',
    50: 'Inactive'
  },
  operationStatusColor: {
    5: 'volcano',
    20: 'blue',
    35: 'green',
    15: 'red',
    40: 'red',
    50: 'default'
  },
  walletType: {
    1: 'Master Wallet',
    2: 'Main Wallet',
    3: 'Sub Wallet'
  },
  downloadCenterStatus: {
    0: 'Pending',
    1: 'Processing',
    2: 'Completed',
    3: 'Failed'
  },
  downloadCenterStatusColor: {
    0: 'volcano',
    1: 'blue',
    2: 'green',
    3: 'red'
  },
  moduleType: {
    1: 'Journal Entries',
    5: 'Statements and Reports',
    10: 'Audit Trail',
    15: 'Interest Settlement',
    20: 'Token Statistics Report'
  },
  transactionDirection: {
    1: 'Withdrawal',
    2: 'Top-up'
  },
  statementStatus: {
    20: 'Active',
    30: 'Inactive'
  },
  statementStatusColor: {
    20: 'green',
    30: 'default'
  },
  exportStrategy: {
    1: 'Daily',
    7: 'Weekly',
    30: 'Monthly'
  },
  statementsTxnType: {
    1: 'Top-up',
    2: 'Withdrawal',
    3: 'Transfer',
    4: 'Swap',
    5: 'Exchange'
  },
  proofStatusColor: {
    2: 'volcano',
    3: 'volcano',
    4: 'blue',
    5: 'green',
    6: 'red'
  },
  proofStatus: {
    2: 'Pending',
    3: 'Pending',
    4: 'Processing',
    5: 'Success',
    6: 'Failed'
  },
  enterpriseWalletStatus: {
    1: 'Pending Approval',
    3: 'Processing',
    4: 'Processing',
    5: 'Active',
    2: 'Rejected',
    6: 'Failed',
    8: 'Inactive'
  },
  enterpriseWalletStatusColor: {
    1: 'volcano',
    3: 'blue',
    4: 'blue',
    5: 'green',
    2: 'red',
    6: 'red',
    8: 'default'
  },
  walletTopUpWithdrawInfoType: {
    3: 'Top-up',
    4: 'Withdrawal'
  },
  walletTransferInfoType: {
    1: 'Cross-Token Transfer',
    2: 'Exchange',
    3: 'Transfer'
  },
  enterpriseApprovalSecondStatus: {
    1: 'process',
    3: 'finish',
    4: 'finish',
    5: 'finish',
    2: 'error',
    6: 'finish',
    8: 'finish'
  },

  enterpriseOnboardApprovalSecondStatus: {
    0: 'process',
    1: 'finish',
    2: 'finish',
    3: 'error'
  },
  enterpriseOnboardApprovalThirdStatus: {
    0: 'wait',
    1: 'finish',
    2: 'finish',
    3: 'wait'
  },
  enterpriseApprovalThirdStatus: {
    1: 'wait',
    2: 'wait',
    3: 'process',
    4: 'process',
    5: 'finish',
    6: 'error',
    8: 'finish'
  },
  transferApprovalSecondStatus: {
    5: 'process',
    15: 'error',
    20: 'finish',
    35: 'finish',
    40: 'finish'
  },
  transferApprovalThirdStatus: {
    5: 'wait',
    15: 'wait',
    20: 'process',
    35: 'finish',
    40: 'error'
  },
  transferSourceThirdStatus: {
    5: 'wait',
    15: 'wait',
    20: 'process',
    35: 'finish',
    40: 'finish'
  },
  transferTargetThirdStatus: {
    5: 'wait',
    15: 'wait',
    20: 'wait',
    35: 'finish',
    40: 'error'
  },
  fxType: {
    1: 'Local FX',
    2: 'Network FX'
  },
  fxTransactionStatus: {
    20: 'Processing',
    35: 'Success',
    40: 'Failed'
  },
  fxTransactionStatusColor: {
    20: 'blue',
    35: 'green',
    40: 'red'
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
      if (!value || value.indexOf('null') !== -1) {
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
    if (arg === 'showPartBefore') {
      if (value) {
        if (value?.length > 12) {
          return value.substring(0, 12) + '....';
        } else {
          return value;
        }
      } else {
        return '--';
      }
    }
    if (arg === 'showPartEight') {
      if (value) {
        if (value?.length > 8) {
          return (
            value.substring(0, 4) +
            '....' +
            value.substring(value.length - 4, value.length)
          );
        } else {
          return value;
        }
      } else {
        return '--';
      }
    }
    if (arg === 'showAfterFour') {
      if (value) {
        return '( ****' + value.substring(value.length - 4, value.length) + ')';
      } else {
        return '';
      }
    }
    if (arg === 'showPart') {
      if (value) {
        if (value?.length > 30) {
          return (
            value.substring(0, 6) +
            '....' +
            value.substring(value.length - 4, value.length)
          );
        } else {
          return value;
        }
      } else {
        return '--';
      }
    }
    if (arg === 'failedTime') {
      if (!value) {
        return (value = '--');
      } else {
        value = value.toString();
        value = Number(value) + 200000;
        // return value;
        let res = this.datePipe.transform(value, 'MMMM d, y HH:mm:ss a zzzz');
        return res?.replace('GMT', 'UTC');
      }
    }
    if (arg === 'timeStamp') {
      if (!value || value.length < 10) {
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

    // fiatTime
    if (arg === 'fiatTime') {
      if (value === null || value === '' || value === undefined) {
        return (value = '--');
      } else {
        const number: any = Math.random() * (8000 - 2000) + 2000;
        return (Number(value) + number).toString();
      }
    }

    if (arg === 'monthStamp') {
      if (!value) {
        return (value = '--');
      } else {
        // return timestampToMonth(value);
        value = value.toString();
        if (value.length === 10) {
          value = Number(value) * 1000;
        }
        let res = this.datePipe.transform(value, 'MMMM y');
        return res?.replace('GMT', 'UTC');
      }
    }
    if (arg === 'dayStamp') {
      if (!value || value.length < 10) {
        return (value = '--');
      } else {
        // return timestampToMonth(value);
        value = value.toString();
        if (value.length === 10) {
          value = Number(value) * 1000;
        }
        let res = this.datePipe.transform(value, 'MMMM d, y');
        console.log(res);

        return res?.replace('GMT', 'UTC');
      }
    }
    if (arg === 'currencyPair') {
      if (!value) {
        return (value = '--');
      } else if (value.indexOf('-UDPN') !== 1) {
        return value.replaceAll('-UDPN', '');
      } else {
        return value;
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
