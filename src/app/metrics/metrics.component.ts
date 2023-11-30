import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MetricModel, Subsidiary } from '../utils/metric-data.interface';
import { ApiService } from '../services/services.service';
import { Subjects } from '../utils/subjects';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.scss']
})
export class MetricsComponent implements OnInit {

  myControl = new FormControl('');
  options: string[] = [];
  subsidiaries: Subsidiary[] = [];
  filteredOptions: Observable<Subsidiary[]>;
  showTabs = false;

  constructor(
    private metricApi: ApiService, 
    private metricData: Subjects) { }

  ngOnInit(): void {
    this.getCause();
    this.metricApi.getMetricData().subscribe(
      data => {
        this.subsidiaries = data.results;
        this.initFiltering();
      },
      error => {
        console.log("Metric Data Failed...", error);
      }
    )

    this.metricData.metricDataSubject$.subscribe(
      data => {
        console.log("new subject", data);
      }
    )
  }

  getCause() {
    this.metricApi.getCauses().subscribe(
      data => {
        this.metricData.allCauses$.next(data);
      },
      error => {
        console.log("error getting causes", error);
      }
    )
  }

  initFiltering() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  private _filter(value: string): any {
    const filterValue = value.toLowerCase();
    return this.subsidiaries.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  optionSelected(event: MatAutocompleteSelectedEvent) {
    let subsidiary_id = Number(event.option.id);
    // this.metricData._nextMetricSub(subsidiary_id);
    this.fillSubsidiary(subsidiary_id);
    this.showTabs = true;
  }

  fillSubsidiary(subsidiary_id: number){
    let params = {id : subsidiary_id}
    this.metricApi.getStatSubsidiary(params).subscribe(
      data => {
        console.log("data : ", data);
        this.metricData.metricDataSubject$.next(data);
      },
      error => {
        console.log("error : ", error);
      }
    )
  }

  clear(){
    this.showTabs = false;
  }
}




