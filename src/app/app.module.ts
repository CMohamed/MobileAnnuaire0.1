import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {ParcellesPage} from "../pages/parcelles/parcelles";
import {FiltrePage} from "../pages/filtre/filtre";
import {ProfilePage} from "../pages/profile/profile";

import {IonicStorageModule} from "@ionic/storage";
import {Camera} from "@ionic-native/camera";
import {Geolocation} from "@ionic-native/geolocation";
import {ParcelleService} from "../services/parcelles.service";
import {EmailComposer} from "@ionic-native/email-composer";
import { FileChooser } from '@ionic-native/file-chooser';
import { ActionSheet} from '@ionic-native/action-sheet';
import { FilePath } from '@ionic-native/file-path';
import { File } from '@ionic-native/file';
import { HttpClientModule } from '@angular/common/http';
import { LaureatsProvider } from '../providers/laureats/laureats';
import { Uid } from '@ionic-native/uid';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { UtilisateurProvider } from '../providers/utilisateur/utilisateur';
import { OrganismesProvider } from '../providers/organismes/organismes';


@NgModule({
  declarations: [
    MyApp,
    ParcellesPage,
    HomePage,
    FiltrePage,
    TabsPage,
    ProfilePage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ParcellesPage,
    HomePage,
    FiltrePage,
    TabsPage,
    ProfilePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    Geolocation,
    ParcelleService,
    EmailComposer,
    FileChooser,
    ActionSheet,
    File,
    FilePath,
    Uid,
    AndroidPermissions,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    LaureatsProvider,
    UtilisateurProvider,
    OrganismesProvider,
  ]
})
export class AppModule {}
