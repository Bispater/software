import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/services/services.service';
import { MatMenu } from '@angular/material/menu';
import { Subjects } from 'src/app/utils/subjects';
import * as _ from 'lodash';

@Component({
  selector: 'app-circle-option',
  templateUrl: './circle-option.component.html',
  styleUrls: ['./circle-option.component.scss']
})
export class CircleOptionComponent implements OnInit {


  @Input() element: any;
  @Input() element_type: any;

  options: any[];
  defaultColor = '#ccc';
  checked = false;
  showColor = true;
  items: any = []
  id_cause: number;

  constructor(
    private service: ApiService,
    private subject: Subjects,
  ) { }

  ngOnInit(): void {
    this.getCause()
  }

  getCause() {
    this.options = this.subject.allCauses$.getValue();
  }

  selectedColor(color: string) {
    let flag = false;
    if (color === 'blue_light') {
      this.defaultColor = '#3AB4E8'
      this.id_cause = 3;
    } else {
      this.defaultColor = color;
    }

    if (color === 'red') {
      this.id_cause = 1;
    } else {
      if (color === 'yellow') {
        this.id_cause = 2;
      }
    }

    let currentPlaceId = this.subject.actualPlaceId$.getValue();
    let subject = this.subject.metricDataSubject$.getValue();
    // validate if there's not other color selected before
    for (let item of subject.devices) {
      if (item.place_id === currentPlaceId) {
        for (let i = 0; i < item.items.length; i++) {
          let validate = item.items[i];
          // if the color is the same as the selected one don't do anything
          if (validate.cause_off === this.id_cause) {
            flag = true;
            break;
          } else {
            // if color is not the same that before it delete the old color and push the current one
            if (validate.element === this.element.id && validate.item_type_code === this.element_type && validate.cause_off != this.id_cause) {
              let element = item.items;
              element.splice(i, 1);
              let newObject = {
                element: this.element.id,
                item_type_code: this.element_type,
                display_on: false,
                cause_off: this.id_cause,
              }
              this.subject._nextMetricPlaceDevice(currentPlaceId, null, null, null, newObject)
              flag = true;
            }
          }
        }
      }
    }

    if (!flag) {
      let object = {
        element: this.element.id,
        item_type_code: this.element_type,
        display_on: false,
        cause_off: this.id_cause,
      }
      this.subject._nextMetricPlaceDevice(currentPlaceId, null, null, null, object)
    }

  }

  onToggleChange(event: any) {
    // if event is true the color is setted as green and cause_off to null
    if (event.checked) {
      this.showColor = false;
      let currentPlaceId = this.subject.actualPlaceId$.getValue();
      //current object of true event with display equal to true and cause equals to null (colors goes green)
      let object = {
        element: this.element.id,
        item_type_code: this.element_type,
        display_on: true,
        cause_off: null
      }
      let subject = this.subject.metricDataSubject$.getValue();

      // delete if passing false to true and it was setted a color (red, yellow or blue)
      for (let item of subject.devices) {
        if (item.place_id === currentPlaceId) {
          for (let i = 0; i < item.items.length; i++) {
            if (item.items[i].element === this.element.id && item.items[i].item_type_code === this.element_type) {
              let element = item.items;
              element.splice(i, 1);
              this.subject.metricDataSubject$.next(subject);
            }
          }
        }
      }

      this.subject._nextMetricPlaceDevice(currentPlaceId, null, null, null, object)
      console.log("toggle subject : ", this.subject.metricDataSubject$.getValue());

    } else {
      // when toggle is passing from true to false we set default color and we active the mat menu option
      // and we need to delete the actual item of the element
      this.defaultColor = '#ccc';
      this.showColor = true;
      let currentPlaceId = this.subject.actualPlaceId$.getValue();
      let subject = this.subject.metricDataSubject$.getValue();

      // search the true element to delete and set with the disabled toggle value
      for (let item of subject.devices) {
        if (item.place_id === currentPlaceId) {
          for (let i = 0; i < item.items.length; i++) {
            // fuound the element by his ID and by the type_code (displayed or card)
            if (item.items[i].element === this.element.id && item.items[i].item_type_code === this.element_type) {
              let element = item.items;
              element.splice(i, 1);
            }
          }
        }
      }
      // update the subject without the deleted element
      console.log("updated element from true to false ", this.subject.metricDataSubject$.getValue());
      this.subject.metricDataSubject$.next(subject);
    }
  }

}
