import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssignPlaylistRoutingModule } from './assign-playlist-routing.module';
import { IndexComponent } from './components/index/index.component';


@NgModule({
  declarations: [IndexComponent],
  imports: [
    CommonModule,
    AssignPlaylistRoutingModule
  ]
})
export class AssignPlaylistModule { }
