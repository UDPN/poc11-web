import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { PocHomeRoutingModule } from './poc-home-routing.module';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [HomeComponent],
  imports: [SharedModule, PocHomeRoutingModule],
})
export class PocHomeModule {}
