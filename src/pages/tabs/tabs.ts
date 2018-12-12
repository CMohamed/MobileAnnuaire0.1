import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import {ParcellesPage} from "../parcelles/parcelles";
import {ProfilePage} from "../profile/profile";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  homePage = HomePage;
  parcellesPage = ParcellesPage;
  profilePage = ProfilePage;

  constructor() {

  }
}
