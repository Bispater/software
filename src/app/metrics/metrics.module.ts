import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetricsRoutingModule } from './metrics-routing.module';
import { CircleOptionComponent } from './metrics-components/generic-table/circle-option/circle-option.component';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    MetricsRoutingModule,
  ]
})
export class MetricsModule { }
