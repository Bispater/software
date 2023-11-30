import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';
import * as moment from 'moment';
import "moment/locale/es";

@Pipe({
  name: 'safe'
})
export class SafePipe implements PipeTransform {

  constructor(protected sanitizer: DomSanitizer) {}
 
 public transform(value: any, type: string): SafeHtml | SafeStyle | SafeScript | SafeUrl | SafeResourceUrl {
    switch (type) {
			case 'html': return this.sanitizer.bypassSecurityTrustHtml(value);
			case 'no-html': return this.strip_html_tags(value);
			case 'style': return this.sanitizer.bypassSecurityTrustStyle(value);
			case 'script': return this.sanitizer.bypassSecurityTrustScript(value);
			case 'url': return this.sanitizer.bypassSecurityTrustUrl(value);
			case 'resourceUrl': return this.sanitizer.bypassSecurityTrustResourceUrl(value);
      case 'remove-string': return this.removeString(value);
      case 'clean-nameBrand': return this.cleanNameBrand(value);
      case 'calculate-days': return this.calculateDays(value);
			default: throw new Error(`Invalid safe type specified: ${type}`);
		}
  }

  strip_html_tags(str: string)
  {
    if ((str===null) || (str===''))
        return false;
    else
    str = str.toString();
    return str.replace(/<[^>]*>/g, '');
  }

  removeString(cadena){
    const acentos = {'á':'a','é':'e','í':'i','ó':'o','ú':'u','Á':'A','É':'E','Í':'I','Ó':'O','Ú':'U',' ':'_'};
    cadena.split('').map( letra => acentos[letra] || letra).join('').toString();
    return cadena.substring(0, 15);	
  }

  cleanNameBrand(value:any){
    let device_name_brand = value;
    device_name_brand = device_name_brand.split("-", 2);
    return device_name_brand[0].replace(/\s/g, "");
  }

  calculateDays(date_old){
    let date_now = moment().format('YYYY-MM-DDTHH:mm:ss.SSSSSS');
    //return date_old.diff(date_now, 'days');
    //return date_old.from(date_now, true);
    return moment(date_old).fromNow(true); 
}
}