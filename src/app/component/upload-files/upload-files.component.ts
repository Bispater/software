import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import 'firebase/storage';
import { finalize, delay } from 'rxjs/operators';
import { ApiService } from 'src/app/services/services.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-upload-files',
  templateUrl: './upload-files.component.html',
  styleUrls: ['./upload-files.component.scss']
})

@ViewChild('fileInput', { static: false })

export class UploadFilesComponent implements OnInit {

  @Output() upload: EventEmitter<any> = new EventEmitter();

  event: any;
  uploadPercent: Observable<number>;
  uploadUrl: Observable<number>;
  btnInactive: boolean = true;

  constructor(
    private storage: AngularFireStorage,
    private apiService: ApiService,
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
  }

  // upload video event
  uploadFile(event: any) {
    this.event = event;
    this.btnInactive = true;
    console.log(this.event);
    let file = this.event.target.files[0];
    //console.log('file', file);
    if (file) {
      // name file for upload
      let nameSplit = [];
      let randomCode = '_' + Math.random().toString(36).substring(2).substring(0, 4);
      nameSplit = file.name.replace(" ", "_").split('.');
      let extension = '.' + nameSplit[nameSplit.length - 1];
      let nameFile = file.name.slice(0, (extension.length * -1));
      let nameExport = this.removeString(nameFile) + randomCode + extension;

      // path cloud
      const filePath = '/' + nameExport;
      const ref = this.storage.ref(filePath);
      const task = ref.put(file);
      // observe percentage changes
      this.uploadPercent = task.percentageChanges();
      // end process
      task.snapshotChanges().pipe(
        finalize(() => {
          // get url
          ref.getDownloadURL().subscribe(url => {

            console.log("url data generated : ", url);
            this.upload.emit(url);
            this.uploadPercent = task.percentageChanges();
            // this.apiService.saveVideoLibrary(url).subscribe(
            //   data => {
            //     this._toast('Video cargado a la biblioteca.', 'OK');
            //   },
            //   error => {
            //     console.log('error', error);
            //   }
            // );
          });
        })
      ).subscribe()
    }
  }

  // remove string especial 
  removeString(cadena) {
    const acentos = { 'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', 'Á': 'A', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ú': 'U', ' ': '_' };
    cadena.split('').map(letra => acentos[letra] || letra).join('').toString();
    return cadena.substring(0, 15);
  }

  _toast(message: string, action: string = null, duration: number = null) {
    action = (action) ? action : 'OK';
    duration = (duration) ? duration : 2500;
    this._snackBar.open(message, action, {
      duration: duration,
    });
  }
}
