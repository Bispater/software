import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { NotificationPopupComponent } from '../notification-popup/notification-popup.component';

export interface data {
  [key: string]: any;
}

// LIST OF INCIDENCES 
export interface PeriodicElement {
  position: number;
  name: string;
  incidence: string;
  area: string;
  state: any;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 25, name: 'Chacabuco', incidence: "Exhibe promo de Apple", area: "Mesa 1", state: "Pendiente" },
  { position: 28, name: 'Puerto Montt', incidence: "Posiciones Vacías", area: "Mesa 2", state: 'Pendiente' },
  { position: 37, name: 'Costanera Center', incidence: "Exhibe promo de Apple", area: "Mesa 1", state: 'Corregido' },
  { position: 43, name: 'Torre Entel', incidence: "Exhibe promo de Apple", area: "Mesa 1", state: 'Verificado' },
  { position: 25, name: 'Chacabuco', incidence: "Exhibe promo de Apple", area: "Mesa 1", state: 'Pendiente' },
  { position: 18, name: 'Maipú', incidence: "No cumple orden completo de menor a mayor.", area: "Mesa 1", state: 'Corregido' },
  { position: 67, name: 'Chillén Exprés', incidence: "Exhibe promo de Apple", area: "Mesa 1", state: 'Pendiente' },
  { position: 122, name: 'Plaza Egaña', incidence: "Exhibe promo de Apple", area: "Mesa 1", state: 'Pendiente' },
  { position: 25, name: 'Chacabuco', incidence: "Exhibe promo de Apple", area: "Mesa 1", state: 'Verificado' },
];

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  //FIRST CHART 
  chartOptions = {
    theme: "light2",
    animationEnabled: true,
    exportEnabled: true,
    axisY: {
      includeZero: true,
      valueFormatString: "#,##0"
    },
    data: [{
      type: "column", //change type to bar, line, area, pie, etc
      yValueFormatString: "#,##0",
      // color: "#01b8aa",
      color: "#005cff",
      dataPoints: [
        { label: "Ene", y: 272 },
        { label: "Feb", y: 389 },
        { label: "Mar", y: 301 },
        { label: "Abr", y: 340 },
        { label: "May", y: 266 },
        { label: "Jun", y: 396 },
        { label: "Jul", y: 358 },
        { label: "Ago", y: 267 },
        { label: "Sep", y: 375 },
        { label: "Oct", y: 352 },
        { label: "Nov", y: 156 },
        { label: "Dic", y: 264 }
      ]
    }]
  }

  splineChart = {
    theme: "light2",
    animationEnabled: true,
    exportEnabled: true,
    axisY: {
      includeZero: true,
      valueFormatString: "#,##0"
    },
    data: [{
      type: "spline", //change type to bar, line, area, pie, etc
      yValueFormatString: "#,##0",
      // color: "#01b8aa",
      color: "#005cff",
      dataPoints: [
        { label: "Lun", y: 142 },
        { label: "Mar", y: 359 },
        { label: "Mie", y: 196 },
        { label: "Jue", y: 158 },
        { label: "Vie", y: 127 },
        { label: "Sáb", y: 82 },
        { label: "Dom", y: 46 },
      ]
    }]
  }

  visitorsChartDrilldownHandler = (e: any) => {
    this.chart.options = this.visitorsDrilldownedChartOptions;
    this.chart.options.data = this.options[e.dataPoint.name];
    this.chart.options.title = { text: e.dataPoint.name }
    this.chart.render();
    this.isButtonVisible = true;
  }

  visitorsDrilldownedChartOptions = {
    animationEnabled: true,
    theme: "light2",
    axisY: {
      gridThickness: 0,
      lineThickness: 1
    },
    data: []
  };

  newVSReturningVisitorsOptions = {
    animationEnabled: true,
    theme: "light2",
    subtitles: [{
      backgroundColor: "#2eacd1",
      fontSize: 16,
      fontColor: "white",
      padding: 5
    }],
    data: []
  };

  options: data = {
    "New vs Returning Visitors": [{
      type: "pie",
      name: "New vs Returning Visitors",
      startAngle: 90,
      cursor: "pointer",
      explodeOnClick: false,
      showInLegend: true,
      legendMarkerType: "square",
      click: this.visitorsChartDrilldownHandler,
      indexLabelPlacement: "inside",
      indexLabelFontColor: "white",
      dataPoints: [
        { y: 551160, name: "Tiendas KA", color: "#005cff", indexLabel: "62.56%" },
        { y: 329840, name: "Tiendas BC", color: "rgb(33, 221, 27)", indexLabel: "37.44%" }
      ]
    }],
    "New Visitors": [{
      color: "#058dc7",
      name: "New Visitors",
      type: "column",
      dataPoints: [
        { label: "Jan", y: 42600 },
        { label: "Feb", y: 44960 },
        { label: "Mar", y: 46160 },
        { label: "Apr", y: 48240 },
        { label: "May", y: 48200 },
        { label: "Jun", y: 49600 },
        { label: "Jul", y: 51560 },
        { label: "Aug", y: 49280 },
        { label: "Sep", y: 46800 },
        { label: "Oct", y: 57720 },
        { label: "Nov", y: 59840 },
        { label: "Dec", y: 54400 }
      ]
    }],
    "Returning Visitors": [{
      color: "#005cff",
      name: "Returning Visitors",
      type: "column",
      dataPoints: [
        { label: "Jan", y: 21800 },
        { label: "Feb", y: 25040 },
        { label: "Mar", y: 23840 },
        { label: "Apr", y: 24760 },
        { label: "May", y: 25800 },
        { label: "Jun", y: 26400 },
        { label: "Jul", y: 27440 },
        { label: "Aug", y: 29720 },
        { label: "Sep", y: 29200 },
        { label: "Oct", y: 31280 },
        { label: "Nov", y: 33160 },
        { label: "Dec", y: 31400 }
      ]
    }]
  };


  chartOptionsJs = {
    animationEnabled: true,
    theme: "light2",
    axisY: {
      title: "Otras Tiendas (KPI)",
      includeZero: true
    },
    axisY2: {
      // title: "Total Revenue",
      includeZero: true,
      labelFormatter: (e: any) => {
        var suffixes = ["", "K", "M", "B"];

        var order = Math.max(Math.floor(Math.log(e.value) / Math.log(1000)), 0);
        if (order > suffixes.length - 1)
          order = suffixes.length - 1;

        var suffix = suffixes[order];
        return '' + (e.value / Math.pow(1000, order));
      }
    },
    toolTip: {
      shared: true
    },
    legend: {
      cursor: "pointer",
      itemclick: function (e: any) {
        if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
          e.dataSeries.visible = false;
        } else {
          e.dataSeries.visible = true;
        }
        e.chartJs.render();
      }
    },
    data: [{
      type: "column",
      showInLegend: true,
      name: "Tiendas",
      color: "#005cff",
      axisYType: "secondary",
      yValueFormatString: "#,###",
      dataPoints: [
        { label: "Jan", y: 25000 },
        { label: "Feb", y: 43100 },
        { label: "Mar", y: 64600 },
        { label: "Apr", y: 52200 },
        { label: "May", y: 46400 },
        { label: "Jun", y: 47000 },
        { label: "Jul", y: 53400 },
        { label: "Aug", y: 40700 },
        { label: "Sep", y: 48400 },
        { label: "Oct", y: 46500 },
        { label: "Nov", y: 42400 },
        { label: "Dec", y: 23100 }
      ]
    }, {
      type: "spline",
      showInLegend: true,
      name: "Variación",
      color: "rgb(33, 221, 27)",
      dataPoints: [
        { label: "Ene", y: 372 },
        { label: "Feb", y: 412 },
        { label: "Mar", y: 572 },
        { label: "Abr", y: 224 },
        { label: "May", y: 246 },
        { label: "Jun", y: 601 },
        { label: "Jul", y: 642 },
        { label: "Ago", y: 590 },
        { label: "Sep", y: 527 },
        { label: "Oct", y: 273 },
        { label: "Nov", y: 251 },
        { label: "Dic", y: 331 }
      ]
    }]
  }

  // VARIABLES
  panelOpenState = true;
  chart: any;
  isButtonVisible = false;
  chartJs: any;

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  // AUTOCOMPLETE SEARCHING AND DROPDOWN BAR 
  myControl = new FormControl('');
  franchiseOptions: string[] = ['Nombre Franquicia 1', 'Nombre Franquicia 2', 'Nombre Franquicia 3', 'Nombre Franquicia 4'];
  filteredOptions: Observable<string[]>;

  // NOTIFICATIONS FOR THE BELL ICON SECTION
  notifications = [
    { title: 'Nuevo cambio en iphone X', timestamp: '2 hours ago' },
    { title: 'Actualizar Equipos', timestamp: '1 day ago' },
    { title: 'Actualizar Dispositivos', timestamp: '2 days ago' },
    { title: 'Actualizar Dispositivos', timestamp: '2 days ago' }
  ];

  // CONSTRUCTOR
  constructor(private dialog: MatDialog, private _snackBar: MatSnackBar,) { }


  ngOnInit(): void {
    // SEARCH FILTER
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  //SEARCH BAR
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    //this.dataSource3.filter = filterValue.trim().toLowerCase();
  }

  handleClick(event: Event) {
    this.chart.options = this.newVSReturningVisitorsOptions;
    this.chart.options.data = this.options["New vs Returning Visitors"];
    this.chart.render();
    this.isButtonVisible = false;
  }

  getChartInstance(chart: object) {
    this.chart = chart;
    this.chart.options = this.newVSReturningVisitorsOptions;
    this.chart.options.data = this.options["New vs Returning Visitors"];
    this.chart.render();
  }

  // FILTER METHOD BY 
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.franchiseOptions.filter(option => option.toLowerCase().includes(filterValue));
  }

  openConfirmDialog() {
    this.dialog.open(NotificationPopupComponent, {
      width: '250px',
      data: {title: "¿Descargar Archivo?"}
    });
  }

  openSnackBar() {
    let message = "¡Link copiado, ya puedes compartirlo!"
    let action = "Perfecto"
    this._snackBar.open(message, action);
  }
}




