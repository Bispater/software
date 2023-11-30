import { OverlayRef } from '@angular/cdk/overlay';
import { Component, OnInit, ViewChild, AfterViewInit, Input } from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';
import * as _ from "lodash";
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

import * as moment from 'moment';
import 'moment/locale/pt-br';
import { ApiService } from '../../../../../services/services.service';
import { Utils } from '../../../../../utils/utils';
import {FormControl, FormGroup, Validators} from '@angular/forms';
/**table */
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { RankingDevice, DeviceElastic } from 'src/app/models';
import { MatSelectChange } from "@angular/material/select";


declare var $:any;

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'DD MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'DD MMMM YYYY',
  },
};

@Component({
  selector: 'app-equipments-touched',
  templateUrl: './equipments-touched.component.html',
  styleUrls: ['./equipments-touched.component.scss'],
  providers: [ApiService, 
    {
    provide: DateAdapter,
    useClass: MomentDateAdapter,
    deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
  },
  {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})
export class EquipmentsTouchedComponent implements OnInit {
  
  displayedColumns: string[] = ['index','brand', 'model', 'interactions_1', 'interactions_2', 'interactions_3', 'channel'];
  dataSource: MatTableDataSource<any[]> = new MatTableDataSource<any[]>([]);

  displayedColumnsModal: string[] = ['index','subsidiary', 'channel', 'interactions_1', 'interactions_2', 'interactions_3'];
  dataSourceModal: MatTableDataSource<any[]> = new MatTableDataSource<any[]>([]);

  pageEvent: PageEvent;
  pageIndex:number;
  pageSize:number;
  length:number;
  @ViewChild(MatPaginator, {static : false}) paginator: MatPaginator;

  // @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() spinner: boolean;
  @ViewChild('matchannel') matchannel;
  @ViewChild('matDate') matDate;
  public tab = 'dfsf'

  public filter_channel: any[] = [];
  public form_search : FormGroup;
  public chart_single: any[];
  public total_count_device: number;
  public total_count_model:number;

  //** search form */
  public search_channel: any[] = [];
  public search_date: any;
  public search_range_date: any;

  public first_data_elastic: any;
  public position_ranking: any;
  public num_ranking: number;

  public legend_date: string = 'Últimos 7 días';
  public legend_date_range: string = ''; 
  public legend_channel: any;
  public legend_image: any = '';
  public button_detalle: boolean = false;
  public num_interactions: number;
  public device_ranking: any;
  public bgModal: string = 'bgModal2';
  public total_store_interacction: any; 
  public device_ranking_channel: any;
  public user_channel:any [] = [];

  //min and max date range
  public minDate: any = this.utils.dateStartElastic();
  public maxDate: any = this.utils.dateEndElastic();
  
  view: any[] = [];//0, 400
  //view: any[]

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  width:any;
  Height:any
  showLegend = false;
  showXAxisLabel = true;
  xAxisLabel = '';
  showYAxisLabel = true;
  yAxisLabel = 'Porcentaje de interacciones %';
  chartsActive:boolean = false;
  colorScheme= {
    domain: ['#42E8B4', '#42E8B4', '#42E8B4', '#42E8B4' , '#42E8B4', '#42E8B4']
  };
  
  constructor( 
    public dialog: MatDialog,
    private apiService: ApiService,
    public utils: Utils,
  ) {
    
  }


  ngOnInit(): void {
    this.spinner = true; 
    $(".mat-tab-group.mat-primary .mat-ink-bar, .mat-tab-nav-bar.mat-primary .mat-ink-bar").css("background", "#42E8B4");
    let profileUser = JSON.parse(localStorage.getItem('profileUser'));
    this.user_channel = profileUser['channel'] && profileUser['channel']!='' ? profileUser['channel'] : '';
    this.initForm();
    this.getChannel();
    this.initRangeDate();
    
    
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;

    $('.ngx-charts').css("display","inline-block !important");
    $('.ngx-charts').css("width","100% !important");
    $('.ngx-charts').css("float","none");
    $('.ngx-charts').css("height","395px");
        
  }

  initRangeDate(){
    let num_start_date = this.form_search.get('date').value;  
    let last_star_date:any;
    if(num_start_date != '40'){
        this.form_search.controls['start_date'].disable();
        this.form_search.controls['end_date'].disable();
        last_star_date = moment(moment().add((num_start_date*-1), 'days')).format('YYYY-MM-DD') + "T00:00:00.000";
        let last_end_date = moment().format('YYYY-MM-DD') + "T23:59:59.000";
        this.form_search.controls['start_date'].setValue(last_star_date);
        this.form_search.controls['end_date'].setValue(last_end_date);
    }else{
      this.form_search.controls['start_date'].enable();
      this.form_search.controls['end_date'].enable();
    }
  }

  initForm(){

    this.form_search = new FormGroup({
      channel:new FormControl(null), 
      date: new FormControl('7'),
      start_date: new FormControl(null),
      end_date : new FormControl(null)
    }); 

  }
  

  onSubmit(){
    let query:any = [];

      let channel:any[];
      let last_star_date:any;
      let num_start_date: any;
      let first_start_date: any;
      let first_end_date: any;
      let start_date: any;
      let end_date: any;
      this.spinner = true;
      

      channel = this.form_search.get('channel').value;
      // this.form_search.controls['channel'].disable();
      // let date = this.form_search.get('date').value.setValue(moment().format('YYYY-MM-DD'));
      num_start_date = this.form_search.get('date').value && this.form_search.get('date').value !='40' ? this.form_search.get('date').value : false;
      
      this.legend_date = '';
      switch(num_start_date){
        case '0': this.legend_date = 'Hoy'; break;
        case '7': this.legend_date = 'Últimos 7 días'; break;
        case '15': this.legend_date = 'Últimos 15 días'; break;
        case '30': this.legend_date = 'Últimos 30 días'; break;
      }
      
      if(num_start_date){
        last_star_date = moment(moment().add((num_start_date*-1), 'days')).format('YYYY-MM-DD') + "T00:00:00.000";
      }
      
      let last_end_date = moment().format('YYYY-MM-DD') + "T23:59:59.000";
      
      first_start_date = this.form_search.get('start_date').value;
      start_date = moment(first_start_date).format('YYYY-MM-DD') + "T00:00:00.000";
      // let start_date2 = this.form_search.get('start_date').value.setValue(moment().format('YYYY-MM-DD'));
      // console.log('dates', start_date);    
      first_end_date = this.form_search.get('end_date').value;
      end_date = moment(first_end_date).format('YYYY-MM-DD') + "T23:59:59.000";

      // console.log('channel.lenght', channel.length);

      if(channel && channel.length >0 && first_start_date && first_end_date){
        // console.log('*****1');
        query = {
          "size":9999,
          "query": {
              "bool": {
                  "filter": [
                      {
                        "range": {
                          "date_created": {
                            "gte": start_date,
                            "lte": end_date
                          }
                        }
                      },
                      {
                          "multi_match": {
                              "query": "metrics",
                              "fields": ["_type"]
                          }
                      },
                      {
                          "multi_match": {
                              "query": "click",
                              "fields": ["_index"]
                          }
                      }
                  ],
                  "must" : [
                    {
                      "terms" : {
                        "sales_channel_id" : channel
                      }
                    }
                  ]
              }
          }
        };
      }else if(channel && channel.length >0 && num_start_date && num_start_date.length >0){
        // console.log('*****2');
        query = {
          "size":9999,
          "query": {
              "bool": {
                  "filter": [
                      {
                        "range": {
                          "date_created": {
                            "gte": last_star_date,
                            "lte": last_end_date
                          }
                        }
                      },
                      {
                          "multi_match": {
                              "query": "metrics",
                              "fields": ["_type"]
                          }
                      },
                      {
                          "multi_match": {
                              "query": "click",
                              "fields": ["_index"]
                          }
                      }
                  ],
                  "must" : [
                    {
                      "terms" : {
                        "sales_channel_id" : channel
                      }
                    }
                  ]
              }
          }
        };
      }else if(channel && channel.length >0){
        // console.log('*****3');
        query = {
          "size":9999,
          "query": {
              "bool": {
                  "filter": [
                    {
                        "multi_match": {
                            "query": "metrics",
                            "fields": ["_type"]
                        }
                    },
                    {
                        "multi_match": {
                            "query": "click",
                            "fields": ["_index"]
                        }
                    }
                  ],
                  "must" : [
                    {
                      "terms" : {
                        "sales_channel_id" : channel
                      }
                    }
                  ]
              }
          }
        };
      }else if(num_start_date && num_start_date.length >0){
        // console.log('*****4', num_start_date);
        query = {
          "size":9999,
          "query": {
              "bool": {
                  "filter": [
                      {
                        "range": {
                          "date_created": {
                            "gte": last_star_date,
                            "lte": last_end_date
                          }
                        }
                      },
                      {
                          "multi_match": {
                              "query": "metrics",
                              "fields": ["_type"]
                          }
                      },
                      {
                          "multi_match": {
                              "query": "click",
                              "fields": ["_index"]
                          }
                      }
                  ]
              }
          }
        };
      }else if(first_start_date && first_end_date && !num_start_date){
        // console.log('*****5');
        query = {
          "size":9999,
          "query": {
              "bool": {
                  "filter": [
                      {
                        "range": {
                          "date_created": {
                            "gte": start_date,
                            "lte": end_date
                          }
                        }
                      },
                      {
                          "multi_match": {
                              "query": "metrics",
                              "fields": ["_type"]
                          }
                      },
                      {
                          "multi_match": {
                              "query": "click",
                              "fields": ["_index"]
                          }
                      }
                  ]
              }
          }
        };
      }else if(!first_start_date && !first_end_date && !num_start_date && !channel){
        let last_end_date = moment().format('YYYY-MM-DD') + "T23:59:59.000";
        let last_star_date = "2021-09-20T23:59:59.000";
        // console.log('*****6');
        query = {
          "size":9999,
          "query": {
              "bool": {
                  "filter": [
                    {
                      "range": {
                        "date_created": {
                          "gte": last_star_date,
                          "lte": last_end_date
                        }
                      }
                    },
                    {
                        "multi_match": {
                            "query": "metrics",
                            "fields": ["_type"]
                        }
                    },
                    {
                        "multi_match": {
                            "query": "click",
                            "fields": ["_index"]
                        }
                    }
                  ]
              }
          }
        };
      }
      // console.log('query', query);
      // console.log('this.form_search', this.form_search);
      
      this.getDeviceMoreTouch(query, null);
  }

  exportAsPDF(div_id){
    this.spinner = true;
    let event: any = {
      length: this.length ,
      pageIndex: 0,
      pageSize: 10,
      previousPageIndex: 0
    };

    // this.paginator_ranking(event);
    if(this.paginator_ranking(event)){
      
      setTimeout(() => {
        $("#divTableSource").hide();
        $("#divTableSourcePrint").removeClass('hide');
        let data = document.getElementById(div_id);
        $("#btn_detalle").hide();
        $("body, html").css("background", "white");
        $("#mat_ranking").css("background", "white");
        $(".mat-elevation-z8").css("box-shadow", "unset");
        html2canvas(data).then(canvas => {
          const contentDataURL = canvas.toDataURL('image/png')
          var imgWidth = 210; 
          var pageHeight = 290;  
          var imgHeight = canvas.height * imgWidth / canvas.width;
          var heightLeft = imgHeight;

          var pdf = new jsPDF('p', 'mm', [210, 290]);
          var position = 0;

          pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;

          while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
          }
          pdf.save('Equipos mas tocados.pdf');
          setTimeout(() => {
            $("body, html").css("background", "#F6F6F6");
            $(".mat-elevation-z8").css("box-shadow", "0px 5px 5px -3px rgb(0 0 0 / 20%), 0px 8px 10px 1px rgb(0 0 0 / 14%), 0px 3px 14px 2px rgb(0 0 0 / 12%)");
            $("#btn_detalle").show();
            $("#divTableSource").show();
            $("#divTableSourcePrint").addClass('hide');
            this.paginator_ranking(event);
            this.spinner = false;
          }, 300);
          
        }); 
      }, 800);
    }

  }

  openDialog(templateRef) {     
    // console.log('device');
      let dialogRef = this.dialog.open(templateRef, {
        width: '100%',
        height: '90%',
        autoFocus: false, 
        panelClass: 'bgModal'
      });
  }


  getDeviceMoreTouch(query_search: any = null, event?:PageEvent){

    // console.log('event **', event);
    
    let num_start_date = this.form_search.get('date').value;
    let last_star_date = moment(moment().add((num_start_date*-1), 'days')).format('YYYY-MM-DD') + "T00:00:00.000";
    let last_end_date = moment().format('YYYY-MM-DD') + "T23:59:59.000";

    let query:any;
    if(!query_search){
      query = {
        "size":9999,
        "query": {
            "bool": {
                "filter": [
                    {
                      "range": {
                        "date_created": {
                          "gte": last_star_date,
                          "lte": last_end_date
                        }
                      }
                    },
                    {
                        "multi_match": {
                            "query": "metrics",
                            "fields": ["_type"]
                        }
                    },
                    {
                        "multi_match": {
                            "query": "click",
                            "fields": ["_index"]
                        }
                    }
                ]
            }
        }
      };
    }else{
      query = query_search;
    }
    
    
    // console.log('query', query);
    this.chart_single = [];
    // this.device_ranking = [];

    this.apiService.getElasticSearchData(query).subscribe(
			data => {
        // console.log('data_elastic hits***', data.hits.hits);
				let data_elastic = data && data.hits && data.hits.hits ? data.hits.hits : [];
        // console.log('data_elastic***', data_elastic);

        let data_elastic_device = []; 
        data_elastic.forEach(element => {
          data_elastic_device.push(element._source)
        });
        
        
        this.first_data_elastic = data_elastic_device;
        //**  Data Charts  */
        
        let device_more_touch = _.chain(data_elastic_device).groupBy("model_name").map((value, key) => ({
          name : value[0].device_name,
          model : value[0].model_name,
          brand : value[0].brand_name,
          value: _.countBy(value, 'model_name')
        })).value();

        let chart_clean_list: any[] = [];

        this.total_count_device = 0;
        device_more_touch.forEach(element => {
          let name = this.cleanNameBrand(element.name)
          let chart_clean = {
            'brand' : element.brand,
            'model' : element.model,
            'value' : element.value[element.model]
          }
          this.total_count_device = element.value[element.model]+this.total_count_device;
          chart_clean_list.push(chart_clean);
        });

        chart_clean_list = _.orderBy(chart_clean_list, ['value'], ['desc']);

        let chart_clean_total: any[] = [];
        
        chart_clean_list.forEach(element => {
          let value =  (Number(element.value)*100)/Number(this.total_count_device);

          let chart_clean = {
            'name' : [element.brand, element.model],
            'value' : this.utils.decimalAdjust('round', (value), -2)
          }
          chart_clean_total.push(chart_clean);
        });
        // console.log('chart_clean_total', chart_clean_total);
        if(data_elastic_device?.length){
          let chart_clean_top: any[] = [];
          if(chart_clean_total?.length >=5){
            // console.log('aca 5');
            for(var i = 0; i < 5; i++){
              chart_clean_top.push(chart_clean_total[i]);
            }
          }else{
            for(var i = 0; i < 5; i++){
              if(chart_clean_total[i]){
                chart_clean_top.push(chart_clean_total[i]);
              }else{
                let nameEjeX: any;
                for (let index = 0; index < i; index++) {
                  nameEjeX = nameEjeX + ' ';
                }
                chart_clean_top.push({'name' : nameEjeX, 'value' : 0});
              }
              
            }
          }

          this.chart_single = chart_clean_top;

          // console.log('this.chart_single for', this.chart_single);

          Object.assign(this.chart_single);

          setTimeout(() => {
            $(".tick").find( "text" ).each(function() {
              
              var text = $(this).text();
              if(!$.isNumeric(text)){
                // console.log('$( this ).text()', $( this ).text());
                $(this).text(text.replace('undefined', '')); 
              }
              
            }); 

            $("g").find( ".tick" ).each(function() {
              var text = $(this).find( "text" ).text();
              
              if(!$.isNumeric(text)){
                var name_ejeX = text.split(',');
                var brand = name_ejeX[0];
                var model = name_ejeX[1]==undefined ? '' : name_ejeX[1];
                // console.log('text', text);
                // console.log('brand', brand);
                // console.log('model', model);
                
                $(this).find( "text" ).text(text.replace(text, brand)).css('font-weight', 'bold');; 

                // console.log('element html', $( this ).html());
                let div = $(this).clone().addClass('chield-tick'); 

                // console.log('div clone', div);
                $("g").find( $(this)).prepend(div).html();
                $(this).closest('g').prepend(div).html();
                
                $(this).find('.chield-tick').find('text').text(brand.replace(brand, model));
                // $(this).find('.chield-tick').find('text').text(brand.replace('undefined', ''));
                setTimeout(function() {
                    $('.chield-tick').attr({
                      transform: 'translate(0.5, 20)'
                    }).css('font-weight', 'bold');
                }, 50);

                // console.log('div clone', chield_tick);
              }
              
            }); 
          }, 500);
        }
        
        // console.log('this.chart_single', this.chart_single);
        let legend_channel = _.chain(data_elastic_device).groupBy("sales_channel_id").map((value, key) => ({
          name : value[0].sales_channel_name
        })).value();

        this.legend_channel = this.utils.objToString(legend_channel);

        //table ranking
        let ranking=1;


        let device_ranking_channel = _.groupBy(data_elastic_device, function(item) {
          return item.model_name;
        });


        _.forEach(device_ranking_channel, function(value, key) {
          device_ranking_channel[key] = _.groupBy(device_ranking_channel[key], function(item) {
            return item.subsidiary_name;
          });
        });

        // console.log('grup by model_name', device_ranking_channel);

        let key_name_channel = Object.keys(device_ranking_channel);
        let dialog: any;
        let dialog_list: any = [];

        key_name_channel.forEach(element => {
            // console.log('element', element);
            let subsidiary_name = Object.keys(device_ranking_channel[element]);
            subsidiary_name.forEach(value => {
              dialog = {
                'model_name' : element,
                'subsidiary_name' : value,
                'count' : device_ranking_channel[element][value].length
              }
              dialog_list.push(dialog);
              // console.log('value', device_ranking_channel[element][value]);
            });
        });
        
        // console.log('dialog', dialog_list);

        dialog_list= _.orderBy(dialog_list, ['model_name', function (value) {
          // console.log(value);
          return value.count.length;
        }], ["desc", "desc"])

        // console.log('dialog order', dialog_list);

        
        this.total_store_interacction = _.groupBy(data_elastic_device, function(item) {
          return item.subsidiary_name;
        });

        // console.log('keyNames', key_name_channel);
        let device_ranking: any;
        this.device_ranking = [];
        
        device_ranking = _.chain(data_elastic_device).groupBy("model_name").map((value, model_name) => ({
            position : value,
            dialog: device_ranking_channel[model_name],
            brand : this.cleanNameBrand(value[0].device_name),
            model : model_name,
            // value: _.countBy(value, 'device_name'),
            interactions_1 : this.utils.decimalAdjust('round', ((value.length*100)/this.total_count_device), -2),
            interactions_2: value.length,
            interactions_3: this.orderSubsidiary(device_ranking_channel[model_name]),
            channel : value[0].sales_channel_name
        })).value();

        // console.log('total_store_interacction', this.total_store_interacction);

        // console.log('device_ranking ***33', device_ranking);

        this.device_ranking = _.orderBy(device_ranking, ['interactions_2', function (value) {
            // console.log(value);
            return value.dialog;
        }], ["desc", "desc"]);
        
        this.pageIndex = event && event.pageIndex ? event.pageIndex : 0;
        this.pageSize = event && event.pageSize ? event.pageSize : 10;
        this.length = this.device_ranking?.length;

        let devices = this.utils.filter(this.device_ranking, this.pageSize, this.pageIndex);
        this.dataSource = new MatTableDataSource(devices);
        
        this.spinner = false; 
        // console.log('this.dataSource.data', this.dataSource);
        // var tickLabels = $(this).('.axis.x .tick text');
        // console.log('tickLabels', tickLabels)
      },
			error => {
				console.log('error', error);
			}
		);
    return event;
  }

  getChannel(){
    this.filter_channel = [];
		this.apiService.getSalesChannel().subscribe(
			data => {
				let list_channel:any[] = [];

        data.results.forEach(element => {
          this.user_channel.forEach(channel => {
            if(channel == element.id){
              list_channel.push(element);
            }
          });
        });

        this.filter_channel = _.orderBy(list_channel, ['name'], ['asc']);

        // console.log('list_channel', list_channel);

        this.getDeviceMoreTouch(null, null);
      },
			error => {
				console.log('error', error);
			}
		);
  }


  onSelect(event) {
    console.log(event);
  }

  cleanNameBrand(value:any){
    let device_name_brand = value;
    device_name_brand = device_name_brand?.split("-", 2);
    if(device_name_brand?.length){
      return device_name_brand[0].replace(/\s/g, "");
    }else{
      return false;
    }
    
  }

  selectRanking(value:any, ranking: any, interactions: any, total_store_interacction: any){

    let spec = {
      backgrounds: [
         'bgBlack',
         'bgGreen',
         'bgBlue',
         'bgOrange',
         'bgPink'
      ]
    };

    let random = this.random(0, spec.backgrounds.length - 1);
    var addClass = spec.backgrounds[random];

    if(addClass == this.bgModal){
      random = this.random(0, spec.backgrounds.length - 1);
      addClass = spec.backgrounds[random];
    }

    this.bgModal = addClass;
    this.device_ranking = [];
    this.button_detalle = false;
    this.spinner = true;
    this.num_ranking = ranking;
    this.num_interactions = interactions;

    let subsidiary_name: any[] = Object.keys(value.dialog);

    // console.log('value modal', value.dialog);

    let device_ranking: any;
    let device_ranking_list: any [] = [];
    let position: number = 0; 
    subsidiary_name.forEach(element => {
      device_ranking = _.chain(value.dialog[element]).groupBy("model_name").map((device, key) => ({
          position : position++,
          brand : device[0].brand_name,
          model : device[0].model_name,
          // value: _.countBy(value, 'device_name'),
          interactions_1 : total_store_interacction[element].length,
          interactions_2: this.utils.decimalAdjust('round', ((device.length*100)/total_store_interacction[element].length), -2),
          interactions_3: device.length,
          channel : device[0].sales_channel_name,
          subsidiary : element,
          image : device[0].main_image
      })).value();
      device_ranking_list.push(device_ranking);
    });

    this.position_ranking = {
      'brand': device_ranking[0].brand,
      'model': device_ranking[0].model
    };

    this.legend_image = device_ranking[0].image;

    this.total_count_model = 0;
    device_ranking_list.forEach(element => {
      this.device_ranking.push(element[0]);
      this.total_count_model = this.total_count_model+element[0].interactions_3;
    });

    // console.log('device_ranking modal', this.device_ranking);
    this.device_ranking = _.orderBy(this.device_ranking, ['interactions_3'], ['desc']);
    
    this.dataSourceModal = new MatTableDataSource(this.device_ranking);
    this.spinner = false; 
    this.button_detalle = true;

    

    // console.log('this.bgModal', this.bgModal);
    
    // console.log(value);
    
    
  }

  
  selectedValue(event: MatSelectChange) {
    if(this.spinner){
      this.legend_channel = [];
      this.legend_channel.push(event.source.triggerValue);
    }
    
    // this.matchannel.close();
    // console.log(this.legend_channel);
  }

  resetForm(){
    this.form_search.reset();
    this.chart_single = [];
    this.dataSource = new MatTableDataSource([]);
    this.legend_channel = '';
    this.legend_date = '';
    this.legend_date_range = '';
    this.total_count_device = null;
    this.button_detalle = false;
    this.form_search.controls['start_date'].disable();
    this.form_search.controls['end_date'].disable();


  }

  CleanDateRange(){
    this.form_search.controls['start_date'].setValue('');
    this.form_search.controls['end_date'].setValue('');
    this.initRangeDate();
    this.legend_date_range = '';
    // this.matDate.close();
  }

  CleanDate(){
    let start_date = this.form_search.get('start_date').value;
    let end_date = this.form_search.get('end_date').value;
    this.legend_date = '';
    this.legend_date_range = this.utils.getDateFormatDevice(start_date)+' - '+this.utils.getDateFormatDevice(end_date);
    // this.form_search.controls['date'].setValue('');    
  }

  random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  formatDataLabel(value )
  {
    return value + '%';
  }

  percentTickFormatting(val: any) {
    return val.toLocaleString();
  }

  orderSubsidiary(value: any){
    // console.log('value', value);
    let key_name_subsidiary = Object.keys(value);
    
    // console.log('key_name_subsidiary', key_name_subsidiary);

    let name_subsidiary_total: any[] = [];
    key_name_subsidiary.forEach(element => {
      let name_subsidiary = {
        name : value[element][0].subsidiary_internal_id+' '+element,
        count : value[element].length
      }

      name_subsidiary_total.push(name_subsidiary);
    });

    // name_subsidiary_total = _.orderBy(name_subsidiary_total, ['count'], ['desc']);

    name_subsidiary_total= _.orderBy(name_subsidiary_total, ['count', function (value) {
      // console.log(value);
      return value.name;
    }], ["desc", "asc"])

    // console.log('name_subsidiary_total', name_subsidiary_total);

    return name_subsidiary_total[0].name;
  }

  paginator_ranking(event?:PageEvent){
    // console.log('event **', event)
    this.pageIndex = event && event.pageIndex ? event.pageIndex : 0;
    this.pageSize = event && event.pageSize ? event.pageSize : 10;
    this.length = this.device_ranking?.length;

    let devices = this.utils.filter(this.device_ranking, this.pageSize, this.pageIndex);
    this.dataSource = new MatTableDataSource(devices);

    return event;
  }

}
