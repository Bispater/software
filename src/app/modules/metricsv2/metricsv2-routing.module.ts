import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from './components/index/index.component';
//import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';

const routes: Routes = [
  { path: '', component: IndexComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class Metricsv2RoutingModule { }
