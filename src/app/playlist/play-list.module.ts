import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { AssigPlaylistComponent } from './../assig-playlist/assig-playlist.component'; 
import { PlayListRoutingModule } from './play-list-routing.module';
import { SharedModule } from '../modules/shared/shared.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PlayListRoutingModule,
    SharedModule
  ]
})
export class PlayListModule { }
