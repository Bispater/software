import { Component, ViewEncapsulation, Input, OnInit, SimpleChanges, ChangeDetectionStrategy} from '@angular/core';
import { Equipment, Accessory, Item, Input as Input_, Template, EquipmentDetail, AccessoryDetail } from '../models';
import  * as _ from 'lodash-es';


@Component({
  selector: 'app-thumbnails',
  templateUrl: './thumbnails.component.html',
  styleUrls: ['./thumbnails.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ThumbnailsComponent implements OnInit {
  
  @Input() element: {};
  @Input() form_ads: any;
  @Input() products: any[];

  warningAds = "Atención: Este anuncio tiene asignado un producto que ya no existe o pertenece a otro catálogo.";

  item: Item;
  htmlTemp: String = '';
  html: String;
  inputs = new Map<string, string>();

  constructor() { }
  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    // console.log('changes', changes);
    // changes template listener
    try{
      if(changes.itemTemplate){
        if(changes.itemTemplate.previousValue){
          if(changes.itemTemplate.currentValue.id != 
              changes.itemTemplate.previousValue.id)
          {
            this.inputs.clear();
          }
        }
      }
    }catch(error){
      console.log('error');
    }

    // this.htmlTemp = ;
    if(this.html){
      this.htmlTemp = this.html;
    }

    // changes form_ads listener
    console.log('error de llamado',this.form_ads);
    try{
      if(changes.form_ads.currentValue){

        this.html = (this.form_ads.template && this.form_ads.template.html_thumbnails) ? this.form_ads.template.html_thumbnails : '';
        this.htmlTemp = (this.form_ads.template && this.form_ads.template.html_thumbnails) ? this.form_ads.template.html_thumbnails : '';
        this.item = this.form_ads;
        //console.log('array data', this.form_ads);
        //console.log("ITEM ACTIVE TEMPLATE", this.htmlTemp);
  
        if(this.item && this.item.template && this.item.template.inputs){
          // console.log('this.item', this.item);
          for(let elem of this.item.template.inputs){
            let value = elem.default_value;
            this.inputs.set(
              elem.code, 
              elem.default_value
            );
            // product
            if(elem.input_type.type === 'product'){
              value = '-';
              let visible_param = '';
              if(elem.default_value && elem.default_value.search('#') != -1){
                // console.log('detecta params');
                let sp_value = elem.default_value.split('#');
                if (Array.isArray(sp_value)) {
                  if(sp_value.length > 0){
                    visible_param = sp_value[1];
                    elem.default_value = sp_value[0];
                    // console.log('visible_param', visible_param);
                  }
                }
              }
    
              try{
                let product = (this.item.equipment) ? this.item.equipment : this.item.accessory;
                let query = _.get(product, elem.default_value);
                // value is array
                if (Array.isArray(query)) {
                  // console.log('es array', elem.code);
                  value = this.list(query, visible_param);
                }
                // value is data
                else{
                  // console.log('no es array', elem.code);
                  if(visible_param.search('__divide__') != -1){
                    try{
                      let param = JSON.parse(visible_param);
                      value = Number(this.formatPrice(Number(query) / Number(_.get(product, param['__divide__'])))).toFixed(3);
                    }catch(e){}
                  }
                  else{
                    value = query;
                  }
                }
                
                // console.log('query', value);
              }catch(e){
                console.log('element query', e)
              }
    
              this.inputs.set(
                elem.code, 
                value
              );
              // this.renderHtml();
            }
            // others (item saved values)
            else{
              
              let value_default_value = _.find(this.item.values.values, function(v: Input_) { 
                return v.code === elem.code
              });

              if(value_default_value){
                this.inputs.set(
                  elem.code, 
                  value_default_value.default_value);
              } 
            }
            
            
          }
          this.renderHtml();
          // this.htmlTemp += '<span class="list-name">'+this.form_ads.name+'</span>';
        }
        
      }
    }catch(error){
      console.log('error', error);
    }

     // get unique value edit listener (onkeypress value)
  }


  renderHtml(){
    // Iterate over Map entries:
    // console.log('TEMPLATE INPUTS', this.inputs);
    this.inputs.forEach((value, key) => {
      // console.log('key,value', key, value);
      try{
        key = String("[" + key + "]").split(' ').join('');
        this.htmlTemp = this.htmlTemp.split(key).join(value);
      

        // console.log('TEMPLATE htmlTemp', this.htmlTemp);
      }catch(error){
        console.log('there are no matches per ' + key);
        // console.error('error renderHtml', key, error)
      }
    });
  }

  formatPrice(number: any){
    let number_format: any = String(number).replace(",", ".");
    return number_format;
  }

  list(values: any[] = [], params: any){
    let value = '-';
    try{
      params = JSON.parse(params);
      let keys = Object.keys(params);
      value = '<ul>';
      for(let item of values){
        value += '<li>'
        _.forEach(keys, (obj) => {
          if(obj ==='img'){
            value += '<'+ obj +' src="' + item[params[obj]] + '">';
          }else{
            value += '<'+ obj +'>';
            value += item[params[obj]];
            value += '</'+ obj +'>';
          }
        })
        value += '</li>' 
      }
      value += '</ul>';
    }catch(ex){}
    return value;
  }

  // get price product
  getPrice(type_price: string){
    let value: string = '';
    try{
      
      // console.log('this.item.accessory', this.item.accessory);
      if(this.item.accessory){
        for(let detail of this.item.accessory.accessory_details){
          value = this.formatPrice(detail[type_price]);
        } 
      }
      // console.log('this.item.equipment', this.item.equipment);
      if(this.item.equipment){
        for(let detail of this.item.equipment.equipment_details){
          for(let plan of detail.plans){
            value = this.formatPrice(plan[type_price]);
          }
        }
      }
      
    }catch(error_){
      console.log('prices error_', error_);
    }
    return value;
  }

  
}
