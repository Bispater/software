import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ConnectionStatusRoutingModule } from './connection-status-routing.module';
import { IndexComponent } from './components/index/index.component';
import { SharedModule } from './../shared/shared.module';



@NgModule({
  declarations: [IndexComponent],
  imports: [
    CommonModule,
    ConnectionStatusRoutingModule,
    NgxChartsModule,
    SharedModule
  ],
  exports: [
    NgxChartsModule
  ]
})

export class ConnectionStatusModule { }
