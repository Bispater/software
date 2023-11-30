import { Component, Output, EventEmitter } from '@angular/core';

export var single = [
  {
    "name": "Germany",
    "value": 8940000
  },
  {
    "name": "USA",
    "value": 5000000
  },
  {
    "name": "France",
    "value": 7200000
  },
  {
    "name": "France2",
    "value": 7200000
  },
  {
    "name": "France3",
    "value": 7200000
  }
];


export var multi = [
  {
    "name": "Germany",
    "series": [
      {
        "name": "2010",
        "value": 7300000
      },
      {
        "name": "2011",
        "value": 8940000
      }
    ]
  },

  {
    "name": "USA",
    "series": [
      {
        "name": "2010",
        "value": 7870000
      },
      {
        "name": "2011",
        "value": 8270000
      }
    ]
  },
  {
    "name": "USA2",
    "series": [
      {
        "name": "2012",
        "value": 7870002
      },
      {
        "name": "2011",
        "value": 8270000
      }
    ]
  },
  {
    "name": "USA3",
    "series": [
      {
        "name": "2013",
        "value": 7870003
      },
      {
        "name": "2011",
        "value": 8270000
      }
    ]
  },

  {
    "name": "France",
    "series": [
      {
        "name": "2010",
        "value": 5000002
      },
      {
        "name": "2011",
        "value": 5800000
      }
    ]
  }
];

declare var $:any;

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']

  
})


export class ChartComponent {
  
  @Output() messageEvent = new EventEmitter<any[]>();
  chart_single: any[];

  single: any[];
  multi: any[];

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
  yAxisLabel = 'Population';

  chartsActive:boolean = false

  colorScheme:any;
  constructor() {
    Object.assign(this, { single })
  }

  sendMessage() {
    this.messageEvent.emit(this.chart_single)
  }

  onSelect(event) {
    console.log(event);
  }
  ngOnInit(): void {
    this.colorScheme= {
      domain: ['#42E8B4', '#42E8B4', '#42E8B4', '#42E8B4' , '#42E8B4', '#42E8B4']
    };
    setTimeout(()=>{                           //<<<---using ()=> syntax
      this.chartsActive = true
    }, 2000);
    $('.ngx-charts').css("display","inline-block !important");
    $('.ngx-charts').css("width","100% !important");
    $('.ngx-charts').css("float","none");
    $('.ngx-charts').css("height","395px");
    
  }

  
}
