import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreatePlaylistRoutingModule } from './create-playlist-routing.module';
import { IndexComponent } from './components/index/index.component';


@NgModule({
  declarations: [IndexComponent],
  imports: [
    CommonModule,
    CreatePlaylistRoutingModule
  ]
})
export class CreatePlaylistModule { }
