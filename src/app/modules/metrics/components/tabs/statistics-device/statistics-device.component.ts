import { OverlayRef } from '@angular/cdk/overlay';
import { Component, OnInit, ViewChild, AfterViewInit, Input, Query } from '@angular/core';
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
  selector: 'app-statistics-device',
  templateUrl: './statistics-device.component.html',
  styleUrls: ['./statistics-device.component.scss'],
  providers: [ApiService, 
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},]
})
export class StatisticsDeviceComponent implements OnInit {
  displayedColumns: string[] = ['index', 'store', 'segment', 'interactions_1', 'interactions_2', 'interactions_3'];
  dataSource: MatTableDataSource<any[]> = new MatTableDataSource<any[]>([]);

  displayedColumnsModal: string[] = ['position','subsidiary', 'segment', 'interactions_1', 'interactions_2', 'interactions_3'];
  dataSourceModal: MatTableDataSource<any[]> = new MatTableDataSource<any[]>([]);

  pageEvent: PageEvent;
  pageIndex:number;
  pageSize:number;
  length:number;
  @ViewChild(MatPaginator, {static : false}) paginator: MatPaginator;

  @Input() spinner: boolean;
  @ViewChild('matSegment') matSegment;
  @ViewChild('matSubsidiary') matSubsidiary;
  @ViewChild('matDate') matDate;

  public filter_brand: any[] = [];
  public filter_subsidiary_tmp: any[] = [];
  public filter_subsidiary: any[] = [];
  public form_device : FormGroup;
  public chart_single: any[];
  public total_count_device: number;

  //** search form */
  public search_segment: any[] = [];
  public search_date: any;
  public search_range_date: any;

  public first_data_elastic: any;
  public position_ranking: DeviceElastic;
  public num_ranking: number;

  public legend_date: string = 'Últimos 7 días';
  public legend_date_range: string = ''; 
  public legend_segment: any;
  public legend_model: any;
  public legend_segment_tmp: any;
  public legend_model_tmp: any;
  public legend_image: any = '';
  public button_detalle: boolean = false;
  public num_interactions: number;
  public device_ranking: any;
  public bgModal: string = 'bgModal2';
  public device_ranking_segment: any;
  // public query_search: boolean = false;

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
    domain: ['#FD6C98', '#FD6C98', '#FD6C98', '#FD6C98' , '#FD6C98', '#FD6C98']
  };
  
  constructor( 
    public dialog: MatDialog,
    private apiService: ApiService,
    public utils: Utils,
  ) {
    
  }


  ngOnInit(): void {
    this.spinner = true;
    $(".mat-tab-group.mat-primary .mat-ink-bar, .mat-tab-nav-bar.mat-primary .mat-ink-bar").css("background", "#FD6C98");
    this.getSegment();
    this.initForm();
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
    let num_start_date = this.form_device.get('date').value;  
    let last_star_date:any;
    if(num_start_date != '40'){
        this.form_device.controls['start_date'].disable();
        this.form_device.controls['end_date'].disable();
        last_star_date = moment(moment().add((num_start_date*-1), 'days')).format('YYYY-MM-DD') + "T00:00:00.000";
        let last_end_date = moment().format('YYYY-MM-DD') + "T23:59:59.000";
        this.form_device.controls['start_date'].setValue(last_star_date);
        this.form_device.controls['end_date'].setValue(last_end_date);
    }else{
      this.form_device.controls['start_date'].enable();
      this.form_device.controls['end_date'].enable();
    }
  }

  initForm(){

    this.form_device = new FormGroup({
      segment:new FormControl(null), 
      subsidiary: new FormControl(null),
      date: new FormControl('7'),
      start_date: new FormControl(null),
      end_date : new FormControl(null)
    });
    

  }

  onSubmit(){
    let query:any;

      let segment:any[];
      let subsidiary:any[];
      let last_star_date:any;
      let num_start_date: any;
      let first_start_date: any;
      let first_end_date: any;
      let start_date: any;
      let end_date: any;
      this.spinner = true; 
      

      segment = this.form_device.get('segment').value;
      subsidiary = this.form_device.get('subsidiary').value;
      // let date = this.form_device.get('date').value.setValue(moment().format('YYYY-MM-DD'));
      num_start_date = this.form_device.get('date').value && this.form_device.get('date').value !='40' ? this.form_device.get('date').value : false;
      this.legend_date = '';
      switch(num_start_date){
        case '0': this.legend_date = 'Hoy'; break;
        case '7': this.legend_date = 'Últimos 7 días'; break;
        case '15': this.legend_date = 'Últimos 15 días'; break;
        case '30': this.legend_date = 'Últimos 30 días'; break;
      }
      // console.log('num_start_date', num_start_date);
      if(num_start_date){
        last_star_date = moment(moment().add((num_start_date*-1), 'days')).format('YYYY-MM-DD') + "T00:00:00.000";
      }
      
      let last_end_date = moment().format('YYYY-MM-DD') + "T23:59:59.000";
      
      first_start_date = this.form_device.get('start_date').value;
      start_date = moment(first_start_date).format('YYYY-MM-DD') + "T00:00:00.000";
      // let start_date2 = this.form_device.get('start_date').value.setValue(moment().format('YYYY-MM-DD'));
      // console.log('dates', start_date);    
      first_end_date = this.form_device.get('end_date').value;
      end_date = moment(first_end_date).format('YYYY-MM-DD') + "T23:59:59.000";

      // console.log('segment.lenght', segment.length);
          
      if(subsidiary && subsidiary.length >0 && segment && segment.length >0 && first_start_date && first_end_date){
        console.log('*****2021');
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
                    },
                    {
                      "terms": {
                          "model_id": [subsidiary]
                      }
                    }
                  ],
                  "must": {
                    "bool": {
                        "should": [
                            {
                                "terms": {
                                    "brand_id": [segment]
                                }
                            }
                        ]
                    }
                  }
              }
          }
        };
      }else if(subsidiary && subsidiary.length >0 && segment && segment.length >0 && num_start_date && num_start_date.length >0){
        console.log('*****1899');
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
                    },
                    {
                      "terms": {
                          "model_id": [subsidiary]
                      }
                    }
                  ],
                  "must": {
                    "bool": {
                        "should": [
                            {
                                "terms": {
                                    "brand_id": [segment]
                                }
                            }
                        ]
                    }
                  }
              }
          }
        };
      }else if(subsidiary && subsidiary.length >0 && first_start_date && first_end_date){
        console.log('*****1888');
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
                        "model_id": [subsidiary]
                      }
                    }
                  ]
              }
          }
        };
      }else if(subsidiary && subsidiary.length >0  && first_start_date && first_end_date){
        console.log('*****1888');
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
                        "model_id" : [subsidiary]
                      }
                    }
                  ]
              }
          }
        };
      }else if(subsidiary && subsidiary.length >0  && num_start_date && num_start_date.length >0){
        console.log('*****1888');
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
                        "model_id" : [subsidiary]
                      }
                    }
                  ]
              }
          }
        };
      }else if(subsidiary && subsidiary.length >0){
        console.log('*****1888');
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
                        "model_id" : [subsidiary]
                      }
                    }
                  ]
              }
          }
        };
      }else if(segment && segment.length >0 && num_start_date && num_start_date.length >0){
        console.log('*****1888');
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
                        "brand_id": [segment]
                      }
                    }
                  ]
              }
          }
        };
      }else if(segment && segment.length >0 && first_start_date && first_end_date){
        // console.log('*****1.1');
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
                        "brand_id" : [segment]
                      }
                    }
                  ]
              }
          }
        };
      }else if(segment && segment.length >0 && num_start_date && num_start_date.length >0){
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
                        "brand_id" : [segment]
                      }
                    }
                  ]
              }
          }
        };
      }else if(segment && segment.length >0){
        console.log('*****1');
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
                        "brand_id" : [segment]
                      }
                    }
                  ]
              }
          }
        };
      }else if(num_start_date && num_start_date.length >0){
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
                  ]
              }
          }
        };
      }else if(first_start_date && first_end_date && !num_start_date){
        console.log('*****303');
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
      }else{
        // console.log('*****4');
        let last_end_date = moment().format('YYYY-MM-DD') + "T23:59:59.000";
        let last_star_date = "2021-09-20T23:59:59.000";
        console.log('*****6');
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


      let query_total: any;
      if(num_start_date){
        console.log('*****totl 4');
        query_total = {
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
      }else if(first_start_date && first_end_date){
        console.log('*****totl 3');
        query_total = {
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
      }
      // console.log('query', query);
      this.getDeviceMoreTouch(query, query_total, null);
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
          pdf.save('Estadisticas por dispositivos.pdf');
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


  getDeviceMoreTouch(query_search: any = null, query_total: any = null, event?:PageEvent){
    let num_start_date = this.form_device.get('date').value;
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
      query_total = query;
    }else{
      query = query_search;
    }
    
    console.log('query_total', query_total);
    console.log('query', query);
    // console.log('query', query);
    this.chart_single = [];
    // this.device_ranking = [];
    this.device_ranking_segment = [];

    this.apiService.getElasticSearchData(query_total).subscribe(
			data => {
				let data_elastic_total = data && data.hits && data.hits.hits ? data.hits.hits : [];

        let data_elastic_device_total = []; 
        data_elastic_total.forEach(element => {
          data_elastic_device_total.push(element._source)
        });
        
        this.device_ranking_segment = _.groupBy(data_elastic_device_total, function(item) {
          return item.subsidiary_name;
        });

        console.log('device_ranking_segment **', this.device_ranking_segment);

        this.apiService.getElasticSearchData(query).subscribe(
          data => {
            let data_elastic = data && data.hits && data.hits.hits ? data.hits.hits : [];
    
            let data_elastic_device = []; 
            data_elastic.forEach(element => {
              data_elastic_device.push(element._source)
            });
            // console.log('data_elastic_device', data_elastic_device);
            this.first_data_elastic = data_elastic_device;
            //**  Data Charts  */
            
            let device_more_touch = _.chain(data_elastic_device).groupBy("subsidiary_name").map((value, key) => ({
              name : value[0].subsidiary_name,
              internal_id: value[0].subsidiary_internal_id,
              sales_channel_name: value[0].sales_channel_name,
              value: _.countBy(value, 'subsidiary_name')
            })).value();
    
            let chart_clean_list: any[] = [];
    
            this.total_count_device = 0;
            device_more_touch.forEach(element => {
              let chart_clean = {
                'name' : element.name,
                'internal_id' : element.internal_id,
                'sales_channel_name' : element.sales_channel_name,
                'value' : element.value[element.name]
              }
              this.total_count_device = element.value[element.name]+this.total_count_device;
              chart_clean_list.push(chart_clean);
            });
    
            chart_clean_list = _.orderBy(chart_clean_list, ['value'], ['desc']);
    
            let chart_clean_total: any[] = [];
            chart_clean_list.forEach(element => {
              let value = (Number(element.value)*100)/Number(this.total_count_device);
    
              let chart_clean = {
                'name' : [element.internal_id+' '+element.name, element.sales_channel_name],
                'value' : this.utils.decimalAdjust('round', (value), -2),
              }
              chart_clean_total.push(chart_clean);
            });
    
            
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
                    console.log('brand', brand);
                    console.log('model', model);
                    
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
                        });
    
                        $('.chield-tick').find('text').css({'font-weight': 'unset', 'color': 'rgba(0, 0, 0, 0.6)'})
                    }, 50);
    
                    // console.log('div clone', chield_tick);
                  }
                  
                }); 
              }, 500);
              // console.log('this.chart__store', this.chart__store);
              let legend_segment = _.chain(data_elastic_device).groupBy("brand_name").map((value, key) => ({
                name : this.titleCaseWord(value[0].brand_name)
              })).value();
      
              let legend_model = _.chain(data_elastic_device).groupBy("model_id").map((value, key) => ({
                name : value[0].model_name
              })).value();
      
              this.legend_segment = this.utils.objToString(legend_segment);
              this.legend_model = this.utils.objToString(legend_model);
            }else{
              this.legend_segment = this.legend_segment_tmp;
              this.legend_model = this.legend_model_tmp;
            }
           
            this.device_ranking = [];
            let ranking=1;
            // console.log('data_elastic_device', data_elastic_device);
            let device_ranking = _.chain(data_elastic_device).groupBy("subsidiary_name").map((value, key) => ({
              ranking: ranking++,
              position : value,
              store: value[0].subsidiary_internal_id+' '+value[0].subsidiary_name,
              segment : value[0].sales_channel_name,
              // value: _.countBy(value, 'device_name'),
              interactions_1 : Number(this.device_ranking_segment[value[0].subsidiary_name]?.length),
              interactions_2: this.utils.decimalAdjust('round', ((value.length*100)/this.total_count_device), -2),
              interactions_3: value.length
            })).value();
    
            this.device_ranking = _.orderBy(device_ranking, ['interactions_3'], ['desc']);
    
            this.pageIndex = event && event.pageIndex ? event.pageIndex : 0;
            this.pageSize = event && event.pageSize ? event.pageSize : 10;
            this.length = this.device_ranking?.length;

            let devices = this.utils.filter(this.device_ranking, this.pageSize, this.pageIndex);
            this.dataSource = new MatTableDataSource(devices);
            this.spinner = false; 
            // console.log('this.dataSource.data', this.dataSource);
    
          },
          error => {
            console.log('error', error);
          }
        );

      },
			error => {
				console.log('error', error);
			}
		);

    return event;
  }

  getBrand(){
    this.filter_brand = [];
		this.apiService.getBrand().subscribe(
			data => {
				let list_brand = data.results;

        this.filter_brand = _.orderBy(list_brand, ['name'], ['asc']);

        console.log('list_subsidiaries', data);

        this.getDeviceMoreTouch(null, null, null);
      },
			error => {
				console.log('error', error);
			}
		);
  }


  getSegment(){
    
    let last_end_date = moment().format('YYYY-MM-DD') + "T23:59:59.000";
    let last_star_date = this.utils.dateStartElastic();
    

    let query:any;
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
    
    console.log('query', query);
    this.chart_single = [];

    this.apiService.getElasticSearchData(query).subscribe(
			data => {
        
				let data_elastic = data && data.hits && data.hits.hits ? data.hits.hits : [];

        let data_elastic_device = []; 
        data_elastic.forEach(element => {
          data_elastic_device.push(element._source)
        });
        //**  Data Charts  */
        this.filter_brand = _.chain(data_elastic_device).groupBy("brand_name").map((value, key) => ({
          id: value[0].brand_id,
          name : this.titleCaseWord(value[0].brand_name)
        })).value();

        this.filter_subsidiary = _.chain(data_elastic_device).groupBy("model_name").map((value, key) => ({
          id: value[0].model_id,
          name : value[0].model_name,
          brand: value[0].brand_id
        })).value();
        this.filter_subsidiary_tmp = this.filter_subsidiary;

        this.getDeviceMoreTouch(null, null, null);
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
    device_name_brand = device_name_brand.split("-", 2);
    return device_name_brand[0].replace(/\s/g, "");
  }

  selectedValue(event: MatSelectChange) {
    this.legend_segment_tmp = [];
    this.legend_segment_tmp.push(event.source.triggerValue);    
    // this.matSegment.close();
    // console.log(this.legend_segment);

    this.filter_subsidiary_tmp = this.filter_subsidiary;

    // console.log('event.source.triggerValue', event.source.triggerValue);
    if(event.source.triggerValue!=''){
      let segment = this.form_device.get('segment').value;
      this.filter_subsidiary_tmp = _.filter(this.filter_subsidiary, function(value){
        console.log('segment.length ', segment );
        return segment == value.brand;
        // if(segment.length > 1){
        //   console.log('aca 1', segment);
        //   // console.log('aca 1.1', value.brand);
        //   // console.log('_.includes(segment, value.brand)', _.includes(segment, value.brand))
        //   return _.includes(segment, String(value.brand));
        // }else{
        //   console.log('aca 2', segment);
        //   return segment == value.brand;
        // }
        
      });
      this.form_device.controls['subsidiary'].setValue('');
      console.log('this.filter_subsidiary_tmp', this.filter_subsidiary_tmp);
    }
    
  }

  selectedModel(event: MatSelectChange) {
    // this.matSubsidiary.close();
    // console.log(this.legend_segment);
    this.legend_model_tmp = [];
    this.legend_model_tmp.push(event.source.triggerValue);
  }

  resetForm(){
    this.form_device.reset();
    this.chart_single = [];
    this.dataSource = new MatTableDataSource([]);
    this.legend_segment = '';
    this.legend_model = '';
    this.legend_date = '';
    this.legend_date_range = '';
    this.total_count_device = null;
    this.button_detalle = false;
    this.filter_subsidiary_tmp = this.filter_subsidiary;
    this.form_device.controls['start_date'].disable();
    this.form_device.controls['end_date'].disable();
  }

  CleanDateRange(){
    this.form_device.controls['start_date'].setValue('');
    this.form_device.controls['end_date'].setValue('');
    this.initRangeDate();
    this.legend_date_range = '';
    // this.matDate.close();
  }

  CleanDate(){
    let start_date = this.form_device.get('start_date').value;
    let end_date = this.form_device.get('end_date').value;
    this.legend_date = '';
    this.legend_date_range = this.utils.getDateFormatDevice(start_date)+' - '+this.utils.getDateFormatDevice(end_date);
    // this.form_search.controls['date'].setValue('');    
  }
  random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  titleCaseWord(Word: string) {
    if (!Word) return Word;
    return Word[0].toUpperCase() + Word.substr(1).toLowerCase();
  }

  formatDataLabel(value )
  {
    return value + '%';
  }

  paginator_ranking(event?:PageEvent){
    console.log('event **', event)
    this.pageIndex = event && event.pageIndex ? event.pageIndex : 0;
    this.pageSize = event && event.pageSize ? event.pageSize : 10;
    this.length = this.device_ranking?.length;

    let devices = this.utils.filter(this.device_ranking, this.pageSize, this.pageIndex);
    this.dataSource = new MatTableDataSource(devices);

    return event;
  }


}
