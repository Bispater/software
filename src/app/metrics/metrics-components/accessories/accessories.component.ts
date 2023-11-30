import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ApiService } from 'src/app/services/services.service';

@Component({
  selector: 'app-accessories',
  templateUrl: './accessories.component.html',
  styleUrls: ['./accessories.component.scss']
})
export class AccessoriesComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  myControl = new FormControl('');
  options: string[] = [];
  filteredOptions: Observable<string[]>;
  entelData: any = [];
  AccessoriesPlaces : any;
  showPlacesOption = false;
  
  newControl = new FormControl('');
  options_two: string[] = ['90%'];
  FilteredOption_two: Observable<string[]>;

  dataSource3 = new MatTableDataSource<any>(this.entelData);
  ngAfterViewInit() {
    this.dataSource3.paginator = this.paginator;
    this.dataSource3.sort = this.sort;

  }
  constructor(
    private services : ApiService,
  ) { }

  ngOnInit(): void {
    this.getAccessoriesPlace()
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
    this.FilteredOption_two = this.newControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter_two(value || '')),
    );
  }

  getAccessoriesPlace(){
    let params = {element_type : "accessory"}
    this.services.getPlaces(params).subscribe(
      data => {
        this.AccessoriesPlaces = data;
        this.AccessoriesPlaces.forEach(element => {
          this.options.push(element.name)
        });
        this.showPlacesOption = true;
        console.log("Accessories places names ", this.options)
      },error => {
        console.log("unhandled local error", error);
      }
    )
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  private _filter_two(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options_two.filter(options_two => options_two.toLowerCase().includes(filterValue));
  }

  //SEARCH BAR
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource3.filter = filterValue.trim().toLowerCase();
  }

  optionSelected(event: MatAutocompleteSelectedEvent) {
    let place_id = Number(event.option.value);
    console.log("accessories place id selected : ", place_id)
  }

}
