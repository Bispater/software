import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ApiService } from 'src/app/services/services.service';


export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

export interface TableData {
  code : string;
  name : string;
  displayed : string;
  card : string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 104228, name: 'Motorola G50', weight: 1.0079, symbol: 'H' },
  { position: 171151, name: 'Xiaomi Redmi Note 11 Pro 5G', weight: 4.0026, symbol: 'He' },
  { position: 171211, name: 'Xiaomi Redmi Note 11S 5G', weight: 6.941, symbol: 'Li' },
  { position: 104244, name: 'Motorola G71', weight: 9.0122, symbol: 'Be' },
  { position: 174038, name: 'VIVO Y55 5G', weight: 10.811, symbol: 'B' },
  { position: 171054, name: 'Xiaomi Redmi 9A', weight: 12.0107, symbol: 'C' },
  { position: 171212, name: 'Xiaomi Redmi 10C', weight: 14.0067, symbol: 'N' },
  { position: 174031, name: 'VIVO Y21S', weight: 15.9994, symbol: 'O' },
];

@Component({
  selector: 'app-generic-table',
  templateUrl: './generic-table.component.html',
  styleUrls: ['./generic-table.component.scss']
})
export class GenericTableComponent implements OnInit {

  @Input() id: number;

  options: any[];

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;

  columnsData : string[] = ['code', 'name', 'displayed', 'card'];
  tableData : TableData[] = [];
  display = true;

  constructor(
    private service: ApiService
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    
    if (changes['id']) {
      this.getData()
    } 
  }

  getData(){
    let params = {'place' : this.id}
    this.service.getElementofTable(params).subscribe(
      data => {
        this.tableData = data;
        console.log("data table : ", this.tableData);
        this.display = true;
      }, error => {
        console.log("error data table api ", error);
      }
    )
  }

}


