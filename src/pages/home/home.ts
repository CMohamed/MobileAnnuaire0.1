import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import {FiltrePage} from "../filtre/filtre";
import {LaureatsProvider} from "../../providers/laureats/laureats";
import {Subscription} from "rxjs";


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public laureatsubscription : Subscription;
  public laureats = [];



  constructor(public navCtrl: NavController,public laureatsProvider: LaureatsProvider) {



    this.laureatsubscription = this.laureatsProvider.laureatsList$.subscribe(

      (laureatsImported : any) => {

        this.laureats = laureatsImported;
        console.log(this.laureats);

      }

    );


  }


  itemTapped(e : any):void{
    //console.log(e);
    //this.navCtrl.push(FiltrePage);

  }


  nouveauFiltre():void{

    this.navCtrl.push(FiltrePage);


  }



}
