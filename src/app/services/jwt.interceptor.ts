import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpClient } from '@angular/common/http';
import { timer, throwError, Observable, } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';


@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  urlBase: string = environment.urlBase;
  localUrlBase: string = environment.localUrlBase;
  private http: HttpClient;

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //console.log('interceptor', request);
    const uri_success = request.url;
    if (uri_success.indexOf(this.urlBase) >= 0 || uri_success.indexOf(this.localUrlBase) >= 0) {

      const token = JSON.parse(localStorage.getItem('currentUser'));
      const org = environment.org;
      if (token) {
        request = request.clone({
          headers: request.headers.set('Authorization', 'Token ' + token.token),
        });
        console.log('request', request);
      }
      return next.handle(request).pipe(
        catchError(response => {
          console.log('error interceptor', request);
          if (response.status === 401 || response.status === 504) {
            console.log(response.status)
          }
          retry(2)
          return throwError(response);
        }
        )
      )

    } else {

      request = request.clone({
        headers: request.headers.set('Authorization', 'Basic ' + btoa('elastic:p2shq6VeNmtsn1X5xNmx690D'))
      });

      // console.log('request elastic', request);
      return next.handle(request).pipe(

        catchError(response => {
          console.log('error intecepetor', request);
          /*if(response.status === 401) {
            console.log(response)
             return next.handle(request.clone({
               //setHeaders: { "Authorization": `Bearer ${token}` }
             })
             );
          }*/
          retry(2)
          return throwError(response);
        })
      )

    }
  }
}
