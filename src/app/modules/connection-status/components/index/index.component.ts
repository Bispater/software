import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as _ from "lodash";
import * as moment from 'moment';
import 'moment/locale/pt-br';
import { ApiService } from '../../../../services/services.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Device } from '../../../../models';
import { Utils } from '../../../../utils/utils';
// import { functions } from 'firebase';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { DomSanitizer } from '@angular/platform-browser';
import { MatAccordion } from '@angular/material/expansion';
import { MatPaginator } from '@angular/material/paginator';

//download Excel
// import { Workbook } from 'exceljs';
import * as ExcelJS from 'exceljs';
import * as fs from 'file-saver';
import { Console } from 'console';

declare var $: any;

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  providers: [ApiService]
})

export class IndexComponent implements AfterViewInit {

  //subsidiary = new FormControl();
  public form_search: FormGroup;
  public form_order: FormGroup;
  options: string[] = [];
  filteredOptions: Observable<string[]>;

  public before = 'before'

  panelOpenState: boolean = true;

  @ViewChild('firstAccordion') firstAccordion: MatAccordion;
  @ViewChild('secondAccordion') secondAccordion: MatAccordion;

  conexion: any[];
  status: any[];
  energy: any[];
  power: any[];

  conexion_channel: any[];
  energy_channel: any[];

  view: any[];
  device_conexion: any[];
  device_energy: any[];
  device_power: any[];

  // options
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = false;
  isDoughnut: boolean = true;
  legendPosition: string = 'below';

  single: any[];
  multi: any[];

  // options
  showXAxis = true;
  showYAxis = true;
  showXAxisLabel = true;
  xAxisLabel = 'Country';
  showYAxisLabel = true;
  yAxisLabel = 'Population';

  //Global Status Connected
  public statusGlobalConnected: any[] = [];
  public device_exclude: any[] = ["44141fe95ef1f8f0", "89a1d7d21dda4548", "zy326knxn8", "4af778c4f4b6afd4", "95a51fac7bb503db", "787d2d6d4ec5ebd6", "95a51fac7bb503db"];
  public start_date: string;
  public end_date: string;
  public update_date: string;
  public totalDevices: any;
  public devices = [];
  public devices_tmp = [];
  public total_subsidiaries: any;
  public list_subsidiaries: any[] = [];
  public totalDevicesConnected: any;
  public totalDevicesCharged: any;
  public list_channel: any[] = [];
  public list_channel_filter: any[] = [];
  public list_segment: any[] = [];
  public list_segment_tmp: any[] = [];
  public list_segment_filter: any[] = [];
  public channels: any[] = [];
  public list_segments_filter: any[] = [];
  public list_segments_filter_tmp: any[] = [];
  public subsidiaries_device: any[] = [];
  public subsidiaries_device_tmp: any[] = [];
  /** Tablet */
  public subsidiaries_tablet: any[] = [];
  public subsidiaries_tablet_tmp: any[] = [];
  public online: number = 0;
  public offline: number = 0;
  public charged: number = 0;
  public discharged: number = 0;
  public phone: number = 0;
  public tablet: number = 0;
  public list_region: any[] = [];
  public alert_connected: boolean = false;
  public alert_charged: boolean = false;
  public alert_power: boolean = false;
  public type_device: string;
  public subsidiary_select: any[] = [];
  public info_device: any;
  public update_device: any;
  public control_filter: boolean = false;
  public list_subsidiaries_filter: any[] = [];
  public select_channel: any[] = [];
  public select_segment: any[] = [];
  public select_region: any[] = [];
  public is_filter_channel: boolean = false;
  public is_filter_segment: boolean = false;
  public is_filter_region: boolean = false;
  public is_filter_subsidiary: boolean = false;
  public total_result: number = 0;
  public total_result_subsidiaries: number = 0;
  public total_device_result: number = 0;
  public time_conexion: number = 8;
  public list_segment_data: any;
  public user_channel: any[] = [];
  public enabled: any;
  public datasource_device: any;
  public networkInfo: any;
  public is_staff: boolean = true;
  public search_event: boolean = true;
  public devices_excel;

  //paginator
  pageEvent: PageEvent;
  datasource: null;
  pageIndex: number;
  pageSize: number;
  length: number;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  toppings = new FormControl();
  toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];

  colorScheme = {
    domain: ['#00E676', '#FF3D00', '#C7B42C', '#AAAAAA']
  };

  colorScheme2 = {
    domain: ['#00B0FF', '#FF3D00', '#C7B42C', '#AAAAAA']
  };

  version_api = ''

  @Input() spinner: boolean;

  constructor(
    private apiService: ApiService,
    public dialog: MatDialog,
    public utils: Utils,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.spinner = true;
    this.ngInitChart();

    //date start and end
    this.start_date = moment().add(-5, 'minutes').format('YYYY-MM-DDTHH:mm:ss.SSSSSS');
    this.end_date = moment().format('YYYY-MM-DDTHH:mm:ss.SSSSSS');
    this.update_date = moment().format('YYYY-MM-DDTHH:mm:ss.SSSSSS');

    let profileUser = JSON.parse(localStorage.getItem('profileUser'));
    this.user_channel = profileUser['channel'] && profileUser['channel'] != '' ? profileUser['channel'] : '';
    this.enabled = profileUser['enabled'] && profileUser['enabled'] != '' ? profileUser['enabled'] : '';

    this.version_api = moment().format('mm_ss_SSS');
    console.log('version', this.version_api);

    //get instance data result
    // this.getTotalDevices();
    this.initForm();
    this.getSalesChannelList();
    this.getTotalSubsidiariesList();
    this.getSegmentSubsidiariesList();
    this.getStaff();

    $('.modal').modal();
    $(".modalChart .chart g.x.axis text").css("font-size", "20px !important");
  }

  ngInitChart() {
    this.conexion = [
      {
        "name": "Onlines",
        "value": 0
      },
      {
        "name": "Offline",
        "value": 0
      }
    ]

    this.energy = [
      {
        "name": "Óptima",
        "value": 0
      },
      {
        "name": "Deficiente",
        "value": 0
      }
    ]

    this.power = [
      {
        "name": "Óptima",
        "value": 0
      },
      {
        "name": "Deficiente",
        "value": 0
      }
    ]

    this.device_conexion = [
      {
        "name": "Online",
        "value": 0
      },
      {
        "name": "Offline",
        "value": 0
      }
    ]

    this.device_energy = [
      {
        "name": "Óptima",
        "value": 0
      },
      {
        "name": "Deficiente",
        "value": 0
      }
    ]

    this.device_power = [
      {
        "name": "Óptima",
        "value": 0
      },
      {
        "name": "Deficiente",
        "value": 0
      }
    ]


    Object.assign(this.energy);
    Object.assign(this.power);
    Object.assign(this.conexion);

    $(".modalChart .chart g.x.axis text").css("font-size", "20px !important");
  }

  ngAfterViewInit() {
    this.paginator._intl.itemsPerPageLabel = 'Items por página';
    this.paginator._intl.nextPageLabel = 'Página siguiente';
    this.paginator._intl.firstPageLabel = 'Primera página';
    this.paginator._intl.lastPageLabel = 'Última página';
    this.paginator._intl.previousPageLabel = 'Página anterior';

    this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
      if (length === 0 || pageSize === 0) {
        return `0 de ${length}`;
      }
      length = Math.max(length, 0);
      const startIndex = page * pageSize;
      // If the start index exceeds the list length, do not try and fix the end index to the end.
      const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
      return `${startIndex + 1} - ${endIndex} de ${length}`;
    };
    $(".modalChart .chart g.x.axis text").css("font-size", "20px !important");
  }

  onPaginateChange(pageNumber) {
    if (pageNumber.pageIndex === 1) {
      this.paginator._intl.itemsPerPageLabel = 'Items por página';
    }
    else {
      this.paginator._intl.itemsPerPageLabel = 'Items por página'
    }
  }

  openDialog(templateRef, device: Device = null, channel_id: number = null) {
    this.info_device = device;
    // console.log('device modal', device);
    if (templateRef._declarationTContainer.localNames[0] === 'detail') {
      console.log('acá 2');
      this.spinner = true;
      let dialogRef = this.dialog.open(templateRef, {
        width: '55%',
        height: 'auto',
        autoFocus: false
      });

      this.apiService.getDeviceInfo(device.id).subscribe(
        data => {
          let networkInfo = data;
          let imei1 = networkInfo && networkInfo.info && networkInfo.info.device && networkInfo.info.device.networkInfo && networkInfo.info.device.networkInfo.imei1 ? networkInfo.info.device.networkInfo.imei1 : '';
          let imei2 = networkInfo && networkInfo.info && networkInfo.info.device && networkInfo.info.device.networkInfo && networkInfo.info.device.networkInfo.imei2 ? networkInfo.info.device.networkInfo.imei2 : '';
          let wifiSSID = networkInfo && networkInfo.info && networkInfo.info.status && networkInfo.info.status.networkEvent.wifiNetworkInfo && networkInfo.info.status.networkEvent.wifiNetworkInfo.wifiSSID ? networkInfo.info.status.networkEvent.wifiNetworkInfo.wifiSSID : '';
          this.networkInfo = {
            'imei1': imei1,
            'imei2': imei2,
            'wifiSSID': wifiSSID
          }
          this.spinner = false;
        },
        error => {
          this.spinner = false;
          console.log('error', error);
        }
      );

    } else {
      this.spinner = true;
      let dialogRef = this.dialog.open(templateRef, {
        width: '95%',
        height: '95%',
        autoFocus: false
      });

      setTimeout(() => {
        console.log('acá 3', this.list_segment);
        this.list_segment_tmp = [];

        this.list_segments_filter_tmp.forEach(element => {
          console.log('this.devices **', this.devices);
          let filter_device = _.filter(this.devices, ['subsidiary_relation.sales_channel', channel_id]);
          filter_device = _.filter(filter_device, ['subsidiary_relation.segment.id', element.id]);
          let connected_qty = 0;
          let disconnect_qty = 0;
          let battery_charged = 0;
          let battery_discharged = 0;
          let connected_power = 0;
          let disconnect_power = 0;
          let subsidiary_list: any[] = [];
          let i = 0;
          for (let device of filter_device) {
            let dateDiff = (moment(device['detail']['modified']).diff(moment().format(), 'minute')) * -1;
            // console.log('device', device);    
            filter_device[i]['channel_name'] = element && element.name ? element.name : 'n/a';
            subsidiary_list.push({ 'id': device.subsidiary });
            let device_name_brand = device.device_name;
            device_name_brand = device_name_brand.split("-", 2);

            device_name_brand = filter_device[i]['device_name_brand'];
            try {
              device_name_brand = filter_device[i]['model']['object_brand']['name']
            } catch (e) { console.log('model?', e) }
            filter_device[i]['device_name_brand'] = device_name_brand;


            // filter_device[i]['city'] = device['subsidiary_relation']['city']; 
            if (dateDiff <= this.time_conexion) {
              // connected
              connected_qty++;
            } else {
              // disconnect
              disconnect_qty++;
            }
            let battery = Number(device['detail']['battery']);
            if (battery < 30) {
              // charged
              battery_discharged++;
            } else {
              // discharged
              battery_charged++;
            }

            let power = device['detail']['power_status'];

            if (power == 'POWER_CONNECTED') {
              connected_power++;
            } else if (power == 'POWER_DISCONNECTED') {
              disconnect_power++;
            }

            i++;
          }
          //percentage connected
          let porc_online = Number(connected_qty) !== 0 && Number(filter_device.length) !== 0 ? Math.round((Number(connected_qty) * 100) / Number(filter_device.length)) : 0;
          let porc_offline = Number(disconnect_qty) !== 0 && Number(filter_device.length) !== 0 ? Math.round((Number(disconnect_qty) * 100) / Number(filter_device.length)) : 0;
          //percentage charged
          let porc_charged = Number(battery_charged) !== 0 && Number(filter_device.length) !== 0 ? Math.round((Number(battery_charged) * 100) / Number(filter_device.length)) : 0;
          let porc_discharged = Number(battery_discharged) !== 0 && Number(filter_device.length) !== 0 ? Math.round((Number(battery_discharged) * 100) / Number(filter_device.length)) : 0;
          let porc_connected_power = Math.round(((Number(connected_power) * 100) / Number(filter_device.length)));
          let porc_disconnected_power = Math.round(((Number(disconnect_power) * 100) / Number(filter_device.length)));
          let total_general = Number(porc_online) + Number(porc_offline) + Number(porc_charged) + Number(porc_discharged);
          let alert_charged_device = Math.round(((connected_qty * 100) / this.totalDevices)) > 50 ? false : true;
          let alert_power_device = Number(porc_connected_power) > 50 ? false : true;
          let alert_connected = Number(porc_online) > 50 ? false : true;

          let total_devices = filter_device && filter_device.length > 0 ? filter_device.length : 0;

          subsidiary_list = _.chain(subsidiary_list).groupBy("id").map((value, key) => ({
            id: Number(key)
          })).value();

          let total_subsidiary = subsidiary_list && subsidiary_list.length > 0 ? subsidiary_list.length : 0;

          if ((connected_qty + disconnect_qty) > 0) {
            let list_segment_device = {
              'segment': element,
              'online': connected_qty,
              'perc_online': porc_online,
              'offline': disconnect_qty,
              'perc_offline': porc_offline,
              'devices': filter_device,
              'total_devices': total_devices,
              'total_subsidiary': total_subsidiary,
              'battery_charged': battery_charged,
              'perc_charged': porc_charged,
              'battery_discharged': battery_discharged,
              'perc_discharged': porc_discharged,
              'porc_connected_power': porc_connected_power,
              'porc_disconnected_power': porc_disconnected_power,
              'connected_power': connected_power,
              'disconnect_power': disconnect_power,
              'total_general': total_general,
              'alert_power_device': alert_power_device,
              'alert_connected': alert_connected,
              'alert_charged_device': alert_charged_device,
              'conexion': [
                {
                  "name": porc_online + "" + " Online",
                  "value": porc_online
                },
                {
                  "name": porc_offline + "" + " Offline",
                  "value": porc_offline
                }
              ],
              'energy': [
                {
                  "name": porc_charged + "" + " Óptima",
                  "value": porc_charged
                },
                {
                  "name": porc_discharged + "" + " Deficiente",
                  "value": porc_discharged
                }
              ],
              'power': [
                {
                  "name": porc_connected_power + "" + " Conectado",
                  "value": porc_connected_power
                },
                {
                  "name": porc_disconnected_power + "" + " Desconectado",
                  "value": porc_disconnected_power
                }
              ]
            };
            this.list_segment_tmp.push(list_segment_device);
          }
        });

        this.list_segment_tmp = _.orderBy(this.list_segment_tmp, ['segment.name'], ['asc']);

        setTimeout(() => {
          $('.legend-label-text').map(function () {
            var text_grhap = $.trim($(this).text());
            text_grhap = text_grhap.split(' ', 2);

            if (text_grhap[0] == 'Óptima' || text_grhap[1] == 'Óptima') {
              $(this).text('Óptima (+30%)');
            } else if (text_grhap[0] == 'Deficiente' || text_grhap[1] == 'Deficiente') {
              $(this).text('Deficiente (-30%)');
            }
            else {
              $(this).text(text_grhap[1]);
            }
          }).get();

          $('.pie-label').map(function () {
            var text_grhap = $.trim($(this).text());
            text_grhap = text_grhap.split(' ', 3);
            $(this).text(text_grhap[0]);
          }).get();

        }, 300);
        this.spinner = false;

      }, 800);
    }
  }

  modalCustom(type: any, subsidiaries: any[] = null) {
    if (type == 1) {
      console.log('subsidiaries', subsidiaries);
      //console.log('entra')
      this.subsidiary_select = [subsidiaries];
    }

    // setTimeout(() => {
    //   this.openAllFirst();
    // }, 1000);

    $('.boxModalCustom').fadeToggle("fast");
  }

  initForm() {
    this.form_order = new FormGroup({
      order: new FormControl('desc')
    });
    this.form_search = new FormGroup({
      subsidiary: new FormControl(null),
      segment: new FormControl(null),
      channel: new FormControl(null),
      city: new FormControl(null),
      online: new FormControl(true),
      offline: new FormControl(true),
      charged: new FormControl(true),
      discharged: new FormControl(true),
      phone: new FormControl(true),
      phone_entel: new FormControl(true),

      only_phone: new FormControl(true),
      only_tablet: new FormControl(true),
      tablet: new FormControl(true),
      tablet_entel: new FormControl(true)
    });
    // this.devices_tmp = this.devices;
    // this.form_search.valueChanges.subscribe(()=>{
    //   this.devices_tmp = this.devices;
    // });
    this.form_search.valueChanges.subscribe(() => {
      this.spinner = true;
      this.search_event = false;
      this.control_filter = true;
      this.devices_tmp = this.devices;
      this.list_segments_filter_tmp = [];
      console.log('this.devices_tmp ** from', this.devices_tmp);
      const subsidiary = this.form_search.value['subsidiary'];
      const form_segment: any[] = this.form_search.value['segment'];
      const form_channel: any[] = this.form_search.value['channel'];
      const form_city = this.form_search.value['city'];
      const form_online = this.form_search.value['online'];
      const form_offline = this.form_search.value['offline'];
      const form_charged = this.form_search.value['charged'];
      const form_discharged = this.form_search.value['discharged'];
      const form_phone = this.form_search.value['phone'];
      const form_phone_entel = this.form_search.value['phone_entel'];
      const form_tablet = this.form_search.value['tablet'];
      const form_tablet_entel = this.form_search.value['tablet_entel'];
      const only_phone = this.form_search.value['only_phone'];
      const only_tablet = this.form_search.value['only_tablet'];

      if (!form_online && !form_offline) {
        this.devices_tmp = [];
      }

      if (!form_charged && !form_discharged) {
        this.devices_tmp = [];
      }

      if (this.enabled) {
        if (!form_phone && !form_tablet && !form_phone_entel && !form_tablet_entel) {
          this.devices_tmp = [];
        }
      } else {
        if (!form_phone_entel && !form_tablet_entel) {
          this.devices_tmp = [];
        }
      }
      // this.devices_tmp = [];

      console.log('this.devices_tmp 1** from', this.devices_tmp);
      if (subsidiary) {
        this.devices_tmp = _.filter(this.devices_tmp, function (value: Device) {
          let subsidiary_name = value.subsidiary_relation.internal_id + ' - ' + value.subsidiary_relation.name;
          return subsidiary == subsidiary_name;
        });
        this.is_filter_subsidiary = true;
      }

      if (subsidiary && subsidiary.length == 0) {
        this.is_filter_subsidiary = false;
      }

      console.log('this.devices_tmp 2** from', this.devices_tmp);
      if (form_channel && form_channel.length > 0) {

        this.form_search.controls.channel.valueChanges.subscribe(() => {
          this.form_search.controls['segment'].setValue(null, { emitEvent: false });
        });
        this.is_filter_segment = false;
        this.devices_tmp = _.filter(this.devices_tmp, function (value: Device) {
          return form_channel.includes(value.subsidiary_relation.sales_channel);
        });
        this.is_filter_channel = true;

        this.list_segments_filter_tmp = _.filter(this.list_segments_filter, function (value) {
          return form_channel.includes(value.sales_channel);
        });

        if (form_channel && form_channel.length == 0) {
          this.is_filter_channel = false;
        }
      }

      if (form_channel && form_channel.length == 0) {
        this.is_filter_channel = false;
      }

      console.log('this.devices_tmp 3** from', this.devices_tmp);
      if (form_segment && form_segment.length > 0) {
        //console.log('entra');
        this.devices_tmp = _.filter(this.devices_tmp, function (value: Device) {
          //console.log('value.subsidiary_relation.segment.id', form_segment);
          return form_segment.includes(value.subsidiary_relation.segment.id);
        });
        this.is_filter_segment = true;
      }

      if (form_segment && form_segment.length == 0) {
        this.is_filter_segment = false;
      }

      console.log('this.devices_tmp 4** from', this.devices_tmp);
      if (form_city && form_city.length > 0) {
        this.devices_tmp = _.filter(this.devices_tmp, function (value: Device) {
          // console.log('value.subsidiary_relation.region', form_city);
          return form_city.includes(Number(value.subsidiary_relation.region));
        });
        this.is_filter_region = true;
      }

      if (form_city && form_city.length == 0) {
        this.is_filter_region = false;
      }

      console.log('this.devices_tmp 5** from', this.devices_tmp);
      if (form_online && form_offline) {

      } else {
        if (form_online) {
          this.devices_tmp = _.filter(this.devices_tmp, function (value: Device) {
            return form_online == value.detail.online;
          });
        }
        if (form_offline) {
          this.devices_tmp = _.filter(this.devices_tmp, function (value: Device) {
            return false == value.detail.online;
          });
        }
      }
      let type_charged: any[] = [];

      if (form_charged) {
        type_charged.push('POWER_CONNECTED');
      }

      if (form_discharged) {
        type_charged.push('POWER_DISCONNECTED');
      }

      if (type_charged?.length > 0) {
        this.devices_tmp = _.filter(this.devices_tmp, function (value: Device) {
          return type_charged.includes(value.detail.power_status);
        });
      }

      let types_device: any[] = [];

      console.log('form_phone', form_phone);
      console.log('form_tablet', form_tablet);
      console.log('form_phone_entel', form_phone_entel);
      console.log('form_tablet_entel', form_tablet_entel);


      types_device = []
      if (only_phone) {
        if (this.enabled) {
          types_device.push('TP');
        }
        types_device.push('SP');
      }

      if (only_tablet) {
        if (this.enabled) {
          types_device.push('TT');
        }
        types_device.push('TB');
      }

      if(!only_phone && !only_tablet){
        types_device.push('NN');
      }

      console.log('types_device 6** types_device', types_device);

      if (types_device?.length > 0) {

        this.devices_tmp = _.filter(this.devices_tmp, function (value: Device) {
          return types_device.includes(value.device_type.prefix);
        });
      }

      types_device = []
      if (this.enabled) {
        if (only_phone) {
          // phones
          if (form_phone) {
            // test phone
            types_device.push('TP');
          }
          if (form_phone_entel) {
            types_device.push('SP');
          }
        }else{
          types_device.push('NN');
        }

        if (only_tablet) {
          // tablets
          if (form_tablet) {
            // test tablet
            types_device.push('TT');
          }
          if (form_tablet_entel) {
            types_device.push('TB');
          }
        }else{
          types_device.push('NN');
        }

        // if(!only_phone || !only_tablet){
        //   types_device = [];
        //   types_device.push('NN');
        // }
        
      }
      // else {
      //   if (form_phone_entel) {
      //     types_device.push('SP');
      //   }
      //   if (form_tablet_entel) {
      //     types_device.push('TB');
      //   }
      // }



      console.log('types_device 7** types_device', types_device);
      if (types_device?.length > 0) {

        this.devices_tmp = _.filter(this.devices_tmp, function (value: Device) {
          if (value.device_type.prefix == 'SP') {
            // console.log('value', value);
          }
          return types_device.includes(value.device_type.prefix);
        });
      }
      this.getChannelSubsidiaries(null, 1);
    });
  }


  onSelect(data): void {
    // console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    // console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    // console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  getUpdateAll() {
    this.spinner = true;
    // this.getTotalDevices();
    this.getStaff();
  }

  //get total device
  getTotalDevices() {
    let user_channel = this.user_channel.toString();
    console.log('#CHANNEL USER#', user_channel)
    console.log('#DEVICE TYPE PREFIX#', this.type_device)
    let filter = '?page_size=3000&device_type_prefix='+this.type_device+'&sales_channel='+user_channel+'&is_active=true&version=' + this.version_api;

    // let filter = '?page_size=200&device_type_prefix=' + this.type_device + '&is_active=true&version=' + this.version_api;
    // this.apiService.getDevicesState(filter).subscribe(
    this.apiService.getDevices(filter).subscribe(
      data => {
        let devices = data.results;
        // console.log('this.devices', this.devices);

        let listObject = [];
        for (let i = 0; i < devices.length; i++) {
          if (this.is_staff) {
            if ((devices[i].detail.power_status == 'POWER_CONNECTED' || devices[i].detail.power_status == 'POWER_DISCONNECTED')
              && (devices[i].subsidiary_relation.sales_channel) && (devices[i].subsidiary_relation.segment.name)
              && (devices[i].device_type.prefix == 'SP' || devices[i].device_type.prefix == 'TP' || devices[i].device_type.prefix == 'TB' || devices[i].device_type.prefix == 'TT')) {
              let select_devices = devices[i];
              //console.log(this.devices[i].serial, this.devices[i].id);

              listObject.push(select_devices);
            }
          } else {
            if ((devices[i].detail.power_status == 'POWER_CONNECTED' || devices[i].detail.power_status == 'POWER_DISCONNECTED')
              && (devices[i].subsidiary_relation.sales_channel && devices[i].subsidiary_relation.segment.name)
              && (devices[i].device_type.prefix == 'SP' || devices[i].device_type.prefix == 'TB')) {
              let select_devices = devices[i];
              listObject.push(select_devices);
            }
          }
        }

        console.log('listObject antes', listObject);
        listObject = _.orderBy(listObject, ['detail.modified'], ['desc']);
        console.log('listObject2 despues', listObject);
        this.totalDevices = listObject.length;
        this.devices = listObject;
        this.devices_tmp = listObject;
        // console.log('this.devices', this.devices);
        if (this.totalDevices > 0) {
          this.devices.forEach(device => {
            if (Number(device.subsidiary_relation.name) !== 0) {
              this.list_subsidiaries_filter.push({ 'internal_id': Number(device.subsidiary_relation.internal_id), 'name': device.subsidiary_relation.name });
            }
          });

          this.list_subsidiaries_filter = _.chain(this.list_subsidiaries_filter).groupBy("internal_id").map((value, key) => ({
            internal_id: Number(key),
            name: value[0].name
          })).value();
          this.list_subsidiaries_filter.forEach(element => {
            this.options.push(element.internal_id + ' - ' + element.name);
          });
          this.filteredOptions = this.form_search.get("subsidiary").valueChanges.pipe(
            startWith(''),
            map(
              value => this._filterInput(value)
            )
          );

          this.getStatusGlobalConnected();
        }
      },
      error => {
        console.log('error', error);
      }
    );
  }

  //get status global total device connected
  getStatusGlobalConnected() {
    let connected_qty = 0;
    let disconnect_qty = 0;
    let i = 0;
    for (let device of this.devices) {
      let dateDiff = (moment(device['detail']['modified']).diff(moment().format(), 'minute')) * -1;
      if (dateDiff <= this.time_conexion) {
        // connected
        connected_qty++;
        this.devices[i]['detail']['online'] = true;
      } else {
        // disconnect
        disconnect_qty++;
        this.devices[i]['detail']['online'] = false;
      }
      i++;
    }

    this.alert_connected = Math.round(((Number(connected_qty) * 100) / Number(this.totalDevices))) > 50 ? false : true;
    let porc_connected = Math.round(((Number(connected_qty) * 100) / Number(this.totalDevices)));
    let porc_disconnected = Math.round(((Number(disconnect_qty) * 100) / Number(this.totalDevices)));

    this.conexion = [
      {
        "name": Number(porc_connected) + "" + " Online",
        "value": Number(porc_connected)
      },
      {
        "name": Number(porc_disconnected) + "" + " Offline",
        "value": Number(porc_disconnected)
      }
    ];

    this.device_conexion = [
      {
        "name": "Onlines",
        "value": Number(connected_qty)
      },
      {
        "name": "Offlines",
        "value": Number(disconnect_qty)
      }
    ];
    // console.log('conexion', this.conexion);
    this.getStatusGlobalCharged();
  }

  getStatusGlobalCharged() {
    let connected_qty = 0;
    let disconnect_qty = 0;
    let connected_power = 0;
    let disconnect_power = 0;
    for (let device of this.devices) {
      let battery = Number(device['detail']['battery']);
      if (battery < 30) {
        // connected
        disconnect_qty++;
      } else {
        // disconnect
        connected_qty++;
      }

      let power = device['detail']['power_status'];

      if (power == 'POWER_CONNECTED') {
        connected_power++;
      } else if (power == 'POWER_DISCONNECTED') {
        disconnect_power++;
      }

    }

    this.alert_charged = Math.round(((connected_qty * 100) / this.totalDevices)) > 50 ? false : true;
    this.alert_power = Math.round(((connected_power * 100) / this.totalDevices)) > 50 ? false : true;

    let porc_connected = Math.round(((Number(connected_qty) * 100) / Number(this.totalDevices)));
    let porc_disconnected = Math.round(((Number(disconnect_qty) * 100) / Number(this.totalDevices)));

    let porc_connected_power = Math.round(((Number(connected_power) * 100) / Number(this.totalDevices)));
    let porc_disconnected_power = Math.round(((Number(disconnect_power) * 100) / Number(this.totalDevices)));


    this.energy = [
      {
        "name": porc_connected + "" + " Óptima",
        "value": porc_connected
      },
      {
        "name": porc_disconnected + "" + " Deficiente",
        "value": porc_disconnected
      }
    ];

    this.power = [
      {
        "name": porc_connected_power + "" + " Conectado",
        "value": porc_connected_power
      },
      {
        "name": porc_disconnected_power + "" + " Desconectado",
        "value": porc_disconnected_power
      }
    ];

    this.device_energy = [
      {
        "name": "Óptima",
        "value": connected_qty
      },
      {
        "name": "Deficiente",
        "value": disconnect_qty
      }
    ];

    this.device_power = [
      {
        "name": "Óptima",
        "value": connected_power
      },
      {
        "name": "Deficiente",
        "value": disconnect_power
      }
    ];

    setTimeout(() => {
      $('.legend-label-text').map(function () {
        var text_grhap = $.trim($(this).text());
        text_grhap = text_grhap.split(' ', 2);

        if (text_grhap[0] == 'Óptima' || text_grhap[1] == 'Óptima') {
          $(this).text('Óptima (+30%)');
        } else if (text_grhap[0] == 'Deficiente' || text_grhap[1] == 'Deficiente') {
          $(this).text('Deficiente (-30%)');
        }
        else {
          $(this).text(text_grhap[1]);
        }
      }).get();

      $('.pie-label').map(function () {
        var text_grhap = $.trim($(this).text());
        text_grhap = text_grhap.split(' ', 3);
        $(this).text(text_grhap[0]);
      }).get();
    }, 100);

    this.getSalesChannel()

  }

  getTotalSubsidiariesList() {
    this.apiService.getCatalogueSubsidiaries(null, '?q=true').subscribe(
      data => {
        // console.log('##data', data);
        let subsidiaries = data.results;
        // console.log('subsidiaries', subsidiaries);
        this.list_subsidiaries = subsidiaries;
      },
      error => {
        console.log('error', error);
      }
    );
  }

  getTotalSubsidiaries() {
    this.getChannelSubsidiaries(null, 2);
  }


  getSalesChannelList() {
    this.list_channel = [];
    this.apiService.getSalesChannel().subscribe(
      data => {
        console.log('data', data);
        let list_channel = data.results;
        this.channels = list_channel;
      },
      error => {
        console.log('error', error);
      }
    );


  }

  getSalesChannel() {
    this.channels.forEach(element => {
      let filter_device = _.filter(this.devices, ['subsidiary_relation.sales_channel', element.id]);
      let connected_qty = 0;
      let disconnect_qty = 0;
      let battery_charged = 0;
      let battery_discharged = 0;
      let connected_power = 0;
      let disconnect_power = 0;
      let subsidiary_list: any[] = [];
      let i = 0;
      for (let device of filter_device) {
        let dateDiff = (moment(device['detail']['modified']).diff(moment().format(), 'minute')) * -1;
        // console.log('device', device);
        filter_device[i]['channel_name'] = element && element.name ? element.name : 'n/a';
        subsidiary_list.push({ 'id': device.subsidiary });
        // brand
        let device_name_brand = filter_device[i]['device_name_brand'];
        try {
          device_name_brand = filter_device[i]['model']['object_brand']['name']
        } catch (e) { console.log('model?', e) }

        // device_name_brand = device_name_brand.split("-", 2);
        filter_device[i]['device_name_brand'] = device_name_brand;
        if (dateDiff <= this.time_conexion) {
          // connected
          connected_qty++;
        } else {
          // disconnect
          disconnect_qty++;
        }
        let battery = Number(device['detail']['battery']);
        if (battery < 30) {
          // charged
          battery_discharged++;
        } else {
          // discharged
          battery_charged++;
        }

        let power = device['detail']['power_status'];

        if (power == 'POWER_CONNECTED') {
          connected_power++;
        } else if (power == 'POWER_DISCONNECTED') {
          disconnect_power++;
        }

        i++;
      }
      //percentage connected
      let porc_online = Number(connected_qty) !== 0 && Number(filter_device.length) !== 0 ? Math.round((Number(connected_qty) * 100) / Number(filter_device.length)) : 0;
      let porc_offline = Number(disconnect_qty) !== 0 && Number(filter_device.length) !== 0 ? Math.round((Number(disconnect_qty) * 100) / Number(filter_device.length)) : 0;
      //console.log('calculate', Math.round((Number(connected_qty)*100)/Number(filter_device.length))+' - '+Number(connected_qty)+' - '+Number(filter_device.length));

      //percentage charged
      let porc_charged = Number(battery_charged) !== 0 && Number(filter_device.length) !== 0 ? Math.round((Number(battery_charged) * 100) / Number(filter_device.length)) : 0;
      let porc_discharged = Number(battery_discharged) !== 0 && Number(filter_device.length) !== 0 ? Math.round((Number(battery_discharged) * 100) / Number(filter_device.length)) : 0;
      let porc_connected_power = Math.round(((Number(connected_power) * 100) / Number(filter_device.length)));
      let porc_disconnected_power = Math.round(((Number(disconnect_power) * 100) / Number(filter_device.length)));
      let total_general = Number(porc_online) + Number(porc_offline) + Number(porc_charged) + Number(porc_discharged);
      let alert_charged_device = Math.round(((connected_qty * 100) / this.totalDevices)) > 50 ? false : true;
      let alert_power_device = Number(porc_connected_power) > 50 ? false : true;
      let alert_connected = Number(porc_online) > 50 ? false : true;
      console.log('porc_online ** ' + element.name, porc_online)
      let total_devices = filter_device && filter_device.length > 0 ? filter_device.length : 0;

      subsidiary_list = _.chain(subsidiary_list).groupBy("id").map((value, key) => ({
        id: Number(key)
      })).value();

      let total_subsidiary = subsidiary_list && subsidiary_list.length > 0 ? subsidiary_list.length : 0;
      if ((connected_qty + disconnect_qty) > 0) {
        let list_channel_device = {
          'channel': element,
          'online': connected_qty,
          'perc_online': porc_online,
          'offline': disconnect_qty,
          'perc_offline': porc_offline,
          'devices': filter_device,
          'total_devices': total_devices,
          'total_subsidiary': total_subsidiary,
          'battery_charged': battery_charged,
          'perc_charged': porc_charged,
          'battery_discharged': battery_discharged,
          'perc_discharged': porc_discharged,
          'porc_connected_power': porc_connected_power,
          'porc_disconnected_power': porc_disconnected_power,
          'connected_power': connected_power,
          'disconnect_power': disconnect_power,
          'total_general': total_general,
          'alert_power_device': alert_power_device,
          'alert_connected': alert_connected,
          'alert_charged_device': alert_charged_device,
          'conexion': [
            {

              "value": porc_online,
              "name": "Online",
            },
            {

              "value": porc_offline,
              "name": "Offline"
            }
          ],
          'energy': [
            {
              "name": "Óptima",
              "value": porc_charged
            },
            {
              "name": "Deficiente",
              "value": porc_discharged
            }
          ],
          'power': [
            {
              "name": "Conectado",
              "value": porc_connected_power
            },
            {
              "name": "Desconectado",
              "value": porc_disconnected_power
            }
          ]
        };
        this.list_channel.push(list_channel_device);
      }
    });
    console.log('this.list_channel slide', this.list_channel);
    this.getTotalSubsidiaries();
    this.getSegmentSubsidiaries();
  }

  getChannelSubsidiaries(event?: PageEvent, type: any = null) {
    this.subsidiaries_device = [];
    this.subsidiaries_tablet_tmp = [];
    this.total_result = 0;
    this.total_device_result = 0;
    this.list_subsidiaries.forEach(element => {
      //this.options.push(element.name);
      //console.log('element subsidiaries', element);
      let filter_device = _.filter(this.devices_tmp, ['subsidiary', element.id]);
      let filter_device_list = _.filter(this.devices, ['subsidiary', element.id]);
      //console.log('filter_device.length ', filter_device.length);
      if (filter_device.length > 0) {
        var c = 0;
        var t = 0;
        var d = 0;
        var h = 0;
        var total = 0;
        let carrousel: any[] = [];
        let carrousel_device: any[] = [];
        let carrousel_tb: any[] = [];
        let carrousel_tablet: any[] = [];
        let channel_name: any;
        let channel_id: any;
        let segment_name: any;
        let segment_id: any;
        let city: any;
        let id_city: any;
        let device_type: any;
        let qty_sp = 0
        let qty_tb = 0

        filter_device.forEach(device => {

          channel_name = device.channel_name;
          channel_id = device.subsidiary_relation.sales_channel;
          segment_name = device.subsidiary_relation.segment.name;
          segment_id = device.subsidiary_relation.segment.id;
          device_type = device.device_type?.prefix;
          city = device.subsidiary_relation.region_name;
          id_city = device.subsidiary_relation.region;
          if (device_type == 'SP' || device_type == 'TP') {
            qty_sp++;
            if (c < 5) {
              carrousel.push(device);
              if (c == 4) {
                carrousel_device[d] = carrousel;
                carrousel = [];
                d++;
                c = -1;
              } else if (c < 4 && carrousel.length > 0) {
                carrousel_device[d] = carrousel;
              }
            }
            c++;
          }
          if (device_type == 'TB' || device_type == 'TT') {
            qty_tb++;
            if (t < 5) {
              carrousel_tb.push(device);
              if (t == 4) {
                carrousel_tablet[h] = carrousel_tb;
                carrousel_tb = [];
                h++;
                t = -1;
              } else if (c < 4 && carrousel_tb.length > 0) {
                carrousel_tablet[h] = carrousel_tb;
              }
            }
            t++;
          }
          total++;
        });
        // console.log('channel_name', channel_name) && channel_name && segment_name;
        // if ((carrousel_device.length > 0 || carrousel_tablet.length > 0)) {
        if ((channel_name && segment_name)) {
          let total_device = filter_device_list.length;

          let group_subsidiaries = {
            'id': element.id,
            'internal_id': element.internal_id,
            'name': element.name,
            'device_subsidiaries': carrousel_device,
            'device_tablet': carrousel_tablet,
            'channel_name': channel_name,
            'channel_id': channel_id,
            'segment_name': segment_name,
            'segment_id': segment_id,
            'city': city,
            'region': id_city,
            'total_device': total_device,
            'result_device': total,
            'qty_sp': qty_sp,
            'qty_tb': qty_tb
          };
          this.total_result = total + this.total_result;
          this.total_device_result = total_device + this.total_device_result;
          this.subsidiaries_device.push(group_subsidiaries);
          let carousel_name = 'carousel_' + element.id
          if ((carrousel_device.length > 0 || carrousel_tablet.length > 0)) {
            setTimeout(() => {
              // this.before = 'before';
              this.spinner = false;
              this.materializeSlider(element.id);
            }, 1500);
          }

        } else {
          //  console.log('total', total);
          //  console.log('carrousel_device', carrousel_device);
          // console.log('if', carrousel_device.length+' - '+channel_name);
        }

      }
    });


    this.subsidiaries_device_tmp = this.subsidiaries_device;
    if (this.subsidiaries_device.length > 0) {
      this.datasource_device = this.subsidiaries_device;
      this.datasource = this.datasource_device;
      this.pageIndex = event && event.pageIndex ? event.pageIndex : 0;
      this.pageSize = event && event.pageSize ? event.pageSize : 10;
      this.length = this.subsidiaries_device.length;

      let devices = this.subsidiaries_device;
      // _.forEach(devices, function(v, i) {devices[i] = {pages: i}});
      this.subsidiaries_device_tmp = this.filter(devices, this.pageSize, this.pageIndex);
      //console.log('event', event);
      console.log('this.subsidiaries_device_tmp **', this.subsidiaries_device_tmp)

    } else {
      this.spinner = false;
    }

    this.list_region = [];
    let list_subsidiaries_filter = [];
    this.devices.forEach(device => {
      // console.log('device', device);
      if (Number(device.subsidiary_relation.region) !== 0) {
        this.list_region.push({ 'id': Number(device.subsidiary_relation.region), 'name': device.subsidiary_relation.region_name });
      }

      if (Number(device.subsidiary_relation.sales_channel) !== 0) {
        this.list_channel_filter.push({ 'id': Number(device.subsidiary_relation.sales_channel), 'name': device.channel_name });
      }

      if (device.subsidiary_relation.segment.name !== '') {
        this.list_segments_filter.push({ 'id': Number(device.subsidiary_relation.segment.id), 'name': device.subsidiary_relation.segment.name, 'sales_channel': device.subsidiary_relation.sales_channel });
      }
    });

    this.list_region = _.chain(this.list_region).groupBy("id").map((value, key) => ({
      id: Number(key),
      name: value[0].name
    })).value();

    this.total_result_subsidiaries = this.subsidiaries_device.length;

    this.list_segments_filter = _.chain(this.list_segments_filter).groupBy("id").map((value, key) => ({
      id: Number(key),
      name: value[0].name,
      sales_channel: value[0].sales_channel
    })).value();

    let form_seach_valid: any[] = this.form_search.value.channel;

    if (form_seach_valid == null || form_seach_valid.length == 0) {
      this.list_segments_filter_tmp = [];
      this.list_segments_filter_tmp = this.list_segments_filter;
    }

    this.list_channel_filter = _.chain(this.list_channel_filter).groupBy("id").map((value, key) => ({
      id: Number(key),
      name: value[0].name
    })).value();
    if (this.search_event) {
      this.total_subsidiaries = Number(this.subsidiaries_device.length);
    }

    this.select_channel = _.chain(this.subsidiaries_device).groupBy("channel_name").map((value, key) => ({
      id: value[0].channel_id,
      name: value[0].channel_name
    })).value();

    this.select_segment = _.chain(this.subsidiaries_device).groupBy("segment_name").map((value, key) => ({
      id: value[0].segment_id,
      name: value[0].segment_name
    })).value();

    this.select_region = _.chain(this.subsidiaries_device).groupBy("city").map((value, key) => ({
      id: value[0].region,
      name: value[0].city
    })).value();

    setTimeout(() => {
      // this.before = 'before';
      // this.spinner = false;
      this.materializeSlider('main');
    }, 1000);

    return event;
  }


  private _filterInput(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }


  materializeSlider(item: any = null) {
    let _carousel = '.carousel';
    let _arrow = '.boxArrow';
    if (item) {
      _carousel = _carousel + '_' + item
      _arrow = _arrow + '_' + item
    }
    // console.log('carousel', _carousel, _arrow);
    try {
      $(_carousel).carousel({
        fullWidth: true,
        indicators: true
      });
      // move next carousel
      $(_arrow + '.right').click(function (e) {
        e.preventDefault();
        e.stopPropagation();
        $(_carousel).carousel('next');
      });
      // move prev carousel
      $(_arrow + '.left').click(function (e) {
        e.preventDefault();
        e.stopPropagation();
        $(_carousel).carousel('prev');
      });
      console.log('MATERIALIZE OK')

    } catch (e) {
      console.log('_error slider', e)
    }
  }

  filter(devices, pageSize, pageIndex) {
    var results = [];
    var i = 0;
    var start_data = pageIndex !== 0 ? ((pageSize * pageIndex)) : 0;
    var end_data = pageIndex !== 0 ? ((pageSize * pageIndex) + pageSize) : pageSize;
    _.forEach(devices, function (device) {
      if (i >= start_data && i < end_data) {
        results.push(device);
      }
      i++;
    });
    return results;
  }

  getUpdateDevice(device) {
    this.spinner = true;
    console.log('device refresh', device);
    this.apiService.getUpddateDevice(device.internal_code).subscribe(
      data => {
        // console.log('##data', data);
        device.detail.battery = data.detail && data.detail.battery ? data.detail.battery : '0';
        let dateDiff = data.detail && data.detail.modified ? (moment(data.detail.modified).diff(moment().format(), 'minute')) * -1 : '';

        let device_name_brand = data.device_name ? data.device_name : '';
        device_name_brand = device_name_brand.split("-", 2);
        device.device_name_brand = device_name_brand[0].replace(/\s/g, "");

        // brand
        device_name_brand = data['device_name_brand'];
        try {
          device_name_brand = data['model']['object_brand']['name']
        } catch (e) { console.log('model?', e) }
        device.device_type.name = data.device_type && data.device_type.name ? data.device_type.name : '';
        if (data.model === null) {
          //device.model.name = '';
        } else {
          device.model.name = data.model.name;
        }
        device.detail.screenshot = data.detail && data.detail.screenshot && data.detail.screenshot !== '' ? data.detail.screenshot : '';
        if (dateDiff <= this.time_conexion) {
          // connected
          device.detail.online = true;
        } else {
          // disconnect
          device.detail.online = false;
        }
        // console.log('device add', device)
        this.spinner = false;
      },
      error => {
        console.log('error', error);
      }
    );
  }

  openAllFirst() {
    this.firstAccordion.openAll();
  }
  closeAllFirst() {
    this.firstAccordion.closeAll();
  }
  openAllSecond() {
    this.secondAccordion.openAll();
  }
  closeAllSecond() {
    this.secondAccordion.closeAll();
  }

  removeChannel(channel_id) {
    // console.log('channel_id', channel_id);
    let form_channel: any[] = this.form_search.value['channel'];
    let select_channel: any[] = [];
    form_channel.forEach(element => {
      if (element !== channel_id) {
        select_channel.push(element);
      }
    });
    this.form_search.controls['channel'].setValue(select_channel);
  }

  removeSegment(segment_id) {
    // console.log('channel_id', channel_id);
    let form_segment: any[] = this.form_search.value['segment'];
    let select_segment: any[] = [];
    form_segment.forEach(element => {
      if (element !== segment_id) {
        select_segment.push(element);
      }
    });

    this.form_search.controls['segment'].setValue(select_segment);
  }

  removeRegion(region_id) {
    // console.log('region_id', region_id);
    let form_region: any[] = this.form_search.value['city'];
    let select_region: any[] = [];
    form_region.forEach(element => {
      if (element !== region_id) {
        select_region.push(element);
      }
    });
    this.form_search.controls['city'].setValue(select_region);
  }

  getStaff() {
    this.apiService.getUserData().subscribe(
      data => {
        console.log('##data staff', data);
        this.is_staff = data.is_staff;
        if (this.is_staff) {
          this.type_device = 'SP,TP,TB,TT';
        } else {
          this.type_device = 'SP,TB';
        }
        this.getTotalDevices();
      },
      error => {
        console.log('error', error);
      }
    );

  }

  getDataDeviceExcelAsync(devices: any) {
    this.getDataDeviceExcel(devices);
  }


  getDataDeviceExcel(devices: any = null) {
    console.log('this.devices_excel', devices);
    let subsidiaries = this.devices_excel;
    this.devices_excel = devices;
    let name_subsidiary: string = this.devices_excel.channel.name;
    let workbook = new ExcelJS.Workbook();
    let worksheet = workbook.addWorksheet(name_subsidiary);
    worksheet.mergeCells('A1:G1');
    worksheet.getCell('A1:G1').value = 'INFORMACIÓN PDV ENTEL';
    worksheet.getCell('A1:G1').alignment = { horizontal: 'center' };
    worksheet.getCell('A1:G1').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD800' }
    };

    worksheet.mergeCells('H1:O1');
    worksheet.getCell('H1:O1').value = 'INFORMACIÓN DISPOSITIVO';
    worksheet.getCell('H1:O1').alignment = { horizontal: 'center' };
    worksheet.getCell('H1:O1').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF7000' }
    };

    worksheet.mergeCells('P1:S1');
    worksheet.getCell('P1:S1').value = 'INFORMACIÓN APP ADSCREEN';
    worksheet.getCell('P1:S1').alignment = { horizontal: 'center' };
    worksheet.getCell('P1:S1').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '008FFF' }
    };

    //columns name
    let header = ["ID TIENDA", "CANAL", "SEGMENTO", "SUCURSAL", "DIRECCIÓN", "COMUNA", "REGIÓN", "MARCA", "MODELO", "NOMBRE DISPOSITIVO", "CÓDIGO MDM", "IMEI N°1", "IMEI N°2", "IP", "MAC", 'VERSIÓN APK', "WIFI", "ESTADO CONEXIÓN INTERNET", "ESTADO CONEXIÓN ENERGÍA", "ÚLTIMA CONEXIÓN"];

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
      { key: 'ID TIENDA', width: 10 },
      { key: 'CANAL', width: 20 },
      { key: 'SEGMENTO', width: 20 },
      { key: 'SUCURSAL', width: 30 },
      { key: 'DIRECCION', width: 40 },
      { key: 'COMUNA', width: 25 },
      { key: 'REGION', width: 40 },
      { key: 'MARCA', width: 20 },
      { key: 'MODELO', width: 20 },
      { key: 'NOMBRE DISPOSITIVO', width: 25 },
      { key: 'CODIGO MDM', width: 20 },
      { key: 'IMEI N°1', width: 25 },
      { key: 'IMEI N°2', width: 25 },
      { key: 'IP', width: 20 },
      { key: 'MAC', width: 20 },
      { key: 'WIFI', width: 25 },
      { key: 'ESTADO CONEXION INTERNET', width: 27 },
      { key: 'ESTADO CONEXION ENERGIA', width: 27 },
      { key: 'ÚLTIMA CONEXION', width: 25 },

    ]

    var self = this;
    let devices_excel = _.orderBy(devices.devices, ['subsidiary_relation.internal_id'], ['asc']);

    console.log('this.devices_excel order by #', devices_excel);

    devices_excel.map(function (element: any) {
      let internal_id = element.subsidiary_relation && element.subsidiary_relation.internal_id ? element.subsidiary_relation.internal_id : '';
      let channel_name = element.channel_name ? element.channel_name : '';
      let segment_name = element.subsidiary_relation && element.subsidiary_relation.segment && element.subsidiary_relation.segment.name ? element.subsidiary_relation.segment.name : '';
      let subsidiary_name = element.subsidiary_relation && element.subsidiary_relation.name ? element.subsidiary_relation.name : '';
      let subsidiary_address = element.subsidiary_relation && element.subsidiary_relation.address ? $(element.subsidiary_relation.address).text() : '';
      let commune_name = element.subsidiary_relation && element.subsidiary_relation.commune ? element.subsidiary_relation.commune : '';
      let region_name = element.subsidiary_relation && element.subsidiary_relation.region_name ? element.subsidiary_relation.region_name : '';
      let device_name_brand = element.device_name_brand ? element.device_name_brand : '';
      let model_name = element.model && element.model.name ? element.model.name : '';
      let device_name = element.device_name ? element.device_name : '';
      let internal_code = element.internal_code ? element.internal_code : '';
      let imei_1 = element.info && element.info.info && element.info.info.device && element.info.info.device.networkInfo && element.info.info.device.networkInfo.imei1 ? element.info.info.device.networkInfo.imei1 : '';
      let imei_2 = element.info && element.info.info && element.info.info.device && element.info.info.device.networkInfo && element.info.info.device.networkInfo.imei2 ? element.info.info.device.networkInfo.imei2 : '';
      let ip_address = element.detail && element.detail.ip_address ? element.detail.ip_address : '';
      let mac_address = element.detail && element.detail.mac_address ? element.detail.mac_address : '';
      let wifi_device = element.info && element.info.info && element.info.info.device && element.info.info.device.wifi_access_points[0] ? element.info.info.device.wifi_access_points[0].wifi_ssid : '';
      let version_apk = element.detail && element.detail.context_data && element.detail.context_data.versionName ? element.detail.context_data.versionName : '';
      let online = element.detail.online ? 'Online' : 'Offline';
      let power_status = element.detail.power_status && element.detail.power_status == 'POWER_DISCONNECTED' ? 'Desconectado' : 'Conectado';
      let modified = element.detail.modified ? self.utils.getDateFormatDevice(element.detail.modified) + ' a las ' + self.utils.getHourFormatDevice(element.detail.modified) : '';
      let temp = [internal_id, channel_name, segment_name, subsidiary_name, subsidiary_address, commune_name, region_name, device_name_brand, model_name, device_name, internal_code, imei_1, imei_2, ip_address, mac_address, version_apk, wifi_device, online, power_status, modified];
      worksheet.addRow(temp);

    });
    //set downloadable file name
    let fname = name_subsidiary;

    //add data and file name and download
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, fname + '_' + moment().format('YYYY_MM_DD_HH_mm') + '.xlsx');
    });
  }

  getSegmentSubsidiariesList() {
    this.list_segment = [];
    this.list_segment_tmp = [];
    this.apiService.getSegment().subscribe(
      data => {
        this.list_segment_data = data.results;
        console.log('this.list_segment_data', this.list_segment_data);
      },
      error => {
        console.log('error', error);
      }
    );
  }


  getSegmentSubsidiaries() {
    if (this.list_segment_data?.length > 0) {
      this.list_segment_data.forEach(element => {
        // console.log('element segment', element);
        let filter_device = _.filter(this.devices, ['subsidiary_relation.segment.id', element.id]);
        // console.log('filter_segment', filter_device);
        let connected_qty = 0;
        let disconnect_qty = 0;
        let battery_charged = 0;
        let battery_discharged = 0;
        let connected_power = 0;
        let disconnect_power = 0;
        let subsidiary_list: any[] = [];
        let i = 0;
        for (let device of filter_device) {
          let dateDiff = (moment(device['detail']['modified']).diff(moment().format(), 'minute')) * -1;
          filter_device[i]['segment_name'] = element && element.name ? element.name : 'n/a';
          subsidiary_list.push({ 'id': device.subsidiary });
          let device_name_brand = device.device_name;
          device_name_brand = device_name_brand.split("-", 2);

          device_name_brand = filter_device[i]['device_name_brand'];
          try {
            device_name_brand = filter_device[i]['model']['object_brand']['name']
          } catch (e) { console.log('model?', e) }

          filter_device[i]['device_name_brand'] = device_name_brand;

          filter_device[i]['channel_id'] = device && device.subsidiary_relation && device.subsidiary_relation.sales_channel ? device.subsidiary_relation.sales_channel : 0;
          if (dateDiff <= this.time_conexion) {
            // connected
            connected_qty++;
          } else {
            // disconnect
            disconnect_qty++;
          }
          let battery = Number(device['detail']['battery']);
          if (battery < 30) {
            // charged
            battery_discharged++;
          } else {
            // discharged
            battery_charged++;
          }

          let power = device['detail']['power_status'];

          if (power == 'POWER_CONNECTED') {
            connected_power++;
          } else if (power == 'POWER_DISCONNECTED') {
            disconnect_power++;
          }

          i++;
        }
        //percentage connected
        let porc_online = Number(connected_qty) !== 0 && Number(filter_device.length) !== 0 ? Math.round((Number(connected_qty) * 100) / Number(filter_device.length)) : 0;
        let porc_offline = Number(disconnect_qty) !== 0 && Number(filter_device.length) !== 0 ? Math.round((Number(disconnect_qty) * 100) / Number(filter_device.length)) : 0;

        //console.log('calculate', Math.round((Number(connected_qty)*100)/Number(filter_device.length))+' - '+Number(connected_qty)+' - '+Number(filter_device.length));

        //percentage charged
        let porc_charged = Number(battery_charged) !== 0 && Number(filter_device.length) !== 0 ? Math.round((Number(battery_charged) * 100) / Number(filter_device.length)) : 0;
        let porc_discharged = Number(battery_discharged) !== 0 && Number(filter_device.length) !== 0 ? Math.round((Number(battery_discharged) * 100) / Number(filter_device.length)) : 0;

        let porc_connected_power = Math.round(((Number(connected_power) * 100) / Number(filter_device.length)));
        let porc_disconnected_power = Math.round(((Number(disconnect_power) * 100) / Number(filter_device.length)));


        let total_general = Number(porc_online) + Number(porc_offline) + Number(porc_charged) + Number(porc_discharged);

        let alert_charged_device = Math.round(((connected_qty * 100) / this.totalDevices)) > 50 ? false : true;
        let alert_power_device = Number(porc_connected_power) > 50 ? false : true;
        let alert_connected = Number(porc_online) > 50 ? false : true;

        let total_devices = filter_device && filter_device.length > 0 ? filter_device.length : 0;


        subsidiary_list = _.chain(subsidiary_list).groupBy("id").map((value, key) => ({
          id: Number(key)
        })).value();

        let total_subsidiary = subsidiary_list && subsidiary_list.length > 0 ? subsidiary_list.length : 0;
        if ((connected_qty + disconnect_qty) > 0) {
          let list_segment_device = {
            'segment': element,
            'online': connected_qty,
            'perc_online': porc_online,
            'offline': disconnect_qty,
            'perc_offline': porc_offline,
            'devices': filter_device,
            'total_devices': total_devices,
            'total_subsidiary': total_subsidiary,
            'battery_charged': battery_charged,
            'perc_charged': porc_charged,
            'battery_discharged': battery_discharged,
            'perc_discharged': porc_discharged,
            'porc_connected_power': porc_connected_power,
            'porc_disconnected_power': porc_disconnected_power,
            'connected_power': connected_power,
            'disconnect_power': disconnect_power,
            'total_general': total_general,
            'alert_power_device': alert_power_device,
            'alert_connected': alert_connected,
            'alert_charged_device': alert_charged_device,
            'conexion': [
              {
                "name": porc_online + "%" + " Online",
                "value": porc_online
              },
              {
                "name": porc_offline + "%" + " Offline",
                "value": porc_offline
              }
            ],
            'energy': [
              {
                "name": porc_charged + "%" + " Óptima",
                "value": porc_charged
              },
              {
                "name": porc_discharged + "%" + " Deficiente",
                "value": porc_discharged
              }
            ],
            'power': [
              {
                "name": porc_connected_power + "%" + " Conectado",
                "value": porc_connected_power
              },
              {
                "name": porc_disconnected_power + "%" + " Desconectado",
                "value": porc_disconnected_power
              }
            ]
          };
          this.list_segment.push(list_segment_device);
        }
      });
    }

    this.list_segment_tmp = this.list_segment;
    this.list_segment_tmp = _.orderBy(this.list_segment_tmp, ['segment.name'], ['asc']);
    // console.log('this.list_channel slide', this.list_segment);
  }

  nextCarousel(event) {
    console.log('event', event);
  }

  ChangeOrderAll(){
    for(let s of this.subsidiaries_device_tmp) {
      console.log('order all', s)
      this.ChangeOrder(s);
    }
  }


  ChangeOrder(subsidiaries) {
    console.log('charger_order', subsidiaries)
    this.spinner = true;
    let order = this.form_order.get('order').value;
    // subsidiaries_device_tmp
    console.log('order', order);
    let device_subsidiaries = subsidiaries.device_subsidiaries.map(value =>
      _.orderBy(value, [(obj: any) => new Date(obj.detail.modified).getTime()], [order])
    );

    let device_tablet = subsidiaries.device_tablet.map(value =>
      _.orderBy(value, [(obj: any) => new Date(obj.detail.modified).getTime()], [order])
    );

    subsidiaries['device_subsidiaries'] = device_subsidiaries;
    subsidiaries['device_tablet'] = device_tablet;

    setTimeout(() => {
      this.materializeSlider();
      this.before = 'before';
      this.spinner = false
      $(".modalChart .chart g.x.axis text").css("font-size", "20px !important");
    }, 100);

  }


}
