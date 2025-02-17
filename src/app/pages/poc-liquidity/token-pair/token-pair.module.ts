import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { TokenPairRoutingModule } from './token-pair-routing.module';
import { TokenPairComponent } from './token-pair.component';

@NgModule({
  declarations: [TokenPairComponent],
  imports: [CommonModule, SharedModule, TokenPairRoutingModule]
})
export class TokenPairModule {}
