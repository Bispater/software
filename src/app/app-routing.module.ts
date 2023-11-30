import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// import resources component Login
import { LoginComponent } from './login/login.component';
// import resources component Home
// import resources component Assign  Playlist
// import { AssigPlaylistComponent } from './assig-playlist/assig-playlist.component'; 
// import resources component Change Price
// import { ChangePriceComponent } from './change-price/change-price.component';
// import resources component Group
// import { GroupComponent } from './group/group.component';
// import resources component List Playlist
import { PlaylistComponent } from './playlist/playlist.component';
// import resources component Add Playlist
// import { AddPlaylistComponent } from './add-playlist/add-playlist.component';
// import resources component Templates
import { TemplatesComponent } from './templates/templates.component';
// import { CustomComponent } from './custom/custom.component';
import { StateComponent } from './state/state.component';

import { environment } from 'src/environments/environment'
import { LayoutModule } from './modules/layout/layout.module';

// import { DeviceConfigComponent } from './device-config/device-config.component';


const routes: Routes = [
  {
    path: environment.version,
    loadChildren: () => import('./modules/layout/layout.module').then((m) => m.LayoutModule)
  },
  { path: '', component: LoginComponent },
  // { path: 'custom', component: CustomComponent },
  // { path: 'custom/:id', component: CustomComponent },
  //{path: 'playlists', component: PlaylistComponent},
  // {path: 'add-playlist', component: AddPlaylistComponent},
  // {path: 'add-playlist/:id', component: AddPlaylistComponent},
  // {path: 'assig-playlist', component: AssigPlaylistComponent},
  // {path: 'change-price', component: ChangePriceComponent},
  {path: 'templates', component: TemplatesComponent},
  // {path: 'group', component: GroupComponent},
  {path: 'state', component: StateComponent},
  // {path: 'device-config', component: DeviceConfigComponent},
  {path: '**', component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    onSameUrlNavigation: "ignore",
    anchorScrolling: 'enabled',
    scrollPositionRestoration: 'enabled',
    relativeLinkResolution: 'legacy'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
