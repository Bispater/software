import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AlertComponent } from '../alert/alert.component';
import { NotificationPopupComponent } from '../notification-popup/notification-popup.component';
import { ApiService } from '../services/services.service';
import { Subjects } from '../utils/subjects';

export interface EntelData {
  name: string;
  position: number;
  weight: number;
  symbol: number;
  accesories: number;
  image: number;
  rank: number;
}

export interface EvaluationScale {
  scale: string;
  devices: number;
  home: number;
  accesories: number;
  image: number;
}

export interface Data_ {
  name: string;
  code: number;
  cell_value: number;
}

const ELEMENT_DATA: EntelData[] = [
  { position: 1, name: 'Comunicaciones Ketels', weight: 32, symbol: 32, accesories: 32, image: 32, rank: 98 },
  { position: 2, name: 'CTF Tecnología SPA', weight: 32, symbol: 32, accesories: 32, image: 32, rank: 97 },
  { position: 3, name: 'Cygnus Móvil', weight: 32, symbol: 32, accesories: 32, image: 32, rank: 90 },
  { position: 4, name: 'Entel', weight: 32, symbol: 32, accesories: 32, image: 32, rank: 89 },
  { position: 5, name: 'Express ltda.', weight: 32, symbol: 32, accesories: 32, image: 32, rank: 85 },
  { position: 6, name: 'Fulltech', weight: 32, symbol: 32, accesories: 32, image: 32, rank: 85 },
  { position: 7, name: 'Hbdtel', weight: 32, symbol: 32, accesories: 32, image: 32, rank: 80 },
  { position: 8, name: 'Imaxtel', weight: 32, symbol: 32, accesories: 32, image: 32, rank: 78 },
  { position: 9, name: 'Inversiones Farellones', weight: 32, symbol: 32, accesories: 32, image: 32, rank: 77 },
  { position: 10, name: 'OBW Franco SPA', weight: 32, symbol: 32, accesories: 32, image: 32, rank: 76 },
  { position: 11, name: 'Phonemarket', weight: 32, symbol: 32, accesories: 32, image: 32, rank: 72 },
  { position: 12, name: 'Protein Chile SPA', weight: 32, symbol: 32, accesories: 32, image: 32, rank: 65 },
  { position: 13, name: 'Quintel', weight: 32, symbol: 32, accesories: 32, image: 32, rank: 50 },
  { position: 14, name: 'Sociedad Comercial Arretx ltda.', weight: 32, symbol: 32, accesories: 32, image: 32, rank: 45 },
  { position: 15, name: 'Telefonia Celular', weight: 32, symbol: 32, accesories: 32, image: 32, rank: 20 },
];

// -> FILL WITH VARIABLES (DEVICES, HOME, ETC) AND THEN CHANGE IT INTO THE HTML COMPONENT.
const export_data: EvaluationScale[] = [
  { scale: '>', devices: 31.5, home: 27.5, accesories: 19.5, image: 19.5 },
  { scale: '=', devices: 23.5, home: 20.5, accesories: 14.5, image: 14.5 },
  { scale: '<', devices: 23.4, home: 20.4, accesories: 14.4, image: 14.4 },
];

@Component({
  selector: 'app-pdv',
  templateUrl: './pdv.component.html',
  styleUrls: ['./pdv.component.scss']
})

export class PdvComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  @Input() spinner: boolean;

  // API
  progress_spinner: boolean = false;
  entelData: any = [];
  message_tmp: any;
  status_tmp: any;

  // VARIABLE COLORS DISPLAYED FOR TABLE
  greenColor = '#baefb8';
  yellowColor = '#edf2b2';
  redColor = '#fac2c5';

  // AUTOCOMPLETE SEARCHING AND DROPDOWN BAR 
  myControl = new FormControl('');
  options: string[] = ['Nombre Franquicia 1', 'Nombre Franquicia 2', 'Nombre Franquicia 3', 'Nombre Franquicia 4'];
  filteredOptions: Observable<string[]>;

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'accesories', 'image', 'rank'];
  dataSource = ELEMENT_DATA;

  displayedColumns2: string[] = ['scale', 'devices', 'home', 'accesories', 'image'];
  dataSource2 = export_data;

  displayedColumnsEntel: string[] = ['code', 'name', 'franchise', 'device', 'home', 'accesories', 'image', 'mark']
  dataSource3 = new MatTableDataSource<any>(this.entelData);

  // NOTIFICATIONS FOR THE BELL ICON SECTION
  notifications = [
    { title: 'Nuevo cambio en iphone X', timestamp: '2 hours ago' },
    { title: 'Actualizar Equipos', timestamp: '1 day ago' },
    { title: 'Actualizar Dispositivos', timestamp: '2 days ago' },
    { title: 'Actualizar Dispositivos', timestamp: '2 days ago' }
  ];

  ngAfterViewInit() {
    this.dataSource3.paginator = this.paginator;
    this.dataSource3.sort = this.sort;
    this.paginator._intl.itemsPerPageLabel = "Items por Página";
  }

  constructor(
    private apiService: ApiService,
    private alert: AlertComponent,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.spinner = true;
    // SEARCH FILTER
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );

    // ENTEL DATA API (NAME?)
    this.apiService.getEntelData().subscribe(
      data => {
        for (let item of data) {
          let toNumberArray: any[] = [];
          for (let i of item.data) {
            let values_: Data_ = { name: null, code: null, cell_value: null };
            values_.name = i.name;
            values_.code = i.code;
            values_.cell_value = +i.cell_value;
            toNumberArray.push(values_);
          }

          let obj = {
            'franchise': item.franchise,
            'code': item.code,
            'name': item.name,
            'data': toNumberArray
          }
          this.entelData.push(obj);
        }
        //console.log(this.entelData);
        this.execDataSource();
        this.spinner = false;
      },
      error => {
        console.log('error', error);
        this.message_tmp = '¡Ocurrió un problema, por favor intente nuevamente!';
        this.status_tmp = 'alert-danger';
        this.alert.changeFromAlert();
      }
    );
  }

  // FILTER METHOD BY 
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  execDataSource() {
    setTimeout(() => {
      this.dataSource3 = new MatTableDataSource(this.entelData);
      this.dataSource3.paginator = this.paginator;
      this.dataSource3.sort = this.sort;
    }, 100);
  }

  //SEARCH BAR
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource3.filter = filterValue.trim().toLowerCase();
  }

  openConfirmDialog() {
    this.dialog.open(NotificationPopupComponent, {
      width: '250px',
    });
  }

  openSnackBar() {
    let message = "¡Link copiado, ya puedes compartirlo!"
    let action = "Perfecto"
    this._snackBar.open(message, action);
  }

}
