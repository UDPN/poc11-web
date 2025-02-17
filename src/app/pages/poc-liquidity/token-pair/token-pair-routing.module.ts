import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TokenPairComponent } from './token-pair.component';

const routes: Routes = [
  {
    path: '',
    component: TokenPairComponent,
    data: { title: 'tokenPair', key: 'token-pair', shouldDetach: 'no' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TokenPairRoutingModule {}
