import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';


@Component({
  selector: 'app-table-expand',
  templateUrl: './table-expand.component.html',
  styleUrls: ['./table-expand.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class TableExpandComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  dataSource = ELEMENT_DATA;
  columnsToDisplay = ['action', 'name', 'incidence', 'area', 'state', "Foto"];
  expandedElement: PeriodicElement | null;
  
}

export interface PeriodicElement {
  position: number;
  name: string;
  incidence: string;
  area: string;
  state: any;
}


const ELEMENT_DATA: PeriodicElement[] = [
  {position: 25, name: 'Chacabuco', incidence: "Exhibe promo de Apple", area: "Mesa 1", state: "Pendiente"},
  {position: 28, name: 'Puerto Montt', incidence: "Posiciones Vacías", area: "Mesa 2", state: 'Pendiente'},
  {position: 37, name: 'Costanera Center', incidence: "Exhibe promo de Apple", area: "Mesa 1", state: 'Corregido'},
  {position: 43, name: 'Torre Entel', incidence: "Exhibe promo de Apple", area: "Mesa 1", state: 'Verificado'},
  {position: 25, name: 'Chacabuco', incidence: "Exhibe promo de Apple", area: "Mesa 1",  state: 'Pendiente'},
  {position: 18, name: 'Maipú',  incidence: "No cumple orden completo", area: "Mesa 2",  state: 'Corregido'},
  {position: 67, name: 'Chillén Exprés', incidence: "Exhibe promo de Apple", area: "Mesa 2",  state: 'Pendiente'},
  {position: 122, name: 'Plaza Egaña',  incidence: "Exhibe promo de Apple", area: "Mesa 2",  state: 'Pendiente'},
  {position: 25, name: 'Torre Entel',  incidence: "Exhibe promo de Apple", area: "Mesa 1",  state: 'Verificado'},
  {position: 25, name: 'Chacabuco',  incidence: "Exhibe promo de Apple", area: "Mesa 1",  state: 'Verificado'},
  {position: 25, name: 'Maipú',  incidence: "Exhibe promo de Apple", area: "Mesa 1",  state: 'Verificado'},
  {position: 25, name: 'Chacabuco',  incidence: "Posiciones Vacías", area: "Mesa 2",  state: 'Pendiente'},
  {position: 25, name: 'Costanera Center',  incidence: "Exhibe promo de Apple", area: "Mesa 1",  state: 'Verificado'},
];

/**  Copyright 2019 Google Inc. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */