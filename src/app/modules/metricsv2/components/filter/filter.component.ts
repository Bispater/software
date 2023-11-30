import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { ApiService } from './../../../../services/services.service';
import { ObjectService } from './../../../../services/object.service';
import {FormControl, FormGroup, Validators, FormBuilder} from '@angular/forms';
import { Utils } from '../../../../utils/utils';
import 'moment/locale/es'  // without this line it didn't work

moment.locale('es');

//node_modules/moment/locale/{LANG}.js
import * as _ from "lodash";
import * as moment from 'moment';

declare var $:any;


@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})



export class FilterComponent implements OnInit {

  //Recibe filtros cargados de padre
  @Input() filter;
  @Input() disableSegment:boolean
  @Input() chart:any
  
  @Input() unblocked:any;

  //output datefilter to parent
  @Output() outChannelString = new EventEmitter<any>();
  @Output() outSegmentString = new EventEmitter<any>();
  @Output() outSubsidiaryString = new EventEmitter<any>();

  @Output() outBrandString = new EventEmitter<any>();
  @Output() outModelString = new EventEmitter<any>();

  //output form general
  @Output() outFormGeneral = new EventEmitter<any>();

  //boolean queqe service call
  //@Output() unblocked = new EventEmitter<any>();


  public outChannelString2:any
  public outSegmentString2:any
  public unblockedBoolean:boolean
  public disableSegmentBoolean:boolean

  //tab actual
  @Input() tabCurrent;

  //output datefilter to parent
  @Output() outDateFilter = new EventEmitter<any>();

  @Output() outPutSpinner = new EventEmitter<any>();

  @Output() formFilter = new EventEmitter<any>();

  @Output() formFilterOut = new EventEmitter<any>();
  //array channel
  public filter_channel = [];
  public filter_channel2 = [];

  public filter_segment= [];

  public arrayFilter = [];

  //array filter_subsidiary_tmp
  public filter_subsidiary_tmp:any

  public filter_model_tmp:any

  public brandsNoFilter:any = [];
  public brandsFilter:any = [];
  

  //output formfilter to parent
  @Output() outFormSearch = new EventEmitter<any>();


  public form_search : FormGroup;
  @Input() inputTab:any

  public rangeDate: any
  public user_channel:any [] = [];

  public legend_subsidiary: any = ['Todas las tiendas'];
  public legend_subsidiary_tmp: any;
  public filter_subsidiary: any[] = [];
  public legend_channel: any;
  public legend_channel_tmp: any;
  public instance:any;
  public initComponent:boolean

  selected: any;
  alwaysShowCalendars: boolean;


  //pestaña 4
  public filter_brand: any[] = [];

  
  public legend_segment_tmp: any;
  public legend_model_tmp: any;

  ranges: any = {
    'Hoy': [moment(), moment()],
    'Ayer': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Últimos 3 Días': [moment().subtract(3, 'days'), moment()],
    'Últimos 30 Días': [moment().subtract(29, 'days'), moment()],
    'Este Mes': [moment().startOf('month'), moment().endOf('month')],
    'Último Mes': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
  }
  invalidDates: moment.Moment[] = [moment().add(2, 'days'), moment().add(3, 'days'), moment().add(5, 'days')];
  isInvalidDate = (m: moment.Moment) =>  {
    return this.invalidDates.some(d => d.isSame(m, 'day') )
  }

  locale = {
    format: 'MM/DD/YYYY', // could be 'YYYY-MM-DDTHH:mm:ss.SSSSZ'
    displayFormat: 'DD/MM/YYYY', // default is format value
    direction: 'ltr', // could be rtl
    weekLabel: 'W',
    separator: '  ', // default is ' - '
    cancelLabel: 'Cancelar', // detault is 'Cancel'
    applyLabel: 'Aplicar', // detault is 'Apply'
    clearLabel: 'Clear', // detault is 'Clear'
    customRangeLabel: 'Personalizado',
    daysOfWeek: moment.weekdaysMin(),
    monthNames: moment.monthsShort(),
    locale:'es',
    firstDay: 1 // first day is monday
}

  maxDate =  moment()
  minDate = moment().add(-4, 'month');
  
  public id_channel: any;
  public string_channel: string;
  public string_segment: string;
  //selected: {startDate: 10, endDate: 20};

  constructor(
    private apiService: ApiService,
    private objectService: ObjectService,
    public utils: Utils,
    private formBuilder: FormBuilder
    ) { 
    this.alwaysShowCalendars = true;
    //moment.locale('es');
  }


  

  ngOnInit(): void {
   
    //console.log(this.unblocked)
    //this.unblocked = this.unblocked
    this.disableSegment = false
  
    this.instance =  moment().format('HH:mm:ss');
    this.getUnblocked();
    this.initComponent = true

    moment.locale('es');

    let channelLogin = JSON.parse(localStorage.getItem('profileUser')).channel

  
    for(let item2 of  this.filter[0].channel) {
      for (let item1 of channelLogin ) {
        if(item1 == item2.id){
          this.filter_channel.push(item2)
        }
      }
    }

    console.log('(this.filter_channel)', this.filter_channel)
    const dataArr = new Set(this.filter_channel);
    this.filter_channel2 = [...dataArr]; 
    console.log(this.filter_channel)
    this.formFilterOut.emit(this.filter_channel)

    this.initForm()

    //this.unblockedBoolean = this.unblocked
    this.form_search.valueChanges.subscribe(x => {  
     
    }) 

    if(this.tabCurrent == 4){
      this.getBrand()
    }
    let arrayChannelIdString =  JSON.parse(localStorage.getItem('profileUser')).channel.join(',')
    this.getSegmentSubsidiariesList(arrayChannelIdString)
   
  }

  getSubsidiary(internal_id__gt?){
    this.apiService.getSubsidiarynames(this.form_search.controls['channel'].value
    , internal_id__gt).subscribe(
      data => {
        console.log(data)
        this.filter_subsidiary_tmp = data.results
      }, error => {
        console.log(error)

      }
    )
  }

  getSegmentSubsidiariesList(value?) {
    //this.list_segment = [];
    //this.list_segment_tmp = [];
    this.apiService.getSegment(value).subscribe(
      data => {
        this.filter_segment = data.results;
        console.log('',data)
      },
      error => {
        console.log('error', error);
      }
    );
  }


  getUnblocked(){
    this.objectService.getUnblocked().subscribe(
      data => {
        console.log(data)
        this.unblocked = data
      }
    )
  }

  ngOnChanges(changes: SimpleChanges) {
  
  }

  changeDate(event){
    this.objectService.setUnblocked(true)
    //this.outPutSpinner.emit(true)
    console.log('chage date', event)
    if(event.startDate != null){
      let dateEvent = [
        { 
          startDate: moment(event.startDate._d).format('YYYY-MM-DD'), 
          endDate: moment(event.endDate._d).add('day',1).format('YYYY-MM-DD')
        }
      ]
      this.rangeDate = dateEvent[0].startDate + '__' +dateEvent[0].endDate
      this.form_search.controls['created__range'].setValue(this.rangeDate);
    } else {
    } 
    //this.sendFilterToParent(this.form_search.value)
  }

  selectedSubsidiary(event: any) {
    this.form_search.controls['subsidiary_id__in'].setValue(event.value);
    console.log(this.form_search.value)
    this.outSubsidiaryString.emit(event.source.triggerValue);
   //this.sendFilterToParent(this.form_search.value)
  }

  initForm(){

    this.form_search = this.formBuilder.group({
      subsidiary:[null],
      segment: [null],
      channel: [null],
      channelall:[null], 
      brand_id:[null], 
      model_name:[null], 
      equipment_id:[null], 
      parent_equipment_id:[null], 
      created__range:[null, Validators.required],
      subsidiary_id__in: [null]
    });     
  }


  submit(){
    console.log(this.form_search.value)
    this.sendFilterToParent(this.form_search.value)
  }


  resetForm(){
    this.form_search.reset()
    this.form_search.controls['created__range'].setValue(this.rangeDate);
  }



  //sendFilters to parent
  sendFilterToParent(form){
 
    this.outPutSpinner.emit(true)
    console.log(form)
    //let formParent = { }
    if( this.form_search.controls['created__range'].value == null ){
      let formParent = { }
      let lastWeek = moment().subtract(7, 'days').format('YYYY-MM-DD') + '__' + moment().add('day',1).format('YYYY-MM-DD')
      if(this.tabCurrent == 4){
        formParent = {
          created__range: this.form_search.controls['created__range'].value,
          parent_equipment_id: this.form_search.controls['parent_equipment_id'].value,
        }
      }
      if(this.tabCurrent == 3){
       // this.unblocked = false
        console.log('llegó al 3')
        formParent = {
          created__range: this.form_search.controls['created__range'].value,
          channel_id_in: this.form_search.controls['channel'].value,
          segment_id_in: this.form_search.controls['segment'].value,
          subsidiary_id__in: this.form_search.controls['subsidiary_id__in'].value,
        }
        this.outFormSearch.emit(formParent);
      }
      if (this.tabCurrent != 3 || this.tabCurrent != 4){
       
        let joinChannel = form.channel.join("__")
        let joinSegment = form.segment.join("__")
        formParent = {
          created__range: lastWeek,
          channel_id_in: joinChannel,
          segment_id__in: joinSegment
        }
     
        this.outFormSearch.emit(formParent);
      } else {
        console.log('form last', form )
        let joinChannel = form.channel
        let joinSegment = form.segment
        formParent = {
          created__range: lastWeek,
          channel_id_in: joinChannel,
          segment_id__in: joinSegment
        }
        console.log('llegó aca 3333')
        this.outFormSearch.emit(formParent);
      }   
    } else {
      let formParent = { }
        if(this.tabCurrent != 4){
          
          if(form.channel != undefined || form.channel != null){
            if(this.tabCurrent != 3){
              console.log('last')
              let joinChannel = form.channel.join("__")
              if(form.segment != undefined){ 
                let joinSegment = form.segment.join("__")
                formParent = {
                  created__range: form.created__range,
                  channel_id_in: joinChannel,
                  segment_id__in: joinSegment
                }
              } else {
               
                formParent = {
                  created__range: form.created__range,
                  channel_id_in: joinChannel
                }
              }
              
             
         
            } else {
              console.log(this.form_search.controls['channel'].value)
              formParent = {
                created__range: form.created__range,
                channel_id_in: this.form_search.controls['channel'].value,
                segment_id__in: this.form_search.controls['segment'].value,
                subsidiary_id__in: this.form_search.controls['subsidiary_id__in'].value,
              }
            }
            
         
          } else {
            let joinChannel = form.channel.join("__")
            formParent = {
              created__range: form.created__range,
              channel_id_in: joinChannel
            }
            /*console.log(arrayChannelIdString)
            formParent = {
              created__range: form.created__range,
              channel_id_in: arrayChannelIdString
            }*/
            if(form.segment != undefined){ 
              let joinChannel = form.channel.join("__")
              let joinSegment = form.segment.join("__")
              formParent = {
                created__range: form.created__range,
                channel_id__in: joinChannel,
                segment_id__in: joinSegment
              }
            } 
            

          }
        } 

      if(this.tabCurrent == 4){  
        let joinChannel = []
        this.filter_channel.forEach(element => {
          joinChannel.push(element.id)
        });
        let joinChannelJoin = joinChannel.join("__")
        //let joinSegment = form.segment.join("__")  
        formParent = {
          created__range: this.form_search.controls['created__range'].value,
          parent_equipment_id: this.form_search.controls['parent_equipment_id'].value,
          channel_id_in: joinChannelJoin
        }
        console.log('llegó aca 4')
      }
     //this.outChannelString.emit(this.outChannelString2);
    this.outFormSearch.emit(formParent);
    }
    this.unblocked = false
    this.disableSegment = false
  }

  toggleAllSegments(event, deactivate:boolean){
 
  
    if(deactivate == true ){
      this.form_search.controls['channelall'].setValue({value: false})
      //
    } else {
      this.form_search.controls['channel'].setValue(null);
    }

  }

  blockSegment(boolean?){
    /*console.log('this.form_search.controls', this.form_search.controls['channel'].value)
    if(this.form_search.controls['channel'].value != null){
      if( 
        this.form_search.controls['channel'].value.length != 0){
          console.log('diferente 0')
          //this.disableSegment = false
          this.form_search.controls['segment'].disable()
        
         } else {
          console.log('es  0')
          this.form_search.controls['segment'].enable()
          //this.disableSegment = true
         }
        
     
     }*/
 
  
 
  }

  //channel selected event
  selectedValue(event: any) {
    this.outSegmentString.emit(null);
    this.form_search.controls['segment'].reset()
  if(this.form_search.controls['channel'].value.length != 0){
    this.form_search.controls['segment'].reset()
    //this.form_search.controls['segment'].disable()
  } else {
    this.form_search.controls['segment'].enable()
  }



    this.getSegmentSubsidiariesList(event.value) 
    this.toggleAllSegments(null, true)
    console.log(this.form_search.value)
 
    if(this.tabCurrent == 3){
      this.objectService.setUnblocked(false)
      //this.outPutSpinner.emit(true)
      console.log(event.value)
      //let segmentJoin = this.form_search.controls['segment'].value.join(",")
     //this.getSubsidiary(event.value);
      this.form_search.controls['channel'].setValue(event.value);
      console.log(this.form_search.value)
      let subsidiariesNotFilter = []
      this.filter[1].subsidiary.forEach(element => {
          //console.log('element',element.subsidiaries)
          for(let item of element.subsidiaries){
            subsidiariesNotFilter.push(item)
          }
      });
      this.filter_subsidiary_tmp = subsidiariesNotFilter.filter(item => item.channel == +event.value.toString())
      this.outChannelString.emit(event.source.triggerValue);
      //this.unblocked.emit(false)
      //this.sendFilterToParent(this.form_search.value)
    } else {
     
      //this.outPutSpinner.emit(true)
      console.log(+event.value.toString())
      let arrayEvent = []
      arrayEvent.push(event.value)
      console.log(arrayEvent)
  
      let subsidiariesNotFilter = []
      this.filter[1].subsidiary.forEach(element => {
          //console.log('element',element.subsidiaries)
          for(let item of element.subsidiaries){
            subsidiariesNotFilter.push(item)
          }
      });
  
      this.filter_subsidiary_tmp = subsidiariesNotFilter.filter(item => item.channel == +event.value.toString())
      this.string_channel = ''
      this.string_channel = event.source.triggerValue
      this.outChannelString2 = event.source.triggerValue
      this.outChannelString.emit(this.outChannelString2);
      let arraychanel = []
      arraychanel  = event.value
      try {
        this.id_channel  = arraychanel.join("__")
      } catch (error) {
        
      }
      //this.unblocked.emit(false)
      //this.sendFilterToParent(this.form_search.value)
  
    }
  }


  //selectedSegment selected event
  selectedSegment(event: any) {
    
    if(this.form_search.controls['segment'].value.length != 0){
        //this.form_search.controls['channel'].disable()
    } else {
      this.form_search.controls['channel'].enable()
    }

    if(this.tabCurrent == 3){
      console.log(this.form_search.value)
      this.objectService.setUnblocked(false)
      console.log(event.value)
      let segmentJoin = this.form_search.controls['segment'].value.join(",")
      console.log(segmentJoin)
     this.getSubsidiary(segmentJoin);
      //this.form_search.controls['segment'].setValue(event.value);
      console.log(this.form_search.value)
      this.outSegmentString.emit(event.source.triggerValue);
    } else {
      console.log(this.form_search.value)
      //this.form_search.controls['segment'].setValue(event.value);
      let segmentJoin = this.form_search.controls['segment'].value.join(",")
      console.log(+event.value.toString())
      let arrayEvent = []
      arrayEvent.push(event.value)
      console.log(arrayEvent)
      this.string_segment = ''
      this.string_segment = event.source.triggerValue
      this.outSegmentString2 = event.source.triggerValue
      this.outSegmentString.emit(this.outSegmentString2);
      let arraysegment = []
      arraysegment  = event.value
      try {
        this.id_channel  = arraysegment.join("__")
      } catch (error) {
        
      }
  
    }
  }



  selectedValueBrand(event) {
    //this.unblocked.emit(false)
    this.unblocked = false
    console.log(event.source.triggerValue)
    this.outBrandString.emit(event.source.triggerValue);
    this.getMoldel(event.value)
  }

  //get modelos 
  getMoldel(id){
    this.apiService.getModels(id).subscribe(
      data => {
      const key = 'name';
      const arrayUniqueByKey = [...new Map(data.map(item => [item[key], item])).values()];
      this.filter_model_tmp = arrayUniqueByKey
      },
      error => {
        console.log(error)
      }
    )
  }

 

  selectedModel(event) {
    console.log(event.source.triggerValue)
    this.outModelString.emit(event.source.triggerValue);
    this.form_search.controls['model_name'].setValue(event.source.triggerValue);
  }


  getBrand(){
    this.apiService.getBrands().subscribe(
      data => {
        this.brandsFilter = data
      },
      error => {
        console.log('data', error);
      }
    )
  }

   
  titleCaseWord(Word: string) {
    if (!Word) return Word;
    return Word[0].toUpperCase() + Word.substr(1).toLowerCase();
  }

  

}
