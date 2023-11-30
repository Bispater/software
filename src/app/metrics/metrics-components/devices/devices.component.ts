import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as _ from 'lodash';
import { Observable, Subject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ImageDialogComponent } from 'src/app/component/image-dialog/image-dialog.component';
import { DropImagesComponent } from 'src/app/drop-images/drop-images.component';
import { NotificationPopupComponent } from 'src/app/notification-popup/notification-popup.component';
import { ApiService } from 'src/app/services/services.service';
import { Subjects } from 'src/app/utils/subjects';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.scss']
})


export class DevicesComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  @Input() spinner: boolean = true;

  myControl = new FormControl('');
  options: string[] = [];
  filteredOptions: Observable<string[]>;
  entelData: any = [];
  showPlacesOption = false;
  devicePlaces: any;
  actualPlaceID: number;
  imageUrl: string;
  currentImages = [
  ];

  newControl = new FormControl('');
  options_two: string[] = ['90%'];
  FilteredOption_two: Observable<string[]>;
  finalMarkFER: number = 0;
  toSendTableID : number;
  showTable = false;

  dataSource3 = new MatTableDataSource<any>(this.entelData);
  ngAfterViewInit() {
    this.dataSource3.paginator = this.paginator;
    this.dataSource3.sort = this.sort;

  }
  constructor(
    private dialog: MatDialog,
    private metricData: Subjects,
    private services: ApiService,
  ) { }

  ngOnInit(): void {
    this.getDevicesPlaces();
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
    this.FilteredOption_two = this.newControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter_two(value || '')),
    );
  }

  getDevicesPlaces() {
    let params = { element_type: "device" }
    this.services.getPlaces(params).subscribe(
      data => {
        console.log("Data recieved for new local api ", data);
        this.devicePlaces = data;
        this.devicePlaces.forEach(element => {
          this.options.push(element.name)
        });
        this.spinner = false;
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

  onInputChange() {
    this.newControl.valueChanges.subscribe((value) => {
      this.finalMarkFER = value;
    });
  }

  optionSelected(event: MatAutocompleteSelectedEvent) {
    let place_id = _.find(this.devicePlaces, function (obj) {
      if (obj.name === event.option.value) {
        return obj.id;
      }
    });
    place_id = place_id.id;
    this.actualPlaceID = place_id;
    this.metricData.actualPlaceId$.next(this.actualPlaceID);
    this.showTable = true;
    this.toSendTableID = this.metricData.actualPlaceId$.getValue();
    this.showImagesDevice()
    // this.metricData._nextMetricPlaceDevice(place_id);
  }

  showImagesDevice(){
    this.metricData.metricDataSubject$.subscribe(
      data => {
        let images = [];
        images = data.devices
      }
    )
  }

  openConfirmDialog() {
    const response = this.dialog.open(NotificationPopupComponent, {
      width: 'auto',
      data: { title: "¿Esta calificación es correcta?", text: "Calificación : " + this.finalMarkFER + "%" }
    });
    response.afterClosed().toPromise().then(result => {
      if (result === "yes") {
        this.metricData._nextMetricPlaceDevice(this.actualPlaceID, null, this.finalMarkFER)
        this.newControl.setValue('');
      } else {
        // Do something else if the "Cancelar" button was clicked
      }
    });
  }

  onSendUpload(url: string) {
    this.imageUrl = url;
    // this.currentImages.push(this.imageUrl);
    this.currentImages.unshift(this.imageUrl);
    this.metricData._nextMetricPlaceDevice(this.actualPlaceID, null, null, url)
    console.log("-> emmiter working")
  }

  removeImage(index: number) {
    this.currentImages.splice(index, 1);
  }

  openImageDialog(imageUrl: string) {
    this.dialog.open(ImageDialogComponent, {
      data: { imageUrl },
      width: 'auto',
    });
  }

}
