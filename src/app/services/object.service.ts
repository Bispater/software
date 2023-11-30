import { Injectable,   ChangeDetectionStrategy,
  ChangeDetectorRef,
   } from '@angular/core';
import { Observable, BehaviorSubject, Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class ObjectService {

  public table = new BehaviorSubject(null)
  public chart = new BehaviorSubject(null)
  public unblocked = new BehaviorSubject(null)
  public subsidiaries = new BehaviorSubject(null)

  
  getObjectObs(): Observable<any> {
    return this.table.asObservable();
  }
  
  getChart(): Observable<any> {
    return this.chart.asObservable();
  }

  setObjectObs(object: any) {
    this.table.next(object);
  }

  setChart(chart: any) {
    this.chart.next(chart);
  }

  //subsidiaries
  getSubsidiaries(): Observable<any> {
    return this.subsidiaries.asObservable();
  }
  setSubsidiaries(subsidiaries: any) {
    this.subsidiaries.next(subsidiaries);
  }

  getUnblocked(): Observable<any> {
    return this.unblocked.asObservable();
  }

  setUnblocked(value:boolean){
    this.unblocked.next(value)
  }

  constructor() {

  }



}
