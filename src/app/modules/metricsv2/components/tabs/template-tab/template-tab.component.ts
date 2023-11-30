import { OverlayRef } from '@angular/cdk/overlay';
import { Component, OnInit, OnDestroy , ViewChild, TemplateRef, Input, 
  Output, ChangeDetectorRef, EventEmitter, SimpleChanges } from '@angular/core';
import {MatDialog, MatDialogRef, MatDialogConfig} from '@angular/material/dialog';
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';
import * as _ from "lodash";
import { Observable } from 'rxjs';
import { FileSaverService } from 'ngx-filesaver';
import { HttpClient, HttpParams } from '@angular/common/http';

import * as moment from 'moment';
import 'moment/locale/pt-br';
import { ApiService } from '../../../../../services/services.service';
import { ObjectService } from '../../../../../services/object.service';

import { Utils } from '../../../../../utils/utils';
import { environment } from '../../../../../../environments/environment';


import * as ExcelJS from 'exceljs';
import * as fs from 'file-saver';

declare var $:any; 

@Component({
  selector: 'template-tab',
  templateUrl: './template-tab.component.html',
  styleUrls: ['./template-tab.component.scss']
})

export class TemplateTabComponent implements OnInit, OnDestroy {
  
  @Input() tab: any;
  @Input() tabCurrent: any;
  @Input() filter:any
  @Input() responseDeviceEvent:any;
  @Input() chart:any
  @Input() table:any
  @Input() tableWithOutModel:any
  @Input() date:any
  @Input() arrayStringChannel:any
  @Input() arrayStringSegment:any
  @Input() arrayStringSubsidiary:any
  @Input() arrayModelString:any
  @Input() arrayBrandString:any
  @Input() totalInteracction:any
  @Input() doc_count:any
  @Input() unblocked:boolean = true
  @Input() disableSegment:boolean
  @Input() InputSubsidiary:any


  

  @Output() outPutSpinner = new EventEmitter<any>();

 
  
  public tableWithOutModelMapGlobal:any
  spinner: boolean;
  public myMap:any;

  //fecha por defecto
  public defaultDate:any
  public totalTable:any
  public arrayChannelstring:any = []
  public arraySegmentstring:any = []
  public arrayChannelId:any = []
  public arraySegmentId:any = []
  public arrayChannelIdString:any = []
  public arraySegmentIdString:any = []
  public equipmentDetail:any
  public unblockedVar:boolean

  private subsidiary_name = 'subsidiary_name'
  private model_name =  'model_name'
  private eventClick =  'click'
  private eventSwipe =  'swipe'
  public interaccionesTotales:any
  public tables_excel:any = []


   
  rows: any[] = []
 
 columns: any[] = []

  public channel_string:any

  //tabla row selected form component table
  public tableRowSelected:any;

  //pendiente borrar o no
  public responseChannel:any;

  //objectFilters
  private objectFilters: any;
  private preObjectSetTab:any;
  private info_facets:any;
  public arrayChannelString:any = []

  //set Default filter
  private limit:string = '10000'
  public event:string
  private channelIdIn: any

  public instance: any;

  @ViewChild('detail') dialogTemplate: TemplateRef<any>;

  /*
 @Input() inputTabtable:any
 @Input() parentObjectChange:any
 public outFormSearch: any = [];
  @ViewChild('matchannel') matchannel;
  @ViewChild('matDate') matDate;
  public button_detalle: boolean = false;
  public bgModal: string = 'bgModal2';
  public total_store_interacction: any; 
  public user_channel:any [] = [];
*/
  
  constructor( 
    private dialog: MatDialog,
    private apiService: ApiService,
    private ObjectService: ObjectService,
    public utils: Utils,
    private cdRef:ChangeDetectorRef,
    private _http: HttpClient,
    private _FileSaverService: FileSaverService
  ) {
    
  }

  ngOnDestroy() {
    //console.log('Items destroyed');
  }

  


 

  ngOnInit(): void {
    this.ObjectService.getSubsidiaries().subscribe( 
      data => { 
        //console.log('getSubsidiarie from tabtemplate', data)
        this.InputSubsidiary = data
      }
    )

    this.spinner = true

    //set 1 semana
    this.defaultDate = moment().subtract(7, 'days').format('YYYY-MM-DD') + '__' + moment().add('day',1).format('YYYY-MM-DD')

    this.date =  moment().subtract(7, 'days').format('DD/MM/YYYY') + ' - ' + moment().format('DD/MM/YYYY')
    
    this.style();
    
    //console.log(this.filter)
    this.filter[0].channel.forEach(element => {
      this.arrayChannelstring.push(element.name)
      this.arrayChannelId.push(element.id)
    });
    if(JSON.parse(localStorage.getItem('profileUser')).channel.length > 0){
    this.arrayStringChannel =  this.arrayChannelString.join(', ')
    //console.log((JSON.parse(localStorage.getItem('profileUser'))))
    this.arrayChannelIdString =  JSON.parse(localStorage.getItem('profileUser')).channel.join('__')/**/
    console.log(  this.arrayChannelIdString,  this.arrayStringChannel)
    } else {
      this.arrayStringChannel =  undefined  
      this.arrayChannelIdString = undefined
      this.arrayStringSegment =  undefined  
      this.arraySegmentIdString = undefined
  
      this.arrayStringChannel = 'Todos'
      this.arrayStringSegment = 'Todos'
    }
    


    //switch data to tab
    this.switchParent(this.tabCurrent);
  }

  onFormFilterOut(event){
    console.log(event)
    event.forEach(element => {
     this.arrayChannelString.push(element.name)
    });
    console.log(this.arrayChannelString.join(', '))
    //this.arrayChannelIdString.join(', ')
  }

   //switch to data of tab
   switchParent(tab:any) {
    switch (tab) {
      case 0:
        //examplet data '10000', 'click', '2022-01-31__2022-02-02', '2__15', 'model_name'
        this.event = this.eventClick
        this.info_facets = this.model_name
        this.setPreObjectSetTab(this.limit, this.event, this.defaultDate, this.arrayChannelIdString, this.info_facets,  undefined, undefined, undefined)
      break;
      case 1:
        $(".mat-tab-group.mat-primary .mat-ink-bar, .mat-tab-nav-bar.mat-primary .mat-ink-bar").css("background", "#FF3D00");
        this.event = 'swipe'
        this.info_facets = this.subsidiary_name
        this.setPreObjectSetTab(this.limit, this.event, this.defaultDate, this.arrayChannelIdString, this.info_facets, undefined, undefined, undefined)
        if(environment.production = false){
          console.log('switch tab ' + tab)
        }
      break;
      case 2:
        $(".mat-tab-group.mat-primary .mat-ink-bar, .mat-tab-nav-bar.mat-primary .mat-ink-bar").css("background", "#2FCBF1");
        this.event = 'user'
        this.info_facets = this.subsidiary_name
        this.setPreObjectSetTab(this.limit, this.event, this.defaultDate, this.arrayChannelIdString, this.info_facets, undefined, undefined, undefined )
        if(environment.production = false){
          console.log('switch tab ' + tab)
        }
      break;
      case 3:
        $(".mat-tab-group.mat-primary .mat-ink-bar, .mat-tab-nav-bar.mat-primary .mat-ink-bar").css("background", "#3f51b5");
        this.event = this.eventClick
        this.info_facets = this.model_name
        this.setPreObjectSetTab(this.limit, this.event, this.defaultDate, this.arrayChannelIdString, this.info_facets)
        if(environment.production = false){
          console.log('switch tab ' + tab)
        }
      break;
      case 4:
        $(".mat-tab-group.mat-primary .mat-ink-bar, .mat-tab-nav-bar.mat-primary .mat-ink-bar").css("background", "#FD6C98");
        this.event = this.eventClick
        this.info_facets = this.subsidiary_name
        this.spinner = false
        //this.setPreObjectSetTab(this.limit, this.event, this.defaultDate, null, this.info_facets)
        if(environment.production = false){
          console.log('switch tab ' + tab)
        }
      break;
    }
  }



  //event table row selected from component table
  outPutTableSelect(event){
    console.log(event)
    this.tableRowSelected = event
    this.openDialog( this.tableRowSelected );
  }
  
  setPreObjectSetTab(
    limit, 
    event, 
    created__range, 
    channel_id_in?, 
    info_facets?,
    subsidiary_id__in?,
    brand_id?,
    equipment_id?,
    model_name?){
      console.log(this.tabCurrent)
      if(this.tabCurrent == 4){
        this.preObjectSetTab = {
          limit: limit,
          event: event,
          created__range: created__range,
          channel_id_in:this.arrayChannelIdString,
          info_facets: this.info_facets,
          subsidiary_id__in:this.arraySegmentIdString,
          brand_id:brand_id,
          equipment_id:equipment_id,
          model_name:model_name
        }
      } else {
        this.preObjectSetTab = {
          limit: limit,
          event: event,
          created__range: created__range,
          channel_id_in: channel_id_in,
          info_facets: this.info_facets,
          subsidiary_id__in:this.arraySegmentIdString,
          brand_id:brand_id,
          equipment_id:equipment_id,
          model_name:model_name
        }
      }
  
    console.log(' this.preObjectSetTab', this.preObjectSetTab)
    this.getDeviceEvent(this.preObjectSetTab);
  }

  //call get device event
  getDeviceEvent(objectDeviceEvent) {
    console.log('objectDeviceEvent', objectDeviceEvent)
    if(this.tabCurrent == 4){ 
      this.preObjectSetTab = {
        limit: this.limit,
        event: this.event,
        created__range: objectDeviceEvent.created__range,
        channel_id_in: this.arrayChannelIdString,
        segment_id__in: this.arraySegmentIdString,
        info_facets: this.info_facets,
        subsidiary_id__in: objectDeviceEvent.subsidiary_id__in,
        brand_id: objectDeviceEvent.brand_id,
        parent_equipment_id: objectDeviceEvent.parent_equipment_id,
        model_name: objectDeviceEvent.model_name
      }

    } else { 
      this.preObjectSetTab = {
        limit: this.limit,
        event: this.event,
        created__range: objectDeviceEvent.created__range,
        channel_id_in: objectDeviceEvent.channel_id_in,
        info_facets: this.info_facets,
        subsidiary_id__in: objectDeviceEvent.subsidiary_id__in,
        brand_id: objectDeviceEvent.brand_id,
        parent_equipment_id: objectDeviceEvent.parent_equipment_id,
        model_name: objectDeviceEvent.model_name
      }
    }
    console.log(this.preObjectSetTab)
   
      this.apiService.getDeviceEvent(objectDeviceEvent).subscribe(
        data => {    
        
          switch (this.tabCurrent) {
            case 0:
              //this.chart = data.facets?.info.subsidiary_name?.buckets
              this.table = data.facets?.info.model_name?.buckets
              this.chart = data.facets?.info.model_name?.buckets
            break;
            case 1:
              this.table = data.facets?.info.subsidiary_name?.buckets
              this.chart = data.facets?.info.subsidiary_name?.buckets
           
            break;
            case 2:
              this.table = data.facets?.info.subsidiary_name?.buckets
              this.chart = data.facets?.info.subsidiary_name?.buckets
              
            break;
            case 3:
              this.table = data.facets?.info.model_name?.buckets
              this.chart = data.facets?.info.model_name?.buckets
               
            break;
            case 4:
              this.event = this.eventClick
              this.info_facets = this.subsidiary_name
              this.preObjectSetTab = {
                limit: this.limit,
                event: this.event,
                channel_id_in:this.arrayChannelIdString,
                info_facets: this.info_facets,
                created__range: objectDeviceEvent.created__range
              }
              this.apiService.getDeviceEvent(this.preObjectSetTab).subscribe(data2 => {
                this.totalTable = 0
                console.log('data 4', data2.facets?.info.subsidiary_name?.buckets)
                this.tableWithOutModel = data2.facets?.info.subsidiary_name?.buckets
                this.table = data.facets?.info.subsidiary_name?.buckets
             
                this.table.forEach(element => { 
                  this.totalTable += element.doc_count
                });
                this.chart = data.facets?.info.subsidiary_name?.buckets
                this.spinner = false
                this.disableSegment = true
              })
            break;
          }
        
          this.totalInteracction = data.facets?.info.​doc_count
          console.log( this.totalInteracction)
          this.doc_count = data.facets?.info.​doc_count
          this.ObjectService.setChart(this.chart)   
          if(this.tabCurrent != 4 ){
            this.spinner = false
          }
          
          this.ObjectService.setUnblocked(true)
          console.log('get devices event', data)
        
        },
        error => {
          console.log(error)
        }
      )
  }



  outPutChannelString(event){ 
 
    this.arrayStringChannel = event
  }

  outPutSegmentString(event){ 
 
    this.arrayStringSegment = event
  }


  outSubsidiaryString(event){ 
    //console.log(event)
    this.arrayStringSubsidiary = event
  }

  outModelString2(event){ 
   
    this.arrayModelString = event
    console.log(  this.arrayModelString )
  }

  outBrandString2(event){ 
    this.arrayBrandString = event
    console.log(  this.arrayBrandString )
  }

  //output from filter selected or filter default on init component filter
  outPutChannel(value) {
    this.ObjectService.setUnblocked(true)
    console.log('outPutChannel',value)
    /*let channel_id_in = value.channel.toString()
    let chanelSplit = channel_id_in.split('__');
    console.log(chanelSplit)*/
    this.preObjectSetTab = {
      limit: this.limit,
      event: this.event,
      created__range: value.created__range,
      channel_id_in: value.channel_id_in,
      segment_id__in: value.segment_id__in,
      info_facets: this.info_facets,
      subsidiary_id__in: value.subsidiary_id__in,
      brand_id: value.brand_id,
      parent_equipment_id: value.parent_equipment_id,
      model_name: this.arrayModelString
    }
    console.log(value.created__range)
    if(value.created__range != null){
      
      let created__range = value.created__range.toString()
      let dateSplit = created__range.split('__');
      this.date =  moment(dateSplit[0]).format('DD/MM/YYYY') + ' - ' + moment(dateSplit[1]).add('day', -1).format('DD/MM/YYYY')
    } else {
      //debug
   
      this.date =  moment().format('DD/MM/YYYY') + ' - ' + moment().add('day', -1).format('DD/MM/YYYY')
    }
    this.getDeviceEvent(this.preObjectSetTab);
  }
 
  outPutSpinnerFunction(event) {
    this.spinner = event
  }
 
  exportAsPDF(div_id){
    this.outPutSpinner.emit(true)
    setTimeout(() => {
     // $("#divTableSource").hide();
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
        pdf.save('informe-' + (this.tab).replaceAll(' ','_')+'-'+moment().format('YYYY_MM_DD-HH_mm') + '.pdf') ;
        setTimeout(() => {
          $("body, html").css("background", "#F6F6F6");
          $(".mat-elevation-z8").css("box-shadow", "0px 5px 5px -3px rgb(0 0 0 / 20%), 0px 8px 10px 1px rgb(0 0 0 / 14%), 0px 3px 14px 2px rgb(0 0 0 / 12%)");
          $("#btn_detalle").show();
          $("#divTableSource").show();
          $("#divTableSourcePrint").addClass('hide');
          this.outPutSpinner.emit(false)
        }, 300);
        
      }); 
    }, 800);

  }

  getDataDeviceExcelAsync(devices: any){   
    this.getDataDeviceExcel(devices, this.totalInteracction);  
  }

  getDataDeviceExcel(table: any = null,  totalInteracction){
    console.log('this.devices_excel', table);
      //let subsidiaries = this.tables_excel;
      this.tables_excel = table;
      let name_subsidiary: string = 'this.devices_excel.channel.name';
      let workbook = new ExcelJS.Workbook();
      let worksheet = workbook.addWorksheet(name_subsidiary);

      if( this.tabCurrent == 0 ){
        let myMap0= new Map();
        for(let item of this.InputSubsidiary) {
          myMap0.set(item.name, item.internal_id)
        }  
        //columns name
        let header=["Ranking", "Marca", "Modelo", "# interacciónes", "Tienda con + interacción", "% de interacciones", "Canal"];
        let headerRow = worksheet.addRow(header);

        headerRow.eachCell((cell, number) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'c5c5c5' }
          }
          cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
        });

        worksheet.columns = [
          {key: 'Ranking', width: 10 },
          {key: 'Marca', width: 20},
          {key: 'Modelo', width: 20},
          {key: '# de interacciones', width: 40},
          {key: 'Tienda con + interacción', width: 25},
          {key: '% de interacciones', width: 30},
          {key: 'Canal', width: 40}
        ]

        var self = this;
        let tables_excel = table;
        tables_excel.map(function(element: any, index){
          let Ranking = index + 1;
          let Marca = element.brand.buckets[0].key ;
          let Modelo = element.key ;
          let interactionsPercent   = ((element.doc_count * 100 /  totalInteracction).toFixed(3)).replace('.', ',') + '%';
          let interacciones2 = element.doc_count ;
          let interacciones3 = myMap0.get(element.top_subsidiary.buckets[0].key) + ' ' + element.top_subsidiary.buckets[0].key;
          let Segmento = element.top_subsidiary.buckets[0].channel.buckets[0].key;
          let temp = [Ranking, Marca, Modelo, interacciones2, interacciones3, interactionsPercent, Segmento];
          worksheet.addRow(temp);
        });
        //set downloadable file name
        let fname= name_subsidiary;
      }

      if( this.tabCurrent == 1 ){
        let myMap1= new Map();
        for(let item of this.InputSubsidiary) {
          myMap1.set(item.name, item.internal_id)
        }  
        //columns name
        let header=["Ranking", "Tienda", "Canal", "# interacciónes", "% de interacciones"];
        let headerRow = worksheet.addRow(header);

        headerRow.eachCell((cell, number) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'c5c5c5' }
          }
          cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
        });

        worksheet.columns = [
          {key: 'Ranking', width: 10 },
          {key: 'Tienda', width: 20},
          {key: 'Canal', width: 20},
          {key: '# de interacciones', width: 40},
          {key: '% de interacciones', width: 30}
        ]

        var self = this;
        let tables_excel = table;
        tables_excel.map(function(element: any, index){
          let Ranking = index + 1;
          let Tienda = myMap1.get(element.top_subsidiary.buckets[0].key) + ' ' + element.top_subsidiary.buckets[0].key ;
          let Canal = element.top_subsidiary.buckets[0].channel.buckets[0].key;
          let interactionsPercent   = ((element.doc_count * 100 /  totalInteracction).toFixed(3)).replace('.', ',') + '%';
          let interacciones2 = element.doc_count ;
          let temp = [Ranking, Tienda, Canal, interacciones2, interactionsPercent];
          worksheet.addRow(temp);
        });
        //set downloadable file name
        let fname= name_subsidiary;
      }

      if( this.tabCurrent == 2 ){
        let myMap2= new Map();
        for(let item of this.InputSubsidiary) {
          myMap2.set(item.name, item.internal_id)
        }  
        //columns name
        let header=["Ranking", "Tienda", "Canal", "% de usuarios únicos", "# de usuarios únicos"];
        let headerRow = worksheet.addRow(header);

        headerRow.eachCell((cell, number) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'c5c5c5' }
          }
          cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
        });

        worksheet.columns = [
          {key: 'Ranking', width: 10 },
          {key: 'Tienda', width: 20},
          {key: 'Canal', width: 20},
          {key: '% de usuarios únicos', width: 40},
          {key: '# de usuarios únicos', width: 30}
        ]

        var self = this;
        let tables_excel = table;
        tables_excel.map(function(element: any, index){
          let Ranking = index + 1;
          let Tienda =  myMap2.get(element.top_subsidiary.buckets[0].key) + ' ' + element.top_subsidiary.buckets[0].key;
          let Canal = element.top_subsidiary.buckets[0].channel.buckets[0].key;
          let interactionsPercent   = ((element.doc_count * 100 /  totalInteracction).toFixed(3)).replace('.', ',') + '%';
          let interacciones2 = element.doc_count ;
          let temp = [Ranking, Tienda, Canal, interacciones2, interactionsPercent];
          worksheet.addRow(temp);
        });
        //set downloadable file name
        let fname= name_subsidiary;
      }

      if( this.tabCurrent == 3 ){

        //columns name
        let header=["Ranking", "Marca", "Modelo", "% de interacciones", "# de interacciones"];
        let headerRow = worksheet.addRow(header);

        headerRow.eachCell((cell, number) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'c5c5c5' }
          }
          cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
        });

        worksheet.columns = [
          {key: 'Ranking', width: 10 },
          {key: 'Marca', width: 20},
          {key: 'Modelo', width: 20},
          {key: '% de interaccioness', width: 40},
          {key: '# de interacciones', width: 30}
        ]

        var self = this;
        let tables_excel = table;
        tables_excel.map(function(element: any, index){
          let Ranking = index + 1;
          let Marca = element.brand.buckets[0].key;
          let Modelo = element.key;
          let interactionsPercent   = ((element.doc_count * 100 /  totalInteracction).toFixed(3)).replace('.', ',') + '%';
          let interacciones2 = element.doc_count ;
          let temp = [Ranking, Marca, Modelo, interacciones2, interactionsPercent];
          worksheet.addRow(temp);
        });
        //set downloadable file name
        let fname= name_subsidiary;
      }

      if( this.tabCurrent == 4 ){
        let myMap = new Map();
        for(let item of this.tableWithOutModel) {
          myMap.set(item.key, item.doc_count)
        }   

        let myMap4 = new Map();
        for(let item of this.InputSubsidiary) {
          myMap4.set(item.name, item.internal_id)
        }  
        //columns name
        let header=["Ranking", "Tienda", "Canal", "Total interacciones tienda", "% interacciones dispositivo", "# interacciones dispositivo"];
        let headerRow = worksheet.addRow(header);

        headerRow.eachCell((cell, number) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'c5c5c5' }
          }
          cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
        });

        worksheet.columns = [
          {key: 'Ranking', width: 10 },
          {key: 'Tienda', width: 20},
          {key: 'Canal', width: 20},
          {key: 'Total interacciones tienda', width: 40},
          {key: '% interacciones dispositivo', width: 30},
          {key: '# interacciones dispositivo', width: 30}
        ]

        var self = this;
        let tables_excel = table;
    
        tables_excel.map(function(element: any, index){
           
       
          let Ranking = index + 1;
          let Tienda = myMap4.get(element.top_subsidiary.buckets[0].key) + ' ' + element.top_subsidiary.buckets[0].key ;
          let Canal = element.top_subsidiary.buckets[0].channel.buckets[0].key;
          let interactionsPercent   = ((element.doc_count * 100 /  totalInteracction).toFixed(3)).replace('.', ',') + '%';
          let interacciones2 = element.doc_count ;
          let interacciones3 = myMap.get(element.key) //myMap.get(element.key);
          let temp = [Ranking, Tienda, Canal, interacciones3, interactionsPercent, interacciones2];
          worksheet.addRow(temp);
        });
        //set downloadable file name
        let fname= name_subsidiary;
      }






      //add data and file name and download
      workbook.xlsx.writeBuffer().then((data) => {
        let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        fs.saveAs(blob, (this.tab).replaceAll(' ','_')+'-'+moment().format('YYYY_MM_DD-HH_mm')+'.xlsx');
      });
}

  outPuttableWithOutModel2(event){
    this.tableWithOutModelMapGlobal = event
  console.log('outPuttableWithOutModel2',event);
    this.myMap = new Map<string,any>();
    for(let item of  this.tableWithOutModelMapGlobal) {
      this.myMap.set(item.key, item.doc_count)
    }
  }


  getMap(key){
    return this.myMap.get(key)
  }



  openDialog(data) {    
    console.log('recibido tabla seleccionada desde table', data)
    this.dialog.open(this.dialogTemplate, {
      width: '100%',
      height: '90%',
      autoFocus: false, 
      panelClass: 'bgModal',
      data: data
    }); 
    console.log( data.object.last_parent_equipment_id.buckets[0].key)
    this.getEquipmentDetail( data.object.last_parent_equipment_id.buckets[0].key, data.Modelo)
  }


  //recibe out from from pestaña 4
  formFilter(event){
    console.log(event)
    //this.setPreObjectTab4(event);
  }
  

  getEquipmentDetail(id, modelo){
    console.log('modelo', modelo)
    console.log(this.preObjectSetTab)
    this.preObjectSetTab['model_name'] = modelo

    this.apiService.getEquipmentDetail(this.preObjectSetTab, id).subscribe(
      data => {
        this.equipmentDetail = []
        this.equipmentDetail = data
        this.interaccionesTotales =   this.equipmentDetail.facets.info.doc_count
        console.log('equipment detail', data)
        this.tableModal(this.equipmentDetail.facets.info.subsidiary_name.buckets, this.interaccionesTotales)
      },
      error => {
        console.log(error)
      }
    )
  
    
  }



  tableModal(table, totalDeviceIntreaction?) {
    let tableModal= new Map();
    for(let item of this.InputSubsidiary) {
      tableModal.set(item.name, item.internal_id)
    }  
    //console.log('table modal', table, totalDeviceIntreaction)
    this.rows = []
    this.columns = [
      { prop: 'Ranking', width: 40 }, 
      { prop: 'Tienda' }, 
      { prop: 'Canal' },
      { prop: '% interacciones dispositivo' }, 
      { prop: '# interacciones dispositivo' }
    ];
    table.forEach((element, index) => {   
      this.rows.push(
        {
          'object':'element',
          'equipment_id': 'element',
          'Ranking' :  index + 1 ,
          'Tienda' : tableModal.get(element.key) +' ' + element.key,
          'Canal' : element.channel.buckets[0].key,
          '% interacciones dispositivo' : (element.doc_count * 100 / totalDeviceIntreaction).toFixed(2)  + '%',
          '# interacciones dispositivo' : element.doc_count
        });
    });
   
  }

      //porcentaje de interacciones por dispositivo
      avg(qty:number){
        let result = 0;
        try{
          result = qty * 100 / this.doc_count;
        }catch(e){ console.log(e)}
        return result.toFixed(2) + ' %';
      }

  onSelect(event) {
    console.log(event);
  }

  style(){
    $(".mat-tab-group.mat-primary .mat-ink-bar, .mat-tab-nav-bar.mat-primary .mat-ink-bar").css("background", "#42E8B4");
  }





 

}
