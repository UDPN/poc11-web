import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { LiquidityPoolRoutingModule } from './liquidity-pool-routing.module';
import { LiquidityPoolComponent } from './liquidity-pool.component';
import { RegisterComponent } from './rergister/register.component';
import { AuthorizationComponent } from './info-authorization/authorization.component';
import { BasicComponent } from './info-basic/basic.component';
import { OperationComponent } from './info-operation/operation.component';
import { TransactionsComponent } from './info-transactions/transactions.component';
import { InfoComponent } from './info/info.component';
@NgModule({
  declarations: [
    LiquidityPoolComponent,
    RegisterComponent,
    AuthorizationComponent,
    BasicComponent,
    OperationComponent,
    TransactionsComponent,
    InfoComponent,
    
  ],
  imports: [CommonModule, SharedModule, LiquidityPoolRoutingModule]
})
export class LiquidityPoolModule {}
