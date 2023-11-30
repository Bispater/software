import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ApiService } from '../services/services.service';
// import { Observable } from 'rxjs';
import { UserChannel } from '../models';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  providers: [ApiService]
})
export class MenuComponent implements OnInit {

  menu_toogle: boolean = false;
  disabled:boolean = true;
  enabled:boolean = true;

  constructor(
    private _route: ActivatedRoute,
		private _router: Router,
    private apiService: ApiService
  ) { }

  ngOnInit(): void {

   
  }

  ngAfterViewInit(){
    let profileUser = JSON.parse(localStorage.getItem('profileUser'));
    this.disabled = profileUser['disabled'];
    this.enabled = profileUser['enabled'];
  }

  showMenu(){
    this.menu_toogle = (this.menu_toogle) ? false: true;
     
  }

  

}
