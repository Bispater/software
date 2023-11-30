import { Component, ViewEncapsulation, Input, OnInit, SimpleChanges} from '@angular/core';
import { Equipment, Accessory, Item, Input as Input_, Template, EquipmentDetail, AccessoryDetail } from '../models';
import  * as _ from 'lodash-es';


@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})

export class TemplatesComponent implements OnInit {
  
  @Input() element: {};
  @Input() form_ads: any;
  @Input() products: any[];
  @Input() itemActive: Item;

  item: Item;
  htmlTemp: String = '';
  html: String;
  inputs = new Map<string, string>();

  constructor() { }
  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    //console.log('changes', changes);
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
    try{
      if(changes.form_ads.currentValue){

        this.html = this.form_ads.template.html;
        this.htmlTemp = this.form_ads.template.html;
        this.item = this.itemActive;
        console.log("ITEM ACTIVE TEMPLATEX", this.item);
  
        if(this.item){

          // get default values of template
          for(let elem of this.item.template.inputs){
            let value = elem.default_value;
            this.inputs.set(
              elem.code, 
              elem.default_value
            );
            // only products
            if(elem.input_type.type === 'product'){
              value = '-';
              let visible_param = '';
              if(elem.default_value.search('#') != -1){
                console.log('detecta params');
                let sp_value = elem.default_value.split('#');
                if (Array.isArray(sp_value)) {
                  if(sp_value.length > 0){
                    visible_param = sp_value[1];
                    elem.default_value = sp_value[0];
                    console.log('visible_param', visible_param);
                  }
                }
              }
    
              try{
                let product = (this.item.equipment) ? this.item.equipment : this.item.accessory;
                let query = _.get(product, elem.default_value);
                // value is array
                if (Array.isArray(query)) {
                  console.log('es array', elem.code);
                  value = this.list(query, visible_param);
                }
                // value is data
                else{
                  console.log('no es array', elem.code);
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
                
                console.log('query', value);
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
              console.log('value object', value);
            }
            
          }
          console.log('inputs', this.inputs);
          this.renderHtml();
        }
        
      }
    }catch(error){
      console.log('error general', error);
    }

     // get unique value edit listener (onkeypress value)
    try{
      if(changes.element.currentValue){
        if(changes.element.currentValue.key != ''){
          this.inputs.set(
            changes.element.currentValue.key, 
            changes.element.currentValue.value
            );
          console.log('ELEMENT', this.inputs);
          this.renderHtml();
        }
      }
    }catch(error){
      console.log('element error');
    }

    // changes form_ads listener
    // try{
    //   if(changes.form_ads.currentValue){

    //     this.html = this.form_ads.template.html;
    //     this.htmlTemp = this.form_ads.template.html;
    //     this.item = this.itemActive;
    //    // console.log("ITEM ACTIVE TEMPLATE", this.item);
  
    //     if(this.item){
    //       for(let elem of this.item.template.inputs){
    //         let value = elem.default_value;
    //         // product
    //         if(elem.input_type && elem.input_type.type === 'product'){
    
    //           let product = (this.item.equipment) ? this.item.equipment : this.item.accessory;
    //           value = (product[elem.code]) ? product[elem.code] : elem.default_value;
              
    //           // get prices
    //           if(elem.code === 'price_1' || elem.code === 'price_2'){
    //             value = this.getPrice(elem.code);
    //           }
    
    //           // provider
    //           try{
    //             if(elem.code == 'provider'){
    //               value = (product.provider) ? product.provider.name : elem.default_value;
    //             }
    //           }catch(error_){
    //             console.log('error_ no matches per provider');
    //           }

    //           // memory
    //           try{
    //             if(elem.code == 'memory'){
    //               if(this.item.equipment){
    //                 value = this.item.equipment.equipment_details[0].memory.toString() + 'GB';
    //               }
    //             }
    //           }catch(error_){
    //             console.log('error_ no matches per memory');
    //           }

    //           // features
    //           try{
    //             if(elem.code == 'features'){
    //               value = '';
    //               if(this.item.equipment){
    //                 value = '<ul>';
    //                 for(let item of product[elem.code]){
    //                   value += '<li>' + item['description'] + '<li>';
    //                 }
    //                 value += '</ul>';
    //               }
    //               if(this.item.accessory){
    //                 value = product['description'];
    //               }
    //             }
    //           }catch(error_){
    //             console.log('error_  no matches per features', error_);
    //           }

    //         }
    //         // others (item saved values)
    //         else{
              
    //           value = _.find(this.item.values.values, function(v: Input_) { 
    //             //console.log('v.code', v.code+' - '+elem.code);
    //             return v.code === elem.code; 
    //           }).default_value;
    //           //console.log('value object', value);
    //         }
    //         // ads input element
    //         this.inputs.set(
    //           elem.code, 
    //           value
    //         );

    //        // console.log('this.inputs', this.inputs);
            
    //       }
    //       this.renderHtml();
    //     }
        
    //   }
    // }catch(error){
    //   console.log('error', error);
    // }

    //  // get unique value edit listener (onkeypress value)
    //  try{
    //   if(changes.element.currentValue){
    //     if(changes.element.currentValue.key != ''){
    //       this.inputs.set(
    //         changes.element.currentValue.key, 
    //         changes.element.currentValue.value
    //         );
    //       this.renderHtml();
    //     }
    //   }
    // }catch(error){
    //   console.log('error');
    // }

  }

/*   ngOnChanges(changes: SimpleChanges) {
    console.log('changes', changes);
    // default values of the template
    if(this.itemTemplate){
      // if they are different, reset inputs list
      if(changes['itemTemplate']){
        if(changes['itemTemplate']['previousValue']){
          if(changes['itemTemplate']['currentValue']['id'] != 
              changes.itemTemplate['previousValue']['id'])
          {
            this.inputs.clear();
          }
        }
      }
      // copy html template
      this.htmlTemp = Object.assign(this.itemTemplate['html']);
      // default values
      if(this.inputs.size == 0){
        for(let input of this.itemTemplate.inputs){
          this.inputs.set(input.code,input.default_value);
        }
      }
    }
    // add unique value edit
    if(changes['element']){
      if(changes['element']['currentValue']['key'] != ''){
        this.inputs.set(changes['element'].currentValue.key, 
                      changes['element'].currentValue.value
                      );
      }
    }

    // add edit item masive
    if(this.elementsEdit){
      for(let it of this.elementsEdit){
        this.inputs.set(
          it.code, 
          it.default_value
        );
      }
    }

    // console.log('TEMPLATE EDIT', this.elementsEdit);

    // only render product
    // if(this.form_ads){
    //   if(this.form_ads.product){
    //     // for(let product of this.form_ads.product){
    //     //   console.log(product);
    //     // }
    //     if(this.itemTemplate){
    //       //console.log('product tye',this.itemTemplate.inputs);
    //       // for(let input of this.itemTemplate.inputs){
    //       //   if(input.input_type.type=='product'){
    //           // console.log(input);
    //           // console.log('input code', input.code)
    //           // console.log('this.form_ads.product', this.form_ads.product);
    //           // let product: any;
    //           // let productIndex = this.form_ads.product.split(',')[0];
    //           // console.log('productIndex', productIndex);
    //           // console.log('products', this.products);
    //           // console.log('this.form_ads.productType', this.form_ads.productType);
    //           // if (this.form_ads.productType  == 1){
    //           //    product = this.products[productIndex];
    //           // }else if(this.form_ads.productType  == 2){
    //           //    product = this.products[productIndex];
    //           // }
    //           // console.log('product', product);

    //           // try{
    //           //   if(input.code === 'memory'){
    //           //     this.inputs.set(input.code, this.form_ads.product.split(',')[1]);
    //           //   }else{
    //           //     this.inputs.set(input.code, product[input.code]);
    //           //   }
                
    //           // }catch (error) {
    //           //   console.error(error);
    //           // }

              
              
    //         // }
    //       }
    //     }
    //   }
    //}

    // render all values
    this.renderHtml();
  } */

  renderHtml(){
    // Iterate over Map entries:
    //console.log('TEMPLATE INPUTS', this.inputs);
    this.inputs.forEach((value, key) => {
      // console.log('key,value', key, value);
      try{
        key = String("[" + key + "]").split(' ').join('');
        this.htmlTemp = this.htmlTemp.split(key).join(value);
      }catch(error){
        console.log('there are no matches per ' + key);
        // console.error('error renderHtml', key, error)
      }
    });
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

  formatPrice(number: any){
    let number_format: any = String(number).replace(",", ".");
    return number_format;
  }

  // get price product
  getPrice(type_price: string){
    let value: string = '';
    try{
      
      if(this.item.accessory){
        for(let detail of this.item.accessory.accessory_details){
          value = this.formatPrice(detail[type_price]);
        } 
      }
      
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
