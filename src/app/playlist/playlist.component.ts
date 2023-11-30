import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ApiService } from '../services/services.service';
import { environment } from 'src/environments/environment'
import * as _ from "lodash";
import { AlertComponent } from '../alert/alert.component';
import { ThumbnailsComponent } from '../thumbnails/thumbnails.component';
import * as moment from 'moment';
import 'firebase/storage';
// import progress bar 
import { Catalogue, Inputs } from '../models';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss']
})
export class PlaylistComponent implements OnInit {
  

  @ViewChild(ThumbnailsComponent) child: ThumbnailsComponent;
  inputs: Inputs = new Inputs();
  @Input() spinner: boolean;

  playlists = [];
  adscreen = [];
  catalogues: Catalogue[];
  
  //modal confirmation
  modal_confirmation: boolean = false;
  id_playlist: number;
  list_trade: any[] = [];
  list_page: any[] = [];
  list_page_adscreen: any[] = [];
  list_page_active: string;
  list_page_size: string;
  count_page: number;
  count_page_adscreen: number; 
  list_view_page: number;
  modal_active: boolean = false;
  active_playlist: number;
  playlistsItem: any[] = [];
  is_playlist: boolean = false;
  is_playlist_active:boolean = false;
  search_name_playlist: string = '';
  search_id_trade: number = 0;

  toogle: boolean = false;
  toogle_id: number = 0;
  public version:string;

  constructor(
		private apiService: ApiService,
    private alert : AlertComponent,
  ) { 
    this.list_page_size = '12';
    this.getPlayList(0, '1', this.list_page_size);
    this.getListTrade();
    this.getCatalogues();
  }

  ngOnInit(): void {
    this.spinner = true;
    this.version = environment.version
  }

   /** get playlists */
   getPlayList(id_playlist: number =null, page: string = null, page_size: string = null, search_name: string = null, id_trade: number = null){
    this.id_playlist = id_playlist;
    this.list_page_active = page;
    this.list_page_size = page_size;
    this.search_name_playlist = search_name;
    this.search_id_trade = id_trade;

    //console.log('id_trade', id_trade);

    this.list_view_page= (Number(page)-1)*(Number(page_size));
    this.list_view_page = this.list_view_page==0 ? 1 : this.list_view_page;

    
    this.apiService.getPlaylistLite(id_playlist,page, page_size, search_name, id_trade, '&ordering=-created&application=1').subscribe(
      data => {
        //console.log('data',data);
        this.playlists = [];
        data.results.forEach(element => {
          //console.log('element', element);
          if(element.start_date){
            element.start_date = moment(element.start_date.toString()).format('DD-MM-YYYY');
          }
          if(element.end_date){
            element.end_date = moment(element.end_date.toString()).format('DD-MM-YYYY');
          }
          
          this.playlists.push(element);
        
        });
        //console.log('this.playlists length ==>', this.playlists.length);
        //console.log('this.adscreen', this.adscreen.length);
        //this.playlists = data.results;
        //let page_size = this.playlists.length/Number(this.list_page_size);
        //console.log('page_size', page_size);
        this.list_page = [];
        for (let i = 0; i < data.pages; i++) {
          this.list_page.push(i);
        }
        //console.log('list_page', this.list_page);
        this.count_page = this.playlists.length;
        //this.count_page_adscreen = this.adscreen.length;

        //console.log('data count', data);
        this.spinner = false;
      },
      error => {
        this.spinner = false;
        console.log('error', error);
        
      }
    );

    this.apiService.getPlaylistLite(id_playlist,page, page_size, search_name, id_trade, '&ordering=-created&application=2').subscribe(
      data => {
        this.adscreen = [];
        data.results.forEach(element => {
          //console.log('element', element);
          if(element.start_date){
            element.start_date = moment(element.start_date.toString()).format('DD-MM-YYYY');
          }
          if(element.end_date){
            element.end_date = moment(element.end_date.toString()).format('DD-MM-YYYY');
          }

          this.adscreen.push(element);

        });
        
        //console.log('this.adscreen', this.adscreen.length);
        //this.playlists = data.results;
        //let page_size = this.playlists.length/Number(this.list_page_size);
        //console.log('page_size', page_size);
        this.list_page_adscreen = [];
        for (let i = 0; i < data.pages; i++) {
          this.list_page_adscreen.push(i);
        }
        //console.log('list_page', this.list_page);
        //this.count_page = this.adscreen.length;
        this.count_page_adscreen = this.adscreen.length;

        //console.log('data count', data);
        this.spinner = false;
      },
      error => {
        this.spinner = false;
        console.log('error', error);
        
      }
    );
  }

  //get item playlist
  getItemPlayList(id_playlist: number =null, page: string = null, page_size: string = null, search_name: string = null){
    this.id_playlist = id_playlist;
    // this.list_page_active = page;
    // this.list_page_size = page_size;

    // this.list_view_page= (Number(page)-1)*(Number(page_size));
    this.playlistsItem = null;

    this.spinner = true;
    const filter = '?playlist=' + id_playlist+ '&ordering=order';
    this.apiService.getItems(filter).subscribe(
      data => {
        
        this.playlistsItem = data.results;
        //console.log('data item', this.playlistsItem);
        this.spinner = false;
      },
      error => {
        this.spinner = false;
        console.log('error', error);
      }
    );
  }

  getToogle(id: any ){
    
    const idElement = id;
    const check = document.getElementById(idElement) as HTMLInputElement;
    // document.getElementsByClassName('on').removeClass('on');
    // this.is_playlist_active = true; 

    //let className = (check.className == 'on') ? 'off' : ((check.className == '') ? 'on' : 'off') ;

    var elems = document.querySelectorAll(".on");
    [].forEach.call(elems, function(el) {
        console.log('el', el);
        el.classList.remove("on");
    });

    if(this.toogle && this.toogle_id == id){
      check.className = 'off';
      this.toogle = false;
    }else if(this.toogle_id !== id){
      this.toogle_id = id;
      check.className = 'on';
      this.toogle = true;
    }
    else{
      check.className = 'on';
      this.toogle = true;
    }

    if(check.className == 'on'){
      this.getItemPlayList(idElement);
    }else{
      this.getItemPlayList(0);
    }

  }

  duplicatePlaylist(id: number){
    this.id_playlist = id;
    this.modal_confirmation = true;
  }

  hideModal(){
    this.modal_confirmation = false;
  }

  saveDuplicatePlaylist(){
    //this.spinner = true;
    let obj_duplicate_playlist = {
      'playlist' : this.id_playlist
    }
    //console.log('obj_duplicate_playlist', obj_duplicate_playlist);
    this.apiService.duplicatePlaylist(obj_duplicate_playlist).subscribe(
      data => {
        this.modal_confirmation = false;
        this.getPlayList();
        //this.spinner = false;
      },
      error => {
        this.spinner = false;
        console.log('error', error);
        
      }
    );
  }

  changeActive(is_active: number, id: number, name:string){
    //console.log('is_active', is_active);
    //this.modal_active = true;
    this.spinner = true;
    var active = is_active==1 ? '0': '1';
    let input_obj = {
      'id'       : id,
      'is_active' : active,
      'name' : name
      
    }

    //console.log('input_obj', input_obj);
    
    this.apiService.editPlaylist(input_obj).subscribe(
			data => {
        //console.log('data save active', data);
        let id = data.id;
        this.spinner = false;
				// this.message_tmp = '¡La creación del playlist fue realizada con éxito!';
				// this.status_tmp = 'alert-success';
        // this.alert.changeFromAlert();
        // this.toogle_playlist = false;
        // this.toogle_ads = true;
			},
			error => {
				console.log('error', error);
				// this.message_tmp = '¡Ocurrió un problema, por favor intente nuevamente!';
				// this.status_tmp = 'alert-danger'
				// this.alert.changeFromAlert();
			}
		);
  }

  hideModalActive(){
    this.modal_active = false;
  }

  getListTrade(){
    //this.spinner = true;
		this.apiService.getTrade().subscribe(
			data => {
				//console.log('trade', data);
        this.list_trade = data;
        //this.spinner = false;
			},
			error => {
				console.log('error', error);
				// this.message_tmp = '¡Ocurrió un problema, por favor intente nuevamente!';
				// this.status_tmp = 'alert-danger'
				// this.alert.changeFromAlert();
			}
		);
  }


  //get catalogues
  getCatalogues(id: number = null){
    //console.log('id', id);
    this.apiService.getCatalogue().subscribe(
      data => {
        this.catalogues = data;
        //console.log('catalogue', this.catalogues);
        this.spinner = false;
      },
      error => {
        console.log('error', error);
      }
    );
  }

  openTab(tabEnabled: any, tabDisabled: any){
    (<HTMLInputElement>document.getElementById(tabDisabled)).style.display = "none";
    (<HTMLInputElement>document.getElementById(tabEnabled)).style.display = "";

    document.getElementById('li_'+tabEnabled).classList.remove('off');
    const el = document.getElementById('li_'+tabDisabled);
    //console.log('el', el);
    el.className += 'off';

    //console.log(tabEnabled+' - '+tabDisabled);
  }

  // remove string especial 
  // removeString(cadena){
  //   const acentos = {'á':'a','é':'e','í':'i','ó':'o','ú':'u','Á':'A','É':'E','Í':'I','Ó':'O','Ú':'U',' ':'_'};
  //   cadena.split('').map( letra => acentos[letra] || letra).join('').toString();
  //   return cadena.substring(0, 15);	
  // }


}
