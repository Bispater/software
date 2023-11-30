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
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent implements OnInit {


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  myControl = new FormControl('');
  options: string[] = [];
  filteredOptions: Observable<string[]>;
  entelData: any = [];
  showPlacesOption = false;
  imagePlaces: any;


  newControl = new FormControl('');
  options_two: string[] = ['90%'];
  FilteredOption_two: Observable<string[]>;

  dataSource3 = new MatTableDataSource<any>(this.entelData);
  ngAfterViewInit() {
    this.dataSource3.paginator = this.paginator;
    this.dataSource3.sort = this.sort;

  }
  constructor(
    private services: ApiService,
  ) { }

  ngOnInit(): void {
    this.getImagePlaces();
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
    this.FilteredOption_two = this.newControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter_two(value || '')),
    );
  }

  getImagePlaces() {
    let params = { element_type: "image" }
    this.services.getPlaces(params).subscribe(
      data => {
        console.log("Data recieved for new local api ", data);
        this.imagePlaces = data;
        this.imagePlaces.forEach(element => {
          this.options.push(element.name)
        });
        this.showPlacesOption = true;
        console.log("places names ", this.options)
      }, error => {
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
    console.log("image place id selected : ", place_id)

  }
  
}
