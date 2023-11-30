import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-notification-popup',
  templateUrl: './notification-popup.component.html',
  styleUrls: ['./notification-popup.component.scss']
})

export class NotificationPopupComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  @Input() dialogTitle: string;

  title: string;
  text: string;

  ngOnInit(): void {

    this.title = this.data.title;
    this.text = this.data.text;
  }

  confirmDialog(){
    return
  }


}
