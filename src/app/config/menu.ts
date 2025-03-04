import { InjectionToken } from '@angular/core';

import { ActionCode } from '@config/actionCode';
import { Menu } from '@core/services/types';

export const MENU_TOKEN = new InjectionToken<Menu[]>('menu-token', {
  providedIn: 'root',
  factory(): Menu[] {
    return menuNav;
  }
});

const menuNav: Menu[] = [
  {
    menuName: 'Dashboard',
    id: 1,
    fatherId: 0,
    icon: 'home',
    open: false,
    selected: false,
    menuType: 'C',
    path: '/poc/poc-home/home',
    code: 'R0'
  },
  {
    menuName: 'Notifications',
    id: 2,
    fatherId: 0,
    icon: 'notification',
    open: false,
    selected: false,
    menuType: 'C',
    path: '/poc/poc-notifications/notifications',
    code: 'R0105'
  },
  // {
  //   fatherId: 0,
  //   id: 2,
  //   menuType: 'C',
  //   code: 'R01',
  //   menuGroup: true,
  //   groupName: 'As a Commercial Bank',
  //   groupCollapseName: 'Commercial'
  // },
  {
    menuName: 'Fiat Account Management',
    id: 3,
    fatherId: 0,
    icon: 'down-square',
    open: false,
    selected: false,
    menuType: 'C',
    path: '/poc/poc-bank-account/bank-account',
    code: 'R0106'
  },
  {
    menuName: 'Wallet Management',
    id: 4,
    fatherId: 0,
    icon: 'pay-circle',
    open: false,
    selected: false,
    menuType: 'C',
    path: '/poc/poc-wallet',
    code: 'R0101',
    children: [
      {
        id: 1,
        fatherId: 4,
        menuName: 'Wallet Creation',
        open: false,
        selected: false,
        menuType: 'C',
        code: 'R010101',
        path: '/poc/poc-wallet/cbdc-wallet'
      },
      {
        id: 2,
        fatherId: 4,
        menuName: 'Mint & Melt Transactions',
        open: false,
        selected: false,
        menuType: 'C',
        code: 'R010102',
        path: '/poc/poc-wallet/cbdc-transaction'
      }
    ]
  },
  {
    menuName: 'Remittance Management',
    id: 5,
    fatherId: 0,
    icon: 'team',
    open: false,
    selected: false,
    menuType: 'C',
    path: '/poc/poc-remittance',
    code: 'R0102',
    children: [
      {
        id: 1,
        fatherId: 5,
        menuName: 'Transfer',
        open: false,
        selected: false,
        menuType: 'C',
        code: 'R010201',
        path: '/poc/poc-remittance/transfer'
      },
      {
        id: 2,
        fatherId: 5,
        menuName: 'FX Purchasing',
        open: false,
        selected: false,
        menuType: 'C',
        code: 'R010202',
        path: '/poc/poc-remittance/fx-purchasing'
      },
      {
        id: 3,
        fatherId: 5,
        menuName: 'Transaction Records',
        open: false,
        selected: false,
        menuType: 'C',
        code: 'R010203',
        path: '/poc/poc-remittance/transaction-record'
      }
    ]
  },
  {
    menuName: 'Enterprise Management',
    id: 6,
    fatherId: 0,
    icon: 'appstore',
    open: false,
    selected: false,
    menuType: 'C',
    code: 'R0103',
    path: '/poc/poc-enterprise',
    children: [
      {
        id: 1,
        fatherId: 6,
        menuName: 'Enterprise Onboarding',
        open: false,
        selected: false,
        menuType: 'C',
        code: 'R010201',
        path: '/poc/poc-enterprise/enterprise-onboarding'
      },
      {
        id: 2,
        fatherId: 6,
        menuName: 'Enterprise Wallet Management',
        open: false,
        selected: false,
        menuType: 'C',
        code: 'R010202',
        path: '/poc/poc-enterprise/wallet'
      },
      {
        id: 3,
        fatherId: 6,
        menuName: 'Transaction Approval',
        open: false,
        selected: false,
        menuType: 'C',
        code: 'R010203',
        path: '/poc/poc-enterprise/transaction-approval'
      },
      {
        id: 4,
        fatherId: 6,
        menuName: 'Transactions',
        open: false,
        selected: false,
        menuType: 'C',
        code: 'R010203',
        path: '/poc/poc-enterprise/transactions'
      }
    ]
  },
  {
    menuName: 'Liquidity Management',
    id: 7,
    fatherId: 0,
    icon: 'user',
    open: false,
    selected: false,
    menuType: 'C',
    code: 'R0103',
    path: '/poc/poc-liquidity',
    children: [
      {
        id: 1,
        fatherId: 7,
        menuName: 'Liquidity Pool Management',
        open: false,
        selected: false,
        menuType: 'C',
        code: 'R010201',
        path: '/poc/poc-liquidity/liquidity-pool'
      },
      {
        id: 2,
        fatherId: 7,
        menuName: 'Token Pair Management',
        open: false,
        selected: false,
        menuType: 'C',
        code: 'R010202',
        path: '/poc/poc-liquidity/token-pair'
      },
      {
        id: 3,
        fatherId: 7,
        menuName: 'FX Transactions',
        open: false,
        selected: false,
        menuType: 'C',
        code: 'R010203',
        path: '/poc/poc-liquidity/fx-transactions'
      }
    ]
  },
  {
    menuName: 'Bank Query',
    id: 9,
    fatherId: 0,
    icon: 'fund',
    open: false,
    selected: false,
    menuType: 'C',
    path: '/poc/poc-bank/bank',
    code: 'R0104'
  },
  {
    menuName: 'Financial Management',
    id: 10,
    fatherId: 0,
    icon: 'solution',
    open: false,
    selected: false,
    menuType: 'C',
    path: '/poc/poc-financial',
    code: 'R0107',
    children: [
      {
        id: 1,
        fatherId: 10,
        menuName: 'Journal Entries',
        open: false,
        selected: false,
        menuType: 'C',
        code: 'R010701',
        path: '/poc/poc-financial/journal-entries'
      },
      {
        id: 2,
        fatherId: 10,
        menuName: 'Statements and Reports',
        open: false,
        selected: false,
        menuType: 'C',
        code: 'R010702',
        path: '/poc/poc-financial/statements'
      }
    ]
  },
  {
    menuName: 'Download Center',
    id: 11,
    fatherId: 0,
    icon: 'download',
    open: false,
    selected: false,
    menuType: 'C',
    path: '/poc/poc-download-center/download-center',
    code: 'R0108'
  },
  {
    menuName: 'Capital Pool Management',
    id: 14,
    fatherId: 0,
    icon: 'line-chart',
    open: false,
    selected: false,
    menuType: 'C',
    path: '/poc/poc-capital-pool/capital-pool',
    code: 'R0202'
  },
  {
    menuName: 'FX Pair Management',
    id: 15,
    fatherId: 0,
    icon: 'transaction',
    open: false,
    selected: false,
    menuType: 'C',
    path: '/poc/poc-profile/foreign-exchange-apply',
    code: 'R0203'
  },
  {
    menuName: 'Settlement Management',
    id: 16,
    fatherId: 0,
    icon: 'pic-left',
    open: false,
    selected: false,
    menuType: 'C',
    path: '/poc/poc-settlement',
    code: 'R0204',
    children: [
      {
        id: 1,
        fatherId: 16,
        menuName: 'Settlement Model Management',
        open: false,
        selected: false,
        menuType: 'C',
        code: 'R020401',
        path: '/poc/poc-settlement/settlement'
      },
      {
        id: 2,
        fatherId: 16,
        menuName: 'Monthly Income Statement',
        open: false,
        selected: false,
        menuType: 'C',
        code: 'R020402',
        path: '/poc/poc-settlement/billing'
      }
    ]
  },
  {
    menuName: 'FX Transactions',
    id: 17,
    fatherId: 0,
    icon: 'schedule',
    open: false,
    selected: false,
    menuType: 'C',
    path: '/poc/poc-fx-transactions/fx-transactions',
    code: 'R0205'
  },
  {
    menuName: 'Historical FX Rate Query',
    id: 18,
    fatherId: 0,
    icon: 'align-left',
    open: false,
    selected: false,
    menuType: 'C',
    path: '/poc/poc-fx-rate-history/fx-rate-history',
    code: 'R0206'
  },
  {
    menuName: 'System Management',
    id: 19,
    fatherId: 0,
    icon: 'usergroup-add',
    open: false,
    selected: false,
    menuType: 'C',
    path: '/poc/poc-system',
    code: 'R03',
    children: [
      {
        id: 1,
        fatherId: 19,
        menuName: 'User Management',
        open: false,
        selected: false,
        menuType: 'C',
        code: 'R0301',
        path: '/poc/poc-system/user'
      },
      {
        id: 2,
        fatherId: 19,
        menuName: 'Role Management',
        open: false,
        selected: false,
        menuType: 'C',
        code: 'R0302',
        path: '/poc/poc-system/role'
      },
      {
        id: 3,
        fatherId: 19,
        menuName: 'Bank Information',
        open: false,
        selected: false,
        menuType: 'C',
        code: 'R0303',
        path: '/poc/poc-system/information-modify'
      },
      {
        id: 4,
        fatherId: 19,
        menuName: 'API Documentation',
        open: false,
        selected: false,
        menuType: 'C',
        code: 'R0305',
        newLinkFlag: 1,
        path: '../../../../assets/api-documentation/Commercial Bank OpenAPI Documentation for Enterprise Users v1.1.0.pdf'
      },
      {
        id: 5,
        fatherId: 19,
        menuName: 'User Manual',
        open: false,
        selected: false,
        menuType: 'C',
        code: 'R0306',
        newLinkFlag: 1,
        path: '../../../../assets/user-manual/Project Kissen User Manual for Commercial Bank Control Panel_V1.1.0.pdf'
      },
      {
        id: 6,
        fatherId: 19,
        menuName: 'UI Configuration',
        open: false,
        selected: false,
        menuType: 'C',
        code: 'R0304',
        path: '/poc/poc-system/system-style'
      }
    ]
  }
  // {
  //   menuName: 'Access Key',
  //   id: 5,
  //   fatherId: 0,
  //   icon: 'key',
  //   open: false,
  //   selected: false,
  //   menuType: 'C',
  //   path: '/poc/poc-access-key/access-key',
  //   code: 'R0304'
  // }
];
