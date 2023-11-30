
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import "moment/locale/es";
import * as _ from "lodash";

@Injectable({
    providedIn: 'root'
    })

export class Utils{
    // capitalize
    public setCapitalize(word: string) {
        if (!word) return word;
        return word[0].toUpperCase() + word.substr(1).toLowerCase();
    }
    // date format
    getDateFormat(date: any, format: string = 'DD/MM/YYYY HH:mm') {
        return moment(date).format(format)
    }

    getDateFormatChart(date: any, format: string = 'DD-MM') {
        return moment(date).format(format)
    }

    getDateFormatDevice(date: any, format: string = 'DD/MM/YYYY') {
        return moment(date).format(format)
    }

    getHourFormatDevice(date: any, format: string = 'HH:mm') {
        return moment(date).format(format)
    }

    calculateDays(date_old){
        let date_now = moment().format('YYYY-MM-DDTHH:mm:ss.SSSSSS');
        //return date_old.diff(date_now, 'days');
        //return date_old.from(date_now, true);
        return moment(date_old).fromNow(true); 
    }

    decimalAdjust(type, value, exp) {
        // Si exp es undefined o cero...
        if (typeof exp === 'undefined' || +exp === 0) {
            return Math[type](value);
        }
        value = +value;
        exp = +exp;
        // Si el valor no es un número o exp no es un entero...
        if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
            return NaN;
        }
        // Shift
        value = value.toString().split('e');
        value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
        // Shift back
        value = value.toString().split('e');
        return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
    }

    objToString(object) {

        const resultArray = Object.keys(object).map(index => {
            return object[index].name;
        });

        var str = '';
        var i = 0;
        for (var k in resultArray) {
          if (resultArray.hasOwnProperty(k)) {
              if(i==0){
                str +=  resultArray[k];
              }else{
                str += ', ' + resultArray[k];
              }
          }
          i++;
        }
        console.log(str);
        return str;
    }

    dateStartElastic(){
        return "2021-11-15T00:00:00.000";
    }

    dateEndElastic(){
        return moment().format('YYYY-MM-DD') + "T23:59:59.000";
    }

    filter(devices, pageSize, pageIndex) {
        var results = [];
        var i = 0;
        var start_data = pageIndex!==0 ? ((pageSize*pageIndex)) : 0;
        var end_data = pageIndex!==0 ? ((pageSize*pageIndex)+pageSize) : pageSize;
        console.log('start_data', start_data);
        console.log('end_data', end_data);
        // console.log('devices filter***', devices);
        _.forEach(devices, function(device) {
            if(i >= start_data && i < end_data){
                results.push(device);
            }
            i++;
        });

        console.log('results', results);
        return results;
    }
}