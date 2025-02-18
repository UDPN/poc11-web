import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LiquidityPoolComponent } from './liquidity-pool.component';
import { RegisterComponent } from './rergister/register.component';
import { ActionCode } from '@app/config/actionCode';
import { InfoComponent } from './info/info.component';

const routes: Routes = [
  {
    path: '',
    component: LiquidityPoolComponent,
    data: { title: 'liquidityPool', key: 'liquidity-pool', shouldDetach: 'no' }
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: { title: 'Register', key: 'register',authCode: ActionCode.TabsDetail, shouldDetach: 'no' }
  },
  {
    path: 'info',
    component: InfoComponent,
    data: { title: 'Info', key: 'info', authCode: ActionCode.TabsDetail, shouldDetach: 'no' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LiquidityPoolRoutingModule {}
