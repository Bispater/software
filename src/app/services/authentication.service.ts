import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {GlobalService} from './global.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthenticationService {
  constructor(private http: HttpClient, private globalService: GlobalService) {}
  private baseUrl = environment.urlBase + 'hxc/api/login_token_v2/';
  //private baseUrl = this.globalService.baseUrl + 'hxc/api/login_token_v2/';

  login(valueForm: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, valueForm)
      .pipe(map(user => {
        if (user.results[0] && user.results[0].token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(user.results[0]));
        }
        return user.results[0];
      }));
  }
}
