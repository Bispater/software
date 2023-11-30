import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing.module';
import { IndexComponent } from './components/index/index.component';

import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
  declarations: [IndexComponent],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule
  ]
})
export class LayoutModule { }
