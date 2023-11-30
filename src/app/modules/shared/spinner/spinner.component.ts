import { Component, OnInit, Input } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit {
  @Input ('spinner') spinnerBoolean;

  constructor(
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
  }

  ngOnChanges(){
    if(this.spinnerBoolean === true){
      this.spinner.show();
    } else {
      this.spinner.hide();
    }
  }

}
