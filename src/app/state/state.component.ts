import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/services.service';
import { environment } from 'src/environments/environment';
import { AlertComponent } from '../alert/alert.component';
import { Trade } from '../models';
import  * as _ from 'lodash-es';
import * as moment from 'moment';

@Component({
  selector: 'app-state',
  templateUrl: './state.component.html',
  styleUrls: ['./state.component.scss']
})
export class StateComponent implements OnInit {

  message_tmp:any;
  status_tmp:any;
  progress_spinner: boolean = false;

  trades: any[];
  devices = [];
  subsidiariesAll = [];
  subsidiariesTemp = [];
  tradeActive: Trade; 
  currentDate: any;
  expandAll = false;

  qtyDevicesTrade: any[] = [];
  connected_qty_gral = 0;
  disconnect_qty_gral = 0;
  public version:string;
  
    
  constructor(private apiService: ApiService, private alert : AlertComponent,) { 
    this.getTrade();
    moment.locale('es');
  }

  ngOnInit(): void {
    this.version = environment.version;
  }

  // services
  getTrade(){
      this.progress_spinner = true;
			this.apiService.getTrade().subscribe(
				data => {
          console.log('data', data);
          this.trades = data;
          this.tradeActive = data[0];
          this.subsidiariesTemp = this.tradeActive.subsidiaries;
          console.log('trades', this.trades);
          this.getDevices();
				},
				error => {
					console.log('error', error);
					this.message_tmp = '¡Ocurrió un problema, por favor intente nuevamente!';
					this.status_tmp = 'alert-danger'
					this.alert.changeFromAlert();
				}
      );
  }

  getDevices(){

    let trades = _.map(this.trades, 'id').join(',');
    console.log('trades ids', trades);
    let filter = '?full=1&page_size=1000';
    this.apiService.getDevices(filter).subscribe(
      data => {
        this.devices = data.results;
        this.currentDate = moment().format('DD MMMM YYYY, HH:mm:ss');
        // console.log('devices', this.devices);
        this.calculateQty();
        this.progress_spinner = false;
      },
      error => {
        console.log('error', error);
        this.message_tmp = '¡Ocurrió un problema, por favor intente nuevamente!';
        this.status_tmp = 'alert-danger'
        this.alert.changeFromAlert();
      }
    );
  }

  // events
  search(event:any){
    const search = event.target.value;
    this.tradeActive = null;
    this.subsidiariesTemp = _.filter(this.subsidiariesAll,function(obj) {
      let text: string = String(obj.name + obj.address + String(obj.internal_id)).toLowerCase();
      return text.indexOf(String(search).toLowerCase()) !== -1;
    });
  }

  onSelect(trade: any = null){
    console.log('trade item', trade);
    if(typeof trade === 'string'){
      trade = _.find(this.trades, { 'id': Number.parseInt(trade)});
    }
    this.tradeActive = (trade) ? trade : {};
    this.subsidiariesTemp = this.tradeActive.subsidiaries;

  }

  getToogle(id: any){
    const idElement = id;
    const check = document.getElementById(idElement) as HTMLInputElement;
    check.className = (check.className === 'on') ? 'off' : 'on';
  }

  expand(){
    this.expandAll = !this.expandAll
  }

  getDevicesSubsidiary(id: number = null): any[]{
    let devices: [] = _.filter(this.devices, { 'subsidiary': id });
    const cant = document.getElementById('cant_' + id.toString()) as HTMLInputElement;
    cant.innerHTML = devices.length + ' dispositivos.';
    return (devices.length > 0) ? devices : [];
  }

  getStatus(date: string = null): boolean{
    let is_connected = false;
    if(date){
      let dateDiff = (moment(date).diff(moment().format(), 'minute')) * -1;
      if(dateDiff < 20){
        is_connected = true;
      }
    }
    return is_connected;
  }

  getPlaceHolder(date: string = null): string{
    let text = '';
    if(date){
      text += ' Último registro ' + moment(date).fromNow()
    }
    return text;
  }

  calculateQty(){
    // trades
    for(let trade of this.trades){
      let connected_qty = 0;
      let disconnect_qty = 0;
      // subisidiaries
      for(let subsidiary of trade.subsidiaries){
        
        subsidiary['logo'] = trade.logo;
        this.subsidiariesAll.push(subsidiary);
        let devices: [] = _.filter(this.devices, { 'subsidiary': subsidiary.id });
        // devices
        for(let device of devices){
          let dateDiff = (moment(device['detail']['modified']).diff(moment().format(), 'minute')) * -1;
          if(dateDiff < 20){
            // connected
            connected_qty++;
          }else{
            // disconnect
            disconnect_qty++;
          }
        }
      }
      this.connected_qty_gral += connected_qty;
      this.disconnect_qty_gral += disconnect_qty;
      let obj_temp = { 
        trade: trade.id,
        connected_qty: connected_qty,
        disconnect_qty: disconnect_qty
      }
      this.qtyDevicesTrade.push(obj_temp);
    }

  }

  getQtyDevicesGroup(trade: any = null): any{

    let trade_ = _.find(this.qtyDevicesTrade, { 'trade': Number.parseInt(trade)});
    return trade_;
  }

}