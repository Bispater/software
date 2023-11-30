import { Component, OnInit, EventEmitter, ViewChild,  Input, ChangeDetectionStrategy, ChangeDetectorRef, SimpleChanges, Output } from '@angular/core';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import {MatTableDataSource} from '@angular/material/table';
/**table */
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import { ObjectService } from './../../../../services/object.service';
import { RankingDevice, DeviceElastic } from 'src/app/models';
import { MatSelectChange } from "@angular/material/select";
import { Utils } from '../../../../utils/utils';
import { HtmlParser } from '@angular/compiler';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class TableComponent implements OnInit  {

  @Input() data: string[];
  @Input() inputTabtable:any
  @Input() parentObjectChange:any
  @Input() tabCurrent:any
  @Input() table:any
  @Input() tableWithOutModel:any
  
  @Input() doc_count:any

  @Output() outPutTableSelect = new EventEmitter<any>();
  @Output() outPuttableWithOutModel = new EventEmitter<any>();
  @Input() InputSubsidiary:any




  

  public htmlTable:any
  public tableMap = []
  public totalTable:any


 
  rows: any[] = []
 
 columns: any[] = []
 
 enableSummary = true;
 summaryPosition = 'top';
 
  constructor( private objectService: ObjectService,   public utils: Utils, private cd: ChangeDetectorRef) { 

  }

  

  ngOnInit(): void {
    console.log('this.table',this.table)
    this.tableMap = this.table
    this.switch(this.tabCurrent)

  }

  ngOnChanges(changes: SimpleChanges) {
    // only run when property "data" changed
    if (changes['table']) {
      this.tableMap = this.table
      this.switch(this.tabCurrent)
      //this.tableMap = this.table
    }
  }

  //item seleccionado de tabla
  selectItem(event) {
    if(event.type == 'click') {
      this.outPutTableSelect.emit(event.row)
    }
  }
 


  switch (key) {
    switch ( key) {
      case 0:
        let myMap2 = new Map();
        for(let item of this.InputSubsidiary) {
          myMap2.set(item.name, item.internal_id)
        }   
        this.rows = []
        this.columns = [
          { prop: 'Ranking', width: 100}, 
          { prop: 'Marca' }, 
          { prop: 'Modelo'  },
          { prop: '% de interacciones'  }, 
          { prop: '# de interacciones' }, 
          { prop: 'Tienda con + interacción', width: 250 },
          { prop: 'Canal' }
        ];
        this.tableMap.forEach((element, index) => {
          myMap2.get(element.top_subsidiary.buckets[0].key)
          this.rows.push(
            {
              'object':element,
              'brand_id' : element.brand_id ,
              'channel_id' : element.channel_id ,
              'segment_id': element.segment_id,
              'equipment_id': element.equipment_id,
              'device_id': element.device_id,
              'subsidiary_id' : element.subsidiary_id ,
              'Ranking' : index + 1 ,
              'Marca' : element.brand.buckets[0].key, 
              'Modelo' : element.key,
              '% de interacciones' : this.avg(element.doc_count),
              '# de interacciones' : element.doc_count, 
              'Tienda con + interacción' :   myMap2.get(element.top_subsidiary.buckets[0].key) + ' ' + element.top_subsidiary.buckets[0].key, 
              'Canal' : element.top_subsidiary.buckets[0].channel.buckets[0].key
              
            });
        });
        //element.ast_equipment_id.buckets[0].last_parent_equipment_id.buckets[0].doc_count, 
        break;
      case 1:
        let myMap1 = new Map();
        for(let item of this.InputSubsidiary) {
          myMap1.set(item.name, item.internal_id)
        }   
        this.rows = []
        this.columns = [
          { prop: 'Ranking', width: 60  }, 
          { prop: 'Tienda' , width: 250}, 
          { prop: 'Canal' },
          { prop: '% de interacciones' }, 
          { prop: '# de interacciones' }
        ];
        this.tableMap.forEach((element, index) => {
          //console.log(element)
          this.rows.push(
            {
              'object':element,
              'brand_id' : element.brand_id ,
              'channel_id' : element.channel_id ,
              'segment_id': element.segment_id,
              'equipment_id': element.equipment_id,
              'device_id': element.device_id,
              'subsidiary_id' : element.subsidiary_id ,
              'Ranking' : index + 1, 
              'Tienda' : myMap1.get(element.top_subsidiary.buckets[0].key) + ' ' + element.top_subsidiary.buckets[0].key, 
              'Canal' : element.top_subsidiary.buckets[0].channel.buckets[0].key,
              '% de interacciones' : this.avg(element.doc_count),
              '# de interacciones' : element.doc_count
            });
        });
        break;
      case 2:
        let myMap0= new Map();
        for(let item of this.InputSubsidiary) {
          myMap0.set(item.name, item.internal_id)
        }   
        this.rows = []
        this.columns = [
          { prop: 'Ranking', width: 60  }, 
          { prop: 'Tienda' , width: 250}, 
          { prop: 'Canal' },
          { prop: '% de usuarios únicos' }, 
          { prop: '# de usuarios únicos' }, 
        ];
        this.tableMap.forEach((element, index) => {
          //console.log(element)
          this.rows.push(
            {
              'object':element,
              'brand_id' : element.brand_id ,
              'channel_id' : element.channel_id ,
              'segment_id': element.segment_id,
              'equipment_id': element.equipment_id,
              'device_id': element.device_id,
              'subsidiary_id' : element.subsidiary_id ,
              'Ranking' : index + 1, 
              'Tienda' : myMap0.get(element.top_subsidiary.buckets[0].key) + ' ' + element.top_subsidiary.buckets[0].key, 
              'Canal' : element.top_subsidiary.buckets[0].channel.buckets[0].key,
              '% de usuarios únicos' : this.avg(element.doc_count), 
              '# de usuarios únicos' : element.doc_count
            });
        });
       // console.log(this.rows)
        break;
      case 3:
      
        this.rows = []
        this.columns = [
          { prop: 'Ranking', width: 60  }, 
          { prop: 'Marca' }, 
          { prop: 'Modelo' },
          { prop: '% de interacciones' },
          { prop: '# de interacciones' }
        ];
        this.tableMap.forEach((element, index) => {
          this.rows.push(
            {
              'object':element,
              'brand_id' : element.brand_id ,
              'channel_id' : element.channel_id ,
              'segment_id': element.segment_id,
              'equipment_id': element.equipment_id,
              'device_id': element.device_id,
              'subsidiary_id' : element.subsidiary_id ,
              'Ranking' : index + 1, 
              'Marca' : element.brand.buckets[0].key, 
              'Modelo' : element.key,
              '% de interacciones' : this.avg(element.doc_count),
              '# de interacciones' : element.doc_count
            });
        });
        break;
      case 4:
        let myMap4 = new Map();
        for(let item of this.InputSubsidiary) {
          myMap4.set(item.name, item.internal_id)
        }   
        this.outPuttableWithOutModel.emit(this.tableWithOutModel)
        let myMap = new Map<number,string>();
        for(let item of this.tableWithOutModel) {
          myMap.set(item.key, item.doc_count)
        }
        this.rows = []
        this.columns = [
          { prop: 'Ranking',width: 60 }, 
          { prop: 'Tienda' , width: 250}, 
          { prop: 'Canal' },
          { prop: 'Total interacciones tienda' }, 
          { prop: '% interacciones dispositivo' },
          { prop: '# interacciones dispositivo' }
        ];
        this.totalTable = 0
        this.tableMap.forEach((element, index) => {
          //let myMap = new Map<string, number>();
          //this.totalTable += element.doc_count
          //console.log('element.key',element.key)
          this.rows.push(
            {
              'object':element,
              'brand_id' : element.brand_id ,
              'channel_id' : element.channel_id ,
              'segment_id': element.segment_id,
              'equipment_id': element.equipment_id,
              'device_id': element.device_id,
              'subsidiary_id' : element.subsidiary_id ,
              'Ranking' : index + 1, 
              'Tienda' : myMap4.get(element.top_subsidiary.buckets[0].key) + ' ' + element.top_subsidiary.buckets[0].key, 
              'Total interacciones tienda' : myMap.get(element.key),
              'Canal' : element.top_subsidiary.buckets[0].channel.buckets[0].key,
              '% interacciones dispositivo' : this.avg(element.doc_count),
              '# interacciones dispositivo' : element.doc_count
            });
        });
        console.log(this.totalTable)
        break;
      default: 
        // 
        break;
   }
  }

  //porcentaje de interacciones por dispositivo
  avg(qty:number){
    let result = 0;
    try{
      result = qty * 100 / this.doc_count;
    }catch(e){ console.log(e)}
    return result.toFixed(2) + ' %';
  }

}
