import { Component, OnInit, Input,  SimpleChanges} from '@angular/core';
import { Observable, BehaviorSubject,  } from 'rxjs';
import * as _ from "lodash";
import { FormControl } from '@angular/forms';
import { ApiService } from './../../../../services/services.service';
import { ObjectService } from './../../../../services/object.service';

declare var $:any;

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})

export class IndexComponent implements OnInit {

  //tab current
  @Input() tab:any;
  @Input() tabCurrent:any;
  @Input() filter:any;
  @Input() spinner: boolean;
  
  //tabs
  public tabs = [
    'equipos más tocados', 
    'tiendas con más interacciones', 
    'tiendas con más usuarios únicos', 
    'Estadísticas por tiendas', 
    'Estadísticas por dispositivos'
  ];

  /*  'tiendas con más usuarios únicos', 
    'Estadísticas por tiendas', 
    'Estadísticas por dispositivos' */

  public user_channel:any [] = [];
  public selected = new FormControl(0);
  public responseChannel:any;

  public filters:any;

  /*
  public responseDeviceEvent:any;
  public objectParentMetrics:any
  public subsidiaries: any;
  public filter_subsidiary: any[] = [];
  public filter_subsidiary_tmp: any[] = [];
  public filter_channel = [];
*/

  constructor(private apiService: ApiService, private ObjectService:ObjectService) { }

  ngOnInit(): void {

    //spinner
    this.spinner = true; 
    
    //necesario de felipe antiguo
    let profileUser = JSON.parse(localStorage.getItem('profileUser'));
    this.user_channel = profileUser['channel'] && profileUser['channel']!='' ? profileUser['channel'] : '';

    //get canales
    this.getChannel()
    this.getTotalSubsidiariesList()

    //set value tab current
    this.tabCurrent = this.selected.value
    
  

  }

  getTotalSubsidiariesList() {
    this.apiService.getCatalogueSubsidiaries(null, '?q=true').subscribe(
      data => {
         console.log('##data', data);
        let subsidiaries = data.results;
        let list_subsidiaries = subsidiaries;
        console.log('subslist_subsidiariesidiaries', list_subsidiaries);
        this.ObjectService.setSubsidiaries(list_subsidiaries);

      },
      error => {
        console.log('error', error);
      }
    );
  }

  //tab current
  focus(tabCurrent:any){
    this.tab = {
      tabId:tabCurrent.index,
      tabLabel:tabCurrent.tab.textLabel
    }
    this.tabCurrent = this.tab.tabId
    
  }

  outPutSpinner(event){
    this.spinner = event;
  }

  //getChannel
  getChannel(){
    this.apiService.getSalesChannel().subscribe(
      data => {
        let list_channel = [];
        data.results.forEach(element => {
          this.user_channel.forEach(channel => {
            if(channel == element.id){
              list_channel.push(element);
            }
          });
        });
        this.getSubsidiaries(data.results)
      },
      error => {
        console.log('error', error);
      }
    );
  }

  //getSubsidiaries
  getSubsidiaries(arrayChannel){
		this.apiService.getSegment().subscribe(
			data => {
        console.log(data)
        //spinner
        this.spinner = false;
				let list_subsidiaries = data.results;
        let data_list_subsidiaries = []; 
        list_subsidiaries.forEach(element => {
          let subsidiaries = element.subsidiaries;
          subsidiaries.forEach(value => {
            this.user_channel.forEach(channel => {
              if(channel == value.sales_channel){
                data_list_subsidiaries.push(value);
              }
            });
          });
        });
        /*this.filter_subsidiary = _.orderBy(data_list_subsidiaries, ['name'], ['asc']);
        this.filter_subsidiary_tmp  = this.filter_subsidiary;*/
        this.filters = [
          { 
            channel:arrayChannel
          },
          {
            subsidiary: list_subsidiaries 
          }
        ]
        this.filter = this.filters
      },
			error => {
				console.log('error', error);
			}
		);
  }  

    /* 
      outFormSearchFromTemplateTab(value) {
        let objectFromFilter = value
        console.log('recobido final',value)
        //console.log('from parente', value)
        this.preGetDeviceEvent(value)
        
      }
  */


}


