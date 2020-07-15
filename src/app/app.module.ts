import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CommonComponentsModule } from './components/common-components.module';
import { Broadcaster } from './shared/providers/broadcasters';
import { UtilService } from './shared/services/client-service/util.service';
import { AuthenticationService } from './shared/services/database-service/authentication.service';
import { StorageService } from './shared/services/client-service/storage.service';
import { CloudFirestoreService } from './shared/services/database-service/cloud-firestore-service';
import { FileUploadModule } from 'ng2-file-upload';
import {NgxMaskIonicModule} from 'ngx-mask-ionic';
import { HttpClientModule } from '@angular/common/http';
import { HTTP } from '@ionic-native/http/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    HttpClientModule,
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    CommonComponentsModule,
    FileUploadModule,
    NgxMaskIonicModule.forRoot()
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Broadcaster,
    UtilService,
    AuthenticationService,
    CloudFirestoreService,
    StorageService,
    HTTP,
    InAppBrowser

  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
