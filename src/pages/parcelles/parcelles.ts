import {Component, OnInit, ElementRef, ViewChild} from '@angular/core';

import { Platform } from 'ionic-angular';

import { loadModules } from 'esri-loader';

import { Geolocation } from '@ionic-native/geolocation';

import {Subscription} from "rxjs/Subscription";
import {LaureatsProvider} from "../../providers/laureats/laureats";




@Component({
  selector: 'page-parcelles',
  templateUrl: 'parcelles.html'
})
export class ParcellesPage implements OnInit{

  @ViewChild('map') mapEl: ElementRef;LocateButton
  public currentLong = 0;
  public currentLat = 0;
  public erreur = 0;

  public laureatsListSubscription : Subscription;
  public laureatsList : any[];

  constructor(public platform: Platform, private geolocation: Geolocation, public laureatProvider : LaureatsProvider) {


    this.laureatsListSubscription = this.laureatProvider.laureatsList$.subscribe(
      (laureatsImported: any[]) => {

        console.log(laureatsImported);
        this.laureatsList = laureatsImported;
        this.getGeo();


      }
    );

    let watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
      // data can be a set of coordinates, or an error (if an error occurred).
      // data.coords.latitude
      // data.coords.longitude
      try{

        this.erreur = data.coords.accuracy;
        this.currentLong=data.coords.longitude;
        this.currentLat=data.coords.latitude;

      }
      catch (exception)
      {

      }

    });


  }

  async  getGeo() {

    // Reference: https://ionicframework.com/docs/api/platform/Platform/#ready
    await this.platform.ready();

    // Load the ArcGIS API for JavaScript modules
    const [Map, MapView, Graphic,Locate]:any = await loadModules([
      'esri/Map',
      'esri/views/MapView',
      'esri/Graphic',
      'esri/widgets/Locate'
    ])
      .catch(err => {
        console.error("ArcGIS: ", err);
      });

    console.log("Starting up ArcGIS map");

    let map = new Map({
      basemap: 'hybrid'
    });

    let mapView = new MapView({
      // create the map view at the DOM element in this component
      container: this.mapEl.nativeElement,
      center: [this.currentLong, this.currentLat],
      zoom: 20
    });

    mapView.map = map;


    if(this.laureatsList && this.laureatsList.length){

      for(let i=0;i<this.laureatsList.length;i++) {


        if (this.laureatsList[i] && this.laureatsList[i].long && this.laureatsList[i].lat) {


          let pointGraphic = new Graphic({
            geometry: {
              type: "point", // autocasts as new Point()
              longitude: Number(this.laureatsList[i].long),
              latitude: Number(this.laureatsList[i].lat)
            },
            symbol: {
              type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
              color: [255, 0, 255],
              outline: { // autocasts as new SimpleLineSymbol()
                color: [255, 255, 255],
                width: 1
              }
            },
            attributes: {
              Nom: this.laureatsList[i].nom,
              Prenom: this.laureatsList[i].prenom,
              Organisme: this.laureatsList[i].nomorganisme,
              Filiere: this.laureatsList[i].filiere,
            },
            popupTemplate: {  // autocasts as new PopupTemplate()
              title: "{Nom} {Prenom}",
              content: [{
                type: "fields",
                fieldInfos: [{
                  fieldName: "Nom"
                }, {
                  fieldName: "Prenom"
                }, {
                  fieldName: "Organisme"
                }, {
                  fieldName: "Filiere"
                }]
              }]
            }


          });

          mapView.graphics.add(pointGraphic);


        }//fin if
      }

    }





    let locateBtn = new Locate({
      view: mapView
    });

    // Add the locate widget to the top left corner of the view
    mapView.ui.add(locateBtn, {
      position: "top-left"
    });


  }



  ngOnInit():void {
  }

}
