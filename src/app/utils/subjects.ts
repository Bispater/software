import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { MetricModel } from "./metric-data.interface";
import * as _ from 'lodash';

@Injectable({
    providedIn: 'root'
})

export class Subjects {

    actualPlaceId$ = new BehaviorSubject(null);
    allCauses$ = new BehaviorSubject(null);
    userActive$ = new BehaviorSubject(false);
    metricDataSubject$ = new BehaviorSubject<MetricModel>(<MetricModel>(
        {
            subsidiary: null,
            devices: [

            ]
        }
    ));

    _nextMetricSub(subsidiary_id: number) {
        console.log("subsidiary choosed: ", subsidiary_id);
        this.metricDataSubject$.next({
            ...this.metricDataSubject$.value,
            subsidiary: subsidiary_id
        });
        console.log(this.metricDataSubject$.getValue());
    }

    _nextMetricPlaceDevice(place: number, index: any = null, custom_score: number = null, image_url: any = null, item_data : any = null) {
        let md = this.metricDataSubject$.getValue()
        let custom = 0;
        let validate = 0;
        let obj = {
            place_id: place,
            custom_score: 0,
            images: [],
            items: [],
        }
        for (let item of md.devices) {
            if (item.place_id === place) {
                // if  exists ->  modify inner variables.
                item.custom_score = custom_score;
                item.items.push(item_data);
                if (image_url) {
                    item.images.push(image_url);
                }
                validate = 1;
                break;
            }
        }
        // if doesn't exist -> create and push a new empty object.
        if (validate === 0) {
            md.devices.push(obj)
        }

        this.metricDataSubject$.next(md);
        console.log(this.metricDataSubject$.getValue());
    }
}