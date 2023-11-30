import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { SafePipeModule } from 'safe-pipe';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// import resources component Login 
import { LoginComponent } from './login/login.component';
import { AuthenticationService } from './services/authentication.service';
import { GlobalService } from './services/global.service';
import { ApiService } from './services/services.service';
import { JwtInterceptor } from './services/jwt.interceptor';
import { NgxCaptchaModule } from 'ngx-captcha';
import { AuthGuard } from './services/auth.guard';
import { FooterComponent } from './footer/footer.component';
import { MenuComponent } from './menu/menu.component';
import { PlaylistComponent } from './playlist/playlist.component';
// import { AssigPlaylistComponent } from './assig-playlist/assig-playlist.component';
// import { GroupComponent } from './group/group.component';
// import { ChangePriceComponent } from './change-price/change-price.component';
// import { AddPlaylistComponent } from './add-playlist/add-playlist.component';
// import { ModalComponent } from './modal/modal.component';
import { AlertComponent } from './alert/alert.component';
import { TemplatesComponent } from './templates/templates.component';
// import { DeviceConfigComponent } from './device-config/device-config.component';
import { SafePipe } from './safe.pipe';

/** import firebase storage */
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { environment } from 'src/environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// import { CustomComponent } from './custom/custom.component';
import { StateComponent } from './state/state.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
/** import ngx page scroll */
import { NgxPageScrollCoreModule } from 'ngx-page-scroll-core';
import { ThumbnailsComponent } from './thumbnails/thumbnails.component';

import { NgxSpinnerModule } from "ngx-spinner";
import { NgxDropzoneModule } from 'ngx-dropzone';

import { SharedModule } from '../app/modules/shared/shared.module';

import {MatFormFieldModule} from '@angular/material/form-field';
import { MatCardModule} from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import {MatInputModule} from '@angular/material/input';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { ServiceWorkerModule } from '@angular/service-worker';
import { PdvComponent } from './pdv/pdv.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import * as CanvasJSAngularChart from '../assets/canvasjs.angular.component';
import { TableExpandComponent } from './table-expand/table-expand.component';
import { MetricsComponent } from './metrics/metrics.component';
import { DevicesComponent } from './metrics/metrics-components/devices/devices.component';
import { AccessoriesComponent } from './metrics/metrics-components/accessories/accessories.component';
import { HomeComponent } from './metrics/metrics-components/home/home.component';
import { ImageComponent } from './metrics/metrics-components/image/image.component';
import { GenericTableComponent } from './metrics/metrics-components/generic-table/generic-table.component';
import { NotificationPopupComponent } from './notification-popup/notification-popup.component';
import { DropImagesComponent } from './drop-images/drop-images.component';
import { UploadFilesComponent } from './component/upload-files/upload-files.component';
import { ImageDialogComponent } from './component/image-dialog/image-dialog.component';
import { CircleOptionComponent } from './metrics/metrics-components/generic-table/circle-option/circle-option.component';
var CanvasJSChart = CanvasJSAngularChart.CanvasJSChart;




@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    FooterComponent,
    MenuComponent,
    PlaylistComponent,
    // AssigPlaylistComponent,
    // GroupComponent,
    // ChangePriceComponent,
    // AddPlaylistComponent,
    // ModalComponent,
    AlertComponent,
    TemplatesComponent,
    SafePipe,
    // CustomComponent,
    StateComponent,
    ThumbnailsComponent,
    // DeviceConfigComponent,
    PdvComponent,
    DashboardComponent,
    CanvasJSChart,
    TableExpandComponent,
    MetricsComponent,
    DevicesComponent,
    AccessoriesComponent,
    HomeComponent,
    ImageComponent,
    GenericTableComponent,
    NotificationPopupComponent,
    DropImagesComponent,
    UploadFilesComponent,
    ImageDialogComponent,
    CircleOptionComponent,
  ],
  imports: [
    SafePipeModule,
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    NgxCaptchaModule,
    NgxDropzoneModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    BrowserAnimationsModule,
    DragDropModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule,
    MatSnackBarModule,
    NgxPageScrollCoreModule,
    NgxSpinnerModule,
    MatButtonModule,
    MatMenuModule,
    SharedModule,
    MatFormFieldModule,
    MatCardModule,
    MatInputModule,
    MatDatepickerModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stabl
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [
    AuthenticationService,
    // appRouters,
    GlobalService,
    AuthGuard,
    AlertComponent,
    ApiService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
