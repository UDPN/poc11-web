import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { TokenPairRoutingModule } from './token-pair-routing.module';
import { TokenPairComponent } from './token-pair.component';
import { AddTokenComponent } from './add/add-token.component';
import { AddNetComponent } from './add-net/add-net.component';
import { InfoTokenComponent } from './info-token/info-token.component';
import { InfoBasicComponent } from './info-basic/info-basic.component';
import { InfoOperationComponent } from './info-operation/info-operation.component';
import { OperateModalComponent } from './operate-modal/operate-modal.component';

@NgModule({
  declarations: [
    TokenPairComponent,
    AddTokenComponent,
    AddNetComponent,
    InfoTokenComponent,
    InfoBasicComponent,
    InfoOperationComponent,
    OperateModalComponent
  ],
  imports: [CommonModule, SharedModule, TokenPairRoutingModule]
})
export class TokenPairModule {}
