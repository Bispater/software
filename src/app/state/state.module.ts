import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StateRoutingModule } from './state-routing.module';

import { SharedModule } from '../modules/shared/shared.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StateRoutingModule,
    SharedModule
  ]
})
export class StateModule { }
