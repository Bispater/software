import { Component, OnInit, Input, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit  {

  @Input()  message_tmp:any;
  @Input()  status_tmp:any;

  public message:any;
  public status:any;

  public alert_status:boolean = false;
  
  constructor(
    
  ) { 
  
  }

  ngOnInit(): void {
    //console.log('message_tmp', this.message_tmp);
    
    

  }
  

  /* Alert */
	
	changeFromAlert(){
    //console.log('message',message);
		this.message = this.message_tmp;
    this.status = this.status_tmp;
    //console.log('status',this.status);
    
  }
  
  getAlertMessage(){
    return this.message;
  }

  getAlertStatus(){
    return this.message;
  }
  ngOnChanges(changes: SimpleChanges) {
    //console.log('message_tmp', this.message_tmp);
    this.message = changes.message_tmp.currentValue;
    this.status = changes.status_tmp.currentValue; 
    
  }

  

}
