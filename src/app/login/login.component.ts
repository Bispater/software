import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../services/authentication.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GlobalService } from '../services/global.service';
import { ApiService } from '../services/services.service';
import { environment } from 'src/environments/environment'
import { UserChannel } from '../models';

@Component({
	selector	: 'login',
	templateUrl	: './login.component.html',
	styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
	public title = 'Login';
	statusService: string;
	statusClass: string;
	siteKey: string;
	captchaValid = false;
	public aFormGroup: FormGroup;
	keyApp = 'LOGIN_BCH';
	public production:boolean;

	constructor(
		private formBuilder: FormBuilder,
		private authenticationService: AuthenticationService,
		private _route: ActivatedRoute,
		private _router: Router,
		private apiService: ApiService,
		private globalService: GlobalService
	){
		this.siteKey = globalService.siteKey;
	}

	ngOnInit(){

		if( environment.production === false){
			this.production = false
			this.aFormGroup = this.formBuilder.group({
				recaptcha: new FormControl(['']),
				username: new FormControl(),
				password: new FormControl(),
				key: new FormControl()
			  });
		} else {
			this.production = true
			this.aFormGroup = this.formBuilder.group({
				recaptcha: new FormControl(['', Validators.required]),
				username: new FormControl(),
				password: new FormControl(),
				key: new FormControl()
			  });
		}

	    localStorage.clear();
	 
	}

	login() {
		this.statusClass = 'color-loading';
		this.statusService = 'Cargando ...';
		this.authenticationService.login(this.aFormGroup.value)
		.subscribe(
			data => {
			console.log('data: ', data);
			  if (data.errors) {
			    this.statusClass = 'color-warning';
			    this.statusService = data.errors;
			    console.log(data.errors);
			    localStorage.clear();
			    
			  }else {
			    //localStorage.setItem('currentUser', JSON.stringify({token: data.token, user: {id: data.user.id}}));
			    this.successLogin(data);
			  }
			},
			error => {
			  console.log(error);
			  this.statusClass = 'color-warning';
			  if (error.error.results) {
			    if (error.error.results[0].errors == 'Error: timeout-or-duplicate') {
			      window.location.reload();
			    }
			    this.statusService = error.error.results[0].errors;
			  } else {
			  	console.log(error.error.results);
			    this.statusService = 'Error, contacte al administrador del sitio para más información.';
			  }
			}
		);
	}


	successLogin(data){
		const rut64 = btoa(data.user.rut);
		const cdn64 = btoa(data.user.workinginformation.profit_group);
		//window.location.href = path;
		this.getuserchannel() 
	}

	getuserchannel(){
		this.apiService.getUserChannel().subscribe(
			data => {
				
				let user_channel = <UserChannel>data;
				let channel = user_channel.channel?.channel;
				// console.log('data?.length ', channel?.length);
				console.log('afuera ?', channel);
				if(channel?.length > 0){
					console.log('entro ?', channel);
					let group = user_channel && user_channel.user && user_channel.user.groups ? user_channel.user.groups : [];
					let profile_search: number = 0;
					
					if(group?.length >0){
						group.forEach(element => {
							if(element.name == 'supervisor-state'){
								localStorage.setItem('profileUser', JSON.stringify({'disabled' : true, 'enabled' : false, 'channel' : channel}));
								this._router.navigate(['/v4']); 
							}else{
								localStorage.setItem('profileUser', JSON.stringify({'disabled' : true, 'enabled' : true, 'channel' : channel}));
							}
						});
					}else{
						localStorage.setItem('profileUser', JSON.stringify({'disabled' : true, 'enabled' : true, 'channel' : channel}));
					}
					

					this._router.navigate([environment.version]);
				}else{
					this.statusService = 'Error, el usuario no tiene asociado un canal, contacte al administrador del sitio para más información.';
					localStorage.clear();
				}
				
			},
			error => {
				console.log('error', error);
			}
		);
	}

	errorLogin(){
		this.statusClass = 'color-warning';
		this.statusService = 'Usuario invalido';
		localStorage.clear();
	}

	handleExpire() {
		this.captchaValid = false;
	}

	handleSuccess(event) {
		this.captchaValid = true;
	}
}