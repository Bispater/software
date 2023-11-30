import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MetricsRoutingModule } from './metrics-routing.module';
import { IndexComponent } from './components/index/index.component';
import { ChartComponent } from './components/chart/chart.component';
import { TableComponent } from './components/table/table.component';
import { FilterComponent } from './components/filter/filter.component';
import { EquipmentsTouchedComponent } from './components/tabs/equipments-touched/equipments-touched.component';
import { StoresInteractionsComponent } from './components/tabs/stores-interactions/stores-interactions.component';
import { UniqueUsersComponent } from './components/tabs/unique-users/unique-users.component';
import { SharedModule } from './../shared/shared.module';
import { ModalComponent } from './components/modal/modal.component';
import { StatisticsSubsidiaryComponent } from './components/tabs/statistics-subsidiary/statistics-subsidiary.component';
import { StatisticsDeviceComponent } from './components/tabs/statistics-device/statistics-device.component'


@NgModule({
  declarations: [
    IndexComponent, 
    ChartComponent, 
    TableComponent, 
    FilterComponent, 
    EquipmentsTouchedComponent, 
    StoresInteractionsComponent, 
    UniqueUsersComponent, ModalComponent, StatisticsSubsidiaryComponent, StatisticsDeviceComponent
  ],
  imports: [
    CommonModule,
    MetricsRoutingModule,
    SharedModule
  ]
})
export class MetricsModule { }
