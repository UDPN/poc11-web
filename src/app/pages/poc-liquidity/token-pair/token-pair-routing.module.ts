import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TokenPairComponent } from './token-pair.component';
import { AddTokenComponent } from './add/add-token.component';
import { ActionCode } from '@app/config/actionCode';
import { AddNetComponent } from './add-net/add-net.component';
import { InfoTokenComponent } from './info-token/info-token.component';

const routes: Routes = [
  {
    path: '',
    component: TokenPairComponent,
    data: { title: 'tokenPair', key: 'token-pair', shouldDetach: 'no' }
  },
  {
    path: 'add',
    component: AddTokenComponent,
    data: { title: 'addToken', key: 'add-token',authCode: ActionCode.TabsDetail, shouldDetach: 'no' }
  },
  {
    path: 'addNet',
    component: AddNetComponent,
    data: { title: 'addNet', key: 'add-net',authCode: ActionCode.TabsDetail, shouldDetach: 'no' }
  },
  {
    path: 'infoToken',
    component: InfoTokenComponent,
    data: { title: 'infoToken', key: 'info-token',authCode: ActionCode.TabsDetail, shouldDetach: 'no' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TokenPairRoutingModule {}
