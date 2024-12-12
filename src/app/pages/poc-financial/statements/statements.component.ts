/*
 * @Author: chenyuting
 * @Date: 2024-12-10 11:08:21
 * @LastEditors: chenyuting
 * @LastEditTime: 2024-12-10 11:21:02
 * @Description: 
 */

import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { PageHeaderType } from '@app/shared/components/page-header/page-header.component';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { loadRemoteModule } from '@angular-architects/module-federation';
import * as React from 'react';

@Component({
  selector: 'app-statements',
  templateUrl: './statements.component.html',
  styleUrl: './statements.component.less'
})
export class StatementsComponent implements OnInit, AfterViewInit {
  @ViewChild('headerContent', { static: false })
  headerContent!: TemplateRef<NzSafeAny>;
  @ViewChild('headerExtra', { static: false })
  headerExtra!: TemplateRef<NzSafeAny>;
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '',
    breadcrumb: [],
    extra: '',
    desc: '',
    footer: ''
  };

  ngAfterViewInit(): void {
    this.pageHeaderInfo = {
      title: ``,
      breadcrumb: ['Financial Management', 'Statements and Reports'],
      extra: this.headerExtra,
      desc: this.headerContent,
      footer: ''
    };
  }

  async ngOnInit() {
    const remote = await loadRemoteModule({
      remoteEntry: 'http://localhost:3001/remoteEntry.js',
      remoteName: 'remote',
      exposedModule: './App'
    });
    const dashboard = await loadRemoteModule({
        remoteEntry: 'http://localhost:4201/remoteEntry.js',
        remoteName: 'dashboard',
        exposedModule: './Module'
      });

    console.log(remote.default);
    console.log(dashboard.default);
 
    const ReactComponent = dashboard.default;
    // const ReactComponent1 = remote.default;
    // 使用 React DOM 渲染组件
    import('react-dom/client').then(ReactDOM => {
      const root = ReactDOM.default.createRoot(document.getElementById('react-root')!);
      root.render(React.createElement(ReactComponent));
    });
  }
}
