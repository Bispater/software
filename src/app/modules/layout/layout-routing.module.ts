import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from './components/index/index.component';
import { ConnectionStatusModule } from './../connection-status/connection-status.module';
import { PlayListModule } from './../../playlist/play-list.module';
//import { AssigPlaylist} from './../../assign-playlist/assign-playlist.module'



const routes: Routes = [
  // {path: '', redirectTo: 'connection-status' }, //pathMatch:'full'
  // {path: '', redirectTo: 'pdv' }, //pathMatch:'full'
  {path: '', redirectTo: 'dashboard' }, //pathMatch:'full'
  { path: 'connection-status', component: IndexComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./../connection-status/connection-status.module').then((m) => m.ConnectionStatusModule),
      },
    ]
  },
  { path: 'playlists', component: IndexComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./../../playlist/play-list.module').then((m) => m.PlayListModule),
      },
    ]
  },
  // { path: 'assign-playlist', component: IndexComponent,
  //   children: [
  //     {
  //       path: '',
  //       loadChildren: () => import('./../../assig-playlist/assig-playlist.module').then((m) => m.AssigPlaylistModule),
  //     },
  //   ]
  // },
  // { path: 'group', component: IndexComponent,
  //   children: [
  //     {
  //       path: '',
  //       loadChildren: () => import('./../../group/group.module').then((m) => m.GroupModule),
  //     },
  //   ]
  // },
  // { path: 'playlist', component: IndexComponent,
  //   children: [
  //     {
  //       path: '',
  //       loadChildren: () => import('./../../add-playlist/add-playlist.module').then((m) => m.AddPlaylistModule),
  //     },
  //   ]
  // },
  // { path: 'playlist/:id', component: IndexComponent,
  //   children: [
  //     {
  //       path: '',
  //       loadChildren: () => import('./../../add-playlist/add-playlist.module').then((m) => m.AddPlaylistModule),
  //     },
  //   ]
  // },
  { path: 'state', component: IndexComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./../../state/state.module').then((m) => m.StateModule),
      },
    ]
  },
  /*
  { path: 'metrics', component: IndexComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./../../modules/metricsv2/metricsv2.module').then((m) => m.Metricsv2Module),
      },
    ]
  },
  { path: 'metrics', component: IndexComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./../../modules/metricsv2/metricsv2.module').then((m) => m.Metricsv2Module),
      },
    ]
  },*/
  // { path: 'change-price', component: IndexComponent,
  //   children: [
  //     {
  //       path: '',
  //       loadChildren: () => import('./../../change-price/change-price.module').then((m) => m.ChangePriceModule),
  //     },
  //   ]
  // },
  // { path: 'device-config', component: IndexComponent,
  //   children: [
  //     {
  //       path: '',
  //       loadChildren: () => import('./../../device-config/device-config.module').then((m) => m.DeviceConfigModule),
  //     },
  //   ]
  // },
  { path: 'dashboard', component: IndexComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./../../dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
    ]
  },  
  { path: 'pdv', component: IndexComponent,
  children: [
    {
      path: '',
      loadChildren: () => import('./../../pdv/pdv-routing-routing.module').then((m) => m.PdvRoutingRoutingModule),
    },
  ]
  },
  { path: 'metrics', component: IndexComponent,
  children: [
    {
      path: '',
      loadChildren: () => import('./../../metrics/metrics.module').then((m) => m.MetricsModule),
    },
  ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
