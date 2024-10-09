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
    fatherId: 0,
    id: 2,
    menuType: 'C',
    code: 'R01',
    menuGroup: true,
    groupName: 'As a Commercial Bank',
    groupCollapseName: 'Commercial'
  },
  {
    menuName: 'Wallet Management',
    id: 3,
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
        fatherId: 3,
        menuName: 'Wallet Management ',
        open: false,
        selected: false,
        menuType: 'C',
        code: 'R010101',
        path: '/poc/poc-wallet/cbdc-wallet'
      },
      {
        id: 2,
        fatherId: 3,
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
    id: 4,
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
        fatherId: 4,
        menuName: 'Transfer',
        open: false,
        selected: false,
        menuType: 'C',
        code: 'R010201',
        path: '/poc/poc-remittance/transfer'
      },
      {
        id: 2,
        fatherId: 4,
        menuName: 'FX Purchasing',
        open: false,
        selected: false,
        menuType: 'C',
        code: 'R010202',
        path: '/poc/poc-remittance/fx-purchasing'
      },
      {
        id: 3,
        fatherId: 4,
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
    menuName: 'FX Rate Query',
    id: 5,
    fatherId: 0,
    icon: 'stock',
    open: false,
    selected: false,
    menuType: 'C',
    path: '/poc/poc-fx-rate/fx-rate',
    code: 'R0103'
  },
  {
    menuName: 'Bank Query',
    id: 6,
    fatherId: 0,
    icon: 'fund',
    open: false,
    selected: false,
    menuType: 'C',
    path: '/poc/poc-bank/bank',
    code: 'R0104'
  },

  {
    fatherId: 0,
    id: 7,
    menuType: 'C',
    code: 'R02',
    menuGroup: true,
    groupName: 'As an FX Service Provider',
    groupCollapseName: 'Commercial'
  },
  {
    menuName: 'Become A FX Service Provider',
    id: 8,
    fatherId: 0,
    icon: 'check-square',
    open: false,
    selected: false,
    menuType: 'C',
    path: '/poc/poc-activate-settlement/activate-settlement',
    code: 'R0201'
  },
  {
    menuName: 'Capital Pool Management',
    id: 9,
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
    id: 10,
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
    id: 11,
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
        fatherId: 11,
        menuName: 'Settlement Model Management',
        open: false,
        selected: false,
        menuType: 'C',
        code: 'R020401',
        path: '/poc/poc-settlement/settlement'
      },
      {
        id: 2,
        fatherId: 11,
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
    id: 12,
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
    id: 13,
    fatherId: 0,
    icon: 'align-left',
    open: false,
    selected: false,
    menuType: 'C',
    path: '/poc/poc-fx-rate-history/fx-rate-history',
    code: 'R0206'
  },
  {
    id: 14,
    fatherId: 0,
    icon: 'user',
    open: false,
    selected: false,
    menuType: 'C',
    menuGroup: true,
    groupName: 'System Management',
    groupCollapseName: 'System',
    path: '/poc/poc-system',
    code: 'R03',
    children: [
      {
        id: 1,
        fatherId: 14,
        menuName: 'User Management',
        open: false,
        selected: false,
        menuType: 'C',
        code: 'R0301',
        path: '/poc/poc-system/user'
      },
      {
        id: 2,
        fatherId: 14,
        menuName: 'Role Management',
        open: false,
        selected: false,
        menuType: 'C',
        code: 'R0302',
        path: '/poc/poc-system/role'
      },
      {
        id: 3,
        fatherId: 14,
        menuName: 'Bank Information',
        open: false,
        selected: false,
        menuType: 'C',
        code: 'R0303',
        path: '/poc/poc-system/information-modify'
      },
      {
        id: 4,
        fatherId: 14,
        menuName: 'API Documentation',
        open: false,
        selected: false,
        menuType: 'C',
        code: 'R0305',
        newLinkFlag: 1,
        path: '../../../../assets/api-documentation/Project Kissen APIs.pdf'
      },
      {
        id: 5,
        fatherId: 14,
        menuName: 'UI Configuration',
        open: false,
        selected: false,
        menuType: 'C',
        code: 'R0304',
        path: '/poc/poc-system/system-style'
      }
    ]
  }
];
