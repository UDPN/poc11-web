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
    code: 'R0',
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
        menuName: 'CBDC Wallet Management',
        open: false,
        selected: false,
        menuType: 'C',
        code: 'R010101',
        path: '/poc/poc-wallet/cbdc-wallet'
      },
      {
        id: 2,
        fatherId: 3,
        menuName: 'CBDC Transactions',
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
        menuName: 'Transaction Record',
        open: false,
        selected: false,
        menuType: 'C',
        code: 'R010203',
        path: '/poc/poc-remittance/transaction-record'
      }
    ]
  },
  {
    fatherId: 0,
    id: 5,
    menuType: 'C',
    code: 'R02',
    menuGroup: true,
    groupName: 'As a Service Provider',
    groupCollapseName: 'Commercial'
  },
  {
    menuName: 'Become A FX Service Provider',
    id: 6,
    fatherId: 0,
    icon: 'check-square',
    open: false,
    selected: false,
    menuType: 'C',
    path: '/poc/poc-activate-settlement/activate-settlement',
    code: 'R0201',
  },
  {
    menuName: 'Capital Pool Management',
    id: 7,
    fatherId: 0,
    icon: 'line-chart',
    open: false,
    selected: false,
    menuType: 'C',
    path: '/poc/poc-capital-pool/capital-pool',
    code: 'R0202',
  },
  {
    menuName: 'Foreign Exchange Management',
    id: 8,
    fatherId: 0,
    icon: 'transaction',
    open: false,
    selected: false,
    menuType: 'C',
    path: '/poc/poc-profile/foreign-exchange-apply',
    code: 'R0203',
  },
  {
    menuName: 'Settlement Management',
    id: 9,
    fatherId: 0,
    icon: 'user',
    open: false,
    selected: false,
    menuType: 'C',
    path: '/poc/poc-settlement',
    code: 'R0204',
    children: [
      {
        id: 1,
        fatherId: 9,
        menuName: 'Settlement Model Management',
        open: false,
        selected: false,
        menuType: 'C',
        code: 'R020401',
        path: '/poc/poc-settlement/settlement'
      },
      {
        id: 2,
        fatherId: 9,
        menuName: 'Billing',
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
    id: 10,
    fatherId: 0,
    icon: 'transaction',
    open: false,
    selected: false,
    menuType: 'C',
    path: '/poc/poc-fx-transactions/fx-transactions',
    code: 'R0205',
  },
  {
    menuName: 'Historical FX Rate Query',
    id: 11,
    fatherId: 0,
    icon: 'transaction',
    open: false,
    selected: false,
    menuType: 'C',
    path: '/poc/poc-fx-rate-history/fx-rate-history',
    code: 'R0206',
  },
  {
    id: 12,
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
        fatherId: 12,
        menuName: 'User Management',
        open: false,
        selected: false,
        menuType: 'C',
        code: 'R0301',
        path: '/poc/poc-system/user'
      },
      {
        id: 2,
        fatherId: 12,
        menuName: 'Role Management',
        open: false,
        selected: false,
        menuType: 'C',
        code: 'R0302',
        path: '/poc/poc-system/role'
      },
      {
        id: 3,
        fatherId: 12,
        menuName: 'Bank Information Modification',
        open: false,
        selected: false,
        menuType: 'C',
        code: 'R0303',
        path: '/poc/poc-system/information-modify'
      },
      {
        id: 4,
        fatherId: 12,
        menuName: 'Style Configuration',
        open: false,
        selected: false,
        menuType: 'C',
        code: 'R0304',
        path: '/poc/poc-system/system-style'
      },
    ]
  },
];
