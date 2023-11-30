//angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//routing
import { Metricsv2RoutingModule } from './metricsv2-routing.module';
//components
import { IndexComponent } from './components/index/index.component';
import { ChartComponent } from './components/chart/chart.component';
import { TableComponent } from './components/table/table.component';
import { FilterComponent } from './components/filter/filter.component';
import { TemplateTabComponent } from './components/tabs/template-tab/template-tab.component'
import { SharedModule } from './../shared/shared.module';
import { ModalComponent } from './components/modal/modal.component';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { NgxDatatableModule } from '@swimlane/ngx-datatable'
import { FileSaverModule } from 'ngx-filesaver';

@NgModule({
  declarations: [
    IndexComponent, 
    ChartComponent, 
    TableComponent, 
    FilterComponent,
    TemplateTabComponent, 
    ModalComponent,
  ],
  imports: [
    CommonModule,
    Metricsv2RoutingModule,
    NgxDaterangepickerMd.forRoot(),
    NgxDatatableModule,
    SharedModule,
    FileSaverModule
  ]
})

export class Metricsv2Module { }
