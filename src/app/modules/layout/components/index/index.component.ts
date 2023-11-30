import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ApiService } from '../../../../services/services.service';
// import { Observable } from 'rxjs';
import { UserChannel } from '../../../../models';
import { environment } from 'src/environments/environment'

declare var $:any;


@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  providers: [ApiService]
})
export class IndexComponent implements OnInit {

  data_user: any;
  disabled:boolean = true;
  enabled:boolean = false;
  public version:string

  constructor(
    private _route: ActivatedRoute,
		private _router: Router,
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    this.version = environment.version

    this.data_user = JSON.parse(localStorage.getItem('currentUser'));
    let data_user = this.data_user;
    this.data_user = this.data_user['user'];

    let profileUser = JSON.parse(localStorage.getItem('profileUser'));
    this.disabled = profileUser['disabled'];
    this.enabled = profileUser['enabled'];
    
    //console.log('this.data_user',data_user);

    $('.sidenav').sidenav({
      isFixed:true,
      preventScrolling:false
     }
    );    
  }

  logout(){
    this.clearCachePWA();
    localStorage.clear();
    sessionStorage.clear();
    this._router.navigate(['/']); 
  }

  
  clearCachePWA() {
    caches.keys().then((keys) => {
      keys.forEach((eachCacheName) => {
          let regExPat = /^(ngsw).*api.*/;
          if (regExPat.test(eachCacheName)) {
              caches.open(eachCacheName).then((eachCache) => {
                  eachCache.keys().then((requests) => {
                      requests.forEach((eachRequest) => { eachCache.delete(eachRequest); });
                  });
              });
          }
      });
    })
  }

}
