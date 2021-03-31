import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { LaunchNavigator } from '@ionic-native/launch-navigator/ngx';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { CallNumberProvider } from 'src/providers/call-number.provider';
import { LaunchNavigatorProvider } from 'src/providers/launch-navigator.provider';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { RestProvider } from 'src/providers/rest/rest';
import { HttpClientModule } from '@angular/common/http';
import { ImageProvider } from 'src/providers/image.provider';
import { LoadingProvider } from 'src/providers/loading-provider';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    BarcodeScanner,
    CallNumber,
    LaunchNavigator,
    Camera,
    CallNumberProvider,
    LaunchNavigatorProvider,
    InAppBrowser,
    EmailComposer,
    RestProvider,
    ImageProvider,
    LoadingProvider
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
