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
    menuType: 'C',
    code: 'R0',
    menuGroup: true,
    groupName: 'As a Commercial Bank',
    groupCollapseName: 'Commercial'
  },
  {
    menuName: 'Wallet Management',
    id: 2,
    fatherId: 0,
    icon: 'pay-circle',
    open: false,
    selected: false,
    menuType: 'C',
    path: '/poc/poc-capital-pool/capital-pool',
    code: 'R0'
  },
  {
    menuName: 'CBDC Management',
    id: 3,
    fatherId: 0,
    icon: 'team',
    open: false,
    selected: false,
    menuType: 'C',
    path: '/poc/poc-profile/foreign-exchange-apply',
    code: 'R0',
    children: [
      {
        id: 1,
        fatherId: 3,
        menuName: 'CBDC Wallet Management',
        open: false,
        selected: false,
        menuType: 'C',
        code: 'R0101',
        path: '/poc/poc-profile/information-modify'
      },
      {
        id: 2,
        fatherId: 3,
        menuName: 'Cross-Border Remittance',
        open: false,
        selected: false,
        menuType: 'C',
        code: 'R0102',
        path: '/poc/poc-profile/foreign-exchange-apply'
      },
      {
        id: 2,
        fatherId: 3,
        menuName: 'CBDC Transactions',
        open: false,
        selected: false,
        menuType: 'C',
        code: 'R0102',
        path: '/poc/poc-profile/foreign-exchange-apply'
      }
    ]
  },
  {
    fatherId: 0,
    menuType: 'C',
    code: 'R0',
    menuGroup: true,
    groupName: 'As a Service Provider',
    groupCollapseName: 'Commercial'
  },
  {
    menuName: 'Activate Settlement Business',
    id: 4,
    fatherId: 0,
    icon: 'check-square',
    open: false,
    selected: false,
    menuType: 'C',
    path: '/poc/poc-settlement',
    code: 'R0',
  },
  {
    menuName: 'Capital Pool Management',
    id: 5,
    fatherId: 0,
    icon: 'line-chart',
    open: false,
    selected: false,
    menuType: 'C',
    path: '/poc/poc-fx-transactions/fx-transactions',
    code: 'R0',
  },
  {
    menuName: 'Foreign Exchange Management',
    id: 6,
    fatherId: 0,
    icon: 'transaction',
    open: false,
    selected: false,
    menuType: 'C',
    path: '/poc/poc-fx-rate-history/fx-rate-history',
    code: 'R0',
  },
  {
    menuName: 'Settlement Management',
    id: 7,
    fatherId: 0,
    icon: 'user',
    open: false,
    selected: false,
    menuType: 'C',
    path: '/poc/poc-system',
    code: 'R0',
    children: [
      {
        id: 1,
        fatherId: 7,
        menuName: 'Settlement Model Management',
        open: false,
        selected: false,
        menuType: 'C',
        code: 'R0',
        path: '/poc/poc-system/user'
      },
      {
        id: 2,
        fatherId: 7,
        menuName: 'Billing',
        open: false,
        selected: false,
        menuType: 'C',
        code: 'R0',
        path: '/poc/poc-system/role'
      }
    ]
  },
  {
    menuName: 'FX Transactions',
    id: 6,
    fatherId: 0,
    icon: 'transaction',
    open: false,
    selected: false,
    menuType: 'C',
    path: '/poc/poc-fx-rate-history/fx-rate-history',
    code: 'R0',
  },
  {
    menuName: 'Historical FX Rate Query',
    id: 6,
    fatherId: 0,
    icon: 'transaction',
    open: false,
    selected: false,
    menuType: 'C',
    path: '/poc/poc-fx-rate-history/fx-rate-history',
    code: 'R0',
  },
  {
    // menuName: 'System Management',
    id: 7,
    fatherId: 0,
    icon: 'user',
    open: false,
    selected: false,
    menuType: 'C',
    path: '/poc/poc-system',
    code: 'R0',
    menuGroup: true,
    groupName: 'System Management',
    groupCollapseName: 'System',
    children: [
      {
        id: 1,
        fatherId: 7,
        menuName: 'User Management',
        open: false,
        selected: false,
        menuType: 'C',
        code: 'R0',
        path: '/poc/poc-system/users'
      },
      {
        id: 2,
        fatherId: 7,
        menuName: 'Role Management',
        open: false,
        selected: false,
        menuType: 'C',
        code: 'R0',
        path: '/poc/poc-system/roles'
      },
      {
        id: 3,
        fatherId: 7,
        menuName: 'SP Information Modification',
        open: false,
        selected: false,
        menuType: 'C',
        code: 'R0',
        path: '/poc/poc-system/information-modifys'
      },
    ]
  },
];
