import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { GlobalService } from './global.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
// import { HttpParams } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import {  AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import 'firebase/database';

@Injectable()
export class ApiService {

  public parameters:any
  
  currentUser: JSON;
  public list_shops_service = [];
  public list_shops_service_left = [];
  urlBase: string = environment.urlBase;

  /* Videos */
  path_node = 'dynamic-v3/videos'
  videoRef: AngularFireList<any>;
  videos: Observable<any[]>

  public queryParams = new HttpParams();
  

  constructor(
    private http: HttpClient, 
    private globalService: GlobalService,
    private db: AngularFireDatabase
  ) {
    if (localStorage.getItem('currentUser')) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    /** Upload Videos */
    this.videoRef = this.db.list(this.path_node);
    // Use snapshotChanges().map() to object the key
    this.videos = this.videoRef.snapshotChanges().pipe(
      map(changes => 
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    );
  }
  
  getTotalSubsidiaries(): Observable<any>{
    let param = '?q=true'
    return this.http.get(this.urlBase  + 'dynamic/api/catalogue_subsidiaries/' + param
    ).pipe(
      map((response: Response) => <any>response)
    );  
  }

  getBrand(){
    const url = this.urlBase  + 'devices/api/brand/';
    //console.log(url);
    return this.http.get<any>(url);
  }

  // API ENTEL 

  // getEntelData(): Observable<any>{
  //   //https://jsonplaceholder.typicode.com/users
  //   // const url = this.urlBase  + 'dynamic/api/catalogue_segment/';
  //   // console.log(url);
  //   // return this.http.get<any>(url);
  //   // const url = environment.localUrlBase + "api/pdv/";
  //   return this.http.get<any>(url);
  // }


  // 

  getPlaces(params = {}){
    const url = environment.localUrlBase + "api/pdv/place";
    console.log("api ->", url + params)
    return this.http.get<any>(url, {params : params});
  }

  getCauses(){
    const url = environment.localUrlBase + "api/pdv/cause";
    return this.http.get<any>(url);
  }

  getElementofTable(params : any){
    const url = environment.localUrlBase + "api/pdv/element";
    return this.http.get<any>(url, {params : params});
  }

  getStatSubsidiary(params: any){
    const url = environment.localUrlBase + "api/pdv/stat/subsidiary"
    return this.http.get<any>(url, {params : params});
  }

  postStat(params : any){
    const url = environment.localUrlBase + "api/pdv/stat";
    return this.http.post<any>(url, {params : params});
  }
}
