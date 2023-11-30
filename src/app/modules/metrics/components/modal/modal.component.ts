import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  constructor(
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  
  openDialog(templateRef) {     
    console.log('device');
      let dialogRef = this.dialog.open(templateRef, {
        width: '100%',
        height: 'auto',
        autoFocus: false
      });
  }


}
