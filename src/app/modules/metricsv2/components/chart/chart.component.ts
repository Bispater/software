import { Component, Output, EventEmitter, Input, SimpleChanges } from '@angular/core';
import { ObjectService } from './../../../../services/object.service';
import { Pipe } from '@angular/core';
import {DecimalPipe} from "@angular/common";

declare var $:any;

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']  
})

export class ChartComponent {
  
  @Input() tabCurrent:any
  @Input() filter;
  @Output() messageEvent = new EventEmitter<any[]>();
  @Input() chart:any
  @Input() totalInteracction:any
  @Input() date:any
  @Input() arrayStringChannel:any
  @Input() arrayStringSegment:any
  @Input() arrayStringSubsidiary:any
  @Input() arrayModelString:any
  @Input() arrayBrandString:any
  @Input() InputSubsidiary:any

  


  public arrayStringSubsidiary2:any
  public totalForChart:any
  public spinner:boolean
  public myUniqueArray
  public arrayChartComplete: any[]

  chart_single: any[];
  single: any;
  multi: any[];
  view: any[] = [];//0, 400

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  width:any;
  Height:any
  showLegend = false;
  showXAxisLabel = true;
  xAxisLabel = ' ';
  showYAxisLabel = true;
  yAxisLabel = 'porcentaje de interacciones %';
  chartsActive:boolean = false
  colorScheme:any;
  public first:boolean

  constructor(private objectService: ObjectService) { }

  sendMessage() {
    this.messageEvent.emit(this.chart_single)
  }

  onSelect(event) {
    console.log(event);
  }

  ngOnInit(): void {
    //console.log(this.totalInteracction)
    //this.spinner = true
  
    this.totalForChart = this.totalInteracction
    this.setStyle()
    //console.log(this.filter)
    this.filter[0].channel.forEach(element => {
      //console.log(element.names)
    });
    this.switchParent(this.tabCurrent);

    this.arrayStringSubsidiary2 = this.arrayStringSubsidiary
  }

  
  
  yAxisTickFormatting(val) {
    return val + '%';
  }

  formatDataLabel(value)
  {

    //console.log(value, 'this.totalForChart',this.totalForChart )
    return value + '%' ;
  }

  percentTickFormatting(val: any) {
    //console.log(val)
    return val.toLocaleString();
  }

  getCharts(){
    let myMap = new Map();
    this.arrayChartComplete = []

    console.log('InputSubsidiary', this.InputSubsidiary)
    this.InputSubsidiary.forEach((item) => {
      myMap.set(item.name, item.internal_id)
    });

     
    this.chart.forEach(element => {
      let item = {
        'name' :myMap.get(element.top_subsidiary.buckets[0].key) + ' ' + element.top_subsidiary.buckets[0].key, 
        'percent': (element.doc_count * 100 / this.totalInteracction).toFixed(2),
        'total': element.doc_count,
        'top': myMap.get(element.top_subsidiary.buckets[0].key) + ' ' + element.top_subsidiary.buckets[0].key
      }
      this.arrayChartComplete.push(item)
    });

   
    console.log(this.arrayChartComplete)
    
  
    let singleArray = []
    //console.log(this.chart)
    if(this.tabCurrent == 1  || this.tabCurrent == 2 || this.tabCurrent == 4){
   
      for(let item of this.arrayChartComplete){
        let percent = (item.total * 100 / this.totalInteracction).toFixed(2)
        singleArray.push({'name' : item.top, 'value' : percent});
      }
     
   
      
    } 
    else {
      for(let item of this.chart){
     
        let percent = (item.doc_count * 100 / this.totalInteracction).toFixed(2)
        singleArray.push({'name' : item?.brand.buckets[0].key + ' ' + item.key, 'value' : percent});
      }

    }
 
    if(this.tabCurrent == 0 || this.tabCurrent != 4) {

      if(singleArray.length < 6){
        let lengthArray = singleArray.length
        let rest = 6 - lengthArray
        for(let i = 0; i < rest +10; i++){
        
          let nameEjeX: any;
          for (let index = 0; index < i; index++) {
            nameEjeX = nameEjeX + ' ';
            singleArray.push({'name' : nameEjeX, 'value' :'0'})
          }
      
        }
        this.single = singleArray.slice(0, 6);
        //console.log(' this.single', this.single)
      } else {
        this.single = singleArray.slice(0, 6);
        //console.log(' this.single 2', this.single)
      }
      setTimeout(() => {
        $('.textDataLabel').each(function() {    
          if(this.innerHTML.replaceAll(' ','') == '0%') {
            $(this).hide()
          } 
        }); 
       
        $(".tick").find( "text" ).each(function() {      
          var text = $(this).text();
          if(!$.isNumeric(text)){
            $(this).text(text.replace('undefined', ' ')); 
          }  
        }); 
  
        $("g").find( ".tick" ).each(function() {
          var text = $(this).find( "text" ).text();
          if(!$.isNumeric(text)){
            //var name_ejeX = text.split(' ');
            var name_ejeX:any = []
          
  
            for(let item of  text.split(' ')){
              if(item != ''){
                name_ejeX.push(item)
              }
            }


            this.myUniqueArray = [...new Set(name_ejeX)];
  
            console.log('sucursal', this.myUniqueArray)
            
            if(  this.myUniqueArray[1] != undefined ){
              let empty = [' ']
              var brand =  this.myUniqueArray[0] + empty + this.myUniqueArray[1] ;
            } else {
              let empty = [' ']
              var brand = this.myUniqueArray[2] != undefined ?  this.myUniqueArray[2] : ' '
            }
            if(this.myUniqueArray.length == 1){
              var brand =  this.myUniqueArray[0];
            }
           var model:any
            var modelComplete:any
           for(let item of name_ejeX){
             if(item != name_ejeX[0]){
              // console.log(item)
        
              //modelComplete.join("", item)
             }
             
           }
          // console.log(model)
  
              model = (name_ejeX[1] != undefined ? name_ejeX[1] : '') + ' ' +
                      (name_ejeX[2] != undefined ? name_ejeX[2] : '') + ' ' +
                      (name_ejeX[3] != undefined ? name_ejeX[3] : '') + ' ' +
                      (name_ejeX[4] != undefined ? name_ejeX[4] : '') + ' ' +
                      (name_ejeX[5] != undefined ? name_ejeX[5] : '') 
            //a ? b : c
             //var c = (a < b) ? "a is less than b"  : "a is not less than b";
            
            $(this).find( "text" ).text(text.replace(text, brand)).css('font-weight', 'bold');; 
            let div = $(this).clone().addClass('chield-tick'); 
            $("g").find( $(this)).prepend(div).html();
            $(this).closest('g').prepend(div).html();
            $(this).find('.chield-tick').find('text').text(brand.replace(brand, model));
            setTimeout(function() {
                $('.chield-tick').attr({
                  transform: 'translate(0.5, 20)'
                }).css('font-weight', 'bold');
            }, 50);
          }    
        }); 
      }, 500);
    } else {

      if(this.tabCurrent == 4){
        

        if(singleArray.length < 6){
          let lengthArray = singleArray.length
          let rest = 6 - lengthArray
          for(let i = 0; i < rest +10; i++){
          
            let nameEjeX: any;


            
            for (let index = 0; index < i; index++) {
              nameEjeX = nameEjeX + ' ';
              singleArray.push({'name' : nameEjeX , 'value' :'0'})
            }
        
          }
          this.single = singleArray.slice(0, 6);

          //$('.ng-star-inserted').hide()
          //console.log(' this.single', this.single)
        } else {
          this.single = singleArray.slice(0, 6);
          //console.log(' this.single 2', this.single)
        }
     

        setTimeout(() => {
          $('.textDataLabel').each(function() {    
            if(this.innerHTML.replaceAll(' ','') == '0%') {
              $(this).hide()
            } 
          }); 
         
          $(".tick").find( "text" ).each(function() {      
            var text = $(this).text();
            if(!$.isNumeric(text)){
              $(this).text(text.replace('undefined', ' ')); 
            }  
          }); 
    
          $("g").find( ".tick" ).each(function() {
            var text = $(this).find( "text" ).text();
            if(!$.isNumeric(text)){
              //var name_ejeX = text.split(' ');
              var name_ejeX:any = []
            
    
              for(let item of  text.split(' ')){
                if(item != ''){
                  name_ejeX.push(item)
                }
              }
             // console.log(name_ejeX)
              //var {name_ejeX[0], ...myUpdatedObject} = name_ejeX;
    
             //console.log(brand)
             this.myUniqueArray = [...new Set(name_ejeX)];
  
            console.log('sucursal', this.myUniqueArray)
            
            if(  this.myUniqueArray[0] != undefined ){
              let empty = [' ']
              var brand = empty + this.myUniqueArray[0] + empty + this.myUniqueArray[1] ;
            } else {
              let empty = [' ']
              var brand = this.myUniqueArray[0] != undefined ?  this.myUniqueArray[1] : ' '
            }
            
             var model:any
  
             for(let item of name_ejeX){
               if(item != name_ejeX[0]){
                 //console.log(item)
          
                //modelComplete.join("", item)
               }
               
             }
          
    
                model = ( this.myUniqueArray[2] != undefined ?  this.myUniqueArray[2] : ' ') + ' ' +
                        ( this.myUniqueArray[3] != undefined ?  this.myUniqueArray[3] : ' ') + ' ' 
                //console.log(model)
              
              $(this).find( "text" ).text(text.replace(text, brand)).css('font-weight', 'bold');; 
              let div = $(this).clone().addClass('chield-tick'); 
              $("g").find( $(this)).prepend(div).html();
              $(this).closest('g').prepend(div).html();
              $(this).find('.chield-tick').find('text').text(brand.replace(brand, model));
              setTimeout(function() {
                  $('.chield-tick').attr({
                    transform: 'translate(0.5, 20)'
                  }).css('font-weight', 'bold');
              }, 50);
            }    
          }); 
        }, 500);
      } else {
        setTimeout(() => {
          $('.textDataLabel').each(function() {    
            if(this.innerHTML.replaceAll(' ','') == '0%') {
              $(this).hide()
            } 
          }); 
         
          $(".tick").find( "text" ).each(function() {      
            var text = $(this).text();
            if(!$.isNumeric(text)){
              $(this).text(text.replace('undefined', ' ')); 
            }  
          }); 
    
          $("g").find( ".tick" ).each(function() {
            var text = $(this).find( "text" ).text();
            if(!$.isNumeric(text)){
              //var name_ejeX = text.split(' ');
              var name_ejeX:any = []
            
    
              for(let item of  text.split(' ')){
                if(item != ''){
                  name_ejeX.push(item)
                }
              }
             // console.log(name_ejeX)
              //var {name_ejeX[0], ...myUpdatedObject} = name_ejeX;
    
             //console.log(brand)
             this.myUniqueArray = [...new Set(name_ejeX)];
  
            // console.log('sucursal', this.myUniqueArray)
            
            if(  this.myUniqueArray[0] != undefined ){
              let empty = [' ']
              var brand = this.myUniqueArray[0] +  empty + this.myUniqueArray[1] ;
            } else {
              var brand = this.myUniqueArray[0] != undefined ?  this.myUniqueArray[1] : ' '
            }
            
             var model:any
  
             for(let item of name_ejeX){
               if(item != name_ejeX[0]){
                 //console.log(item)
          
                //modelComplete.join("", item)
               }
               
             }
          
    
                model = ( this.myUniqueArray[3] != undefined ?  this.myUniqueArray[3] : ' ') + ' ' +
                        ( this.myUniqueArray[4] != undefined ?  this.myUniqueArray[4] : ' ') + ' ' 
                //console.log(model)
              
              $(this).find( "text" ).text(text.replace(text, brand)).css('font-weight', 'bold');; 
              let div = $(this).clone().addClass('chield-tick'); 
              $("g").find( $(this)).prepend(div).html();
              $(this).closest('g').prepend(div).html();
              $(this).find('.chield-tick').find('text').text(brand.replace(brand, model));
              setTimeout(function() {
                  $('.chield-tick').attr({
                    transform: 'translate(0.5, 20)'
                  }).css('font-weight', 'bold');
              }, 50);
            }    
          }); 
        }, 500);
      }

   
      
    }

 

  }

 
 
  

  ngOnChanges(changes: SimpleChanges) {
    if (changes['chart']) {
      this.getCharts()
    }
  }

   //switch to data of tab
   switchParent(tab:any) {
    switch (tab) {
      case 0:

      break;
      case 1:
        this.colorScheme= {
          domain: ['#FF3D00', '#FF3D00', '#FF3D00', '#FF3D00' , '#FF3D00', '#FF3D00']
        };
      break;
      case 2:
        this.colorScheme= {
          domain: ['#2FCBF1', '#2FCBF1', '#2FCBF1', '#2FCBF1' , '#2FCBF1', '#2FCBF1']
        };
      break;
      case 3:
        this.colorScheme= {
          domain: ['#005CFF', '#005CFF', '#005CFF', '#005CFF' , '#005CFF', '#005CFF'] 
        };
      break;
      case 4:
        this.colorScheme = {
          domain: ['#FD6C98', '#FD6C98', '#FD6C98', '#FD6C98' , '#FD6C98', '#FD6C98']
        };
      break;
    }
   }

  setStyle(){
    this.colorScheme= {
      domain: ['#42E8B4', '#42E8B4', '#42E8B4', '#42E8B4' , '#42E8B4', '#42E8B4']
    };
  
    $('.ngx-charts').css("display","inline-block !important");
    //$('.ngx-charts').css("width","100% !important");
    $('.ngx-charts').css("float","none");
    $('.ngx-charts').css("height","395px");
  }

}

