import { Component } from '@angular/core';
import {NavController, NavParams, ToastController} from 'ionic-angular';

import {Subscription} from "rxjs/Subscription";
import {NgForm} from "@angular/forms";
import {OrganismesProvider} from "../../providers/organismes/organismes";
import {HttpClient} from "@angular/common/http";
import {LaureatsProvider} from "../../providers/laureats/laureats";


/**
 * Generated class for the ProfilePagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-filtre',
  templateUrl: 'filtre.html',
})
export class FiltrePage {


  public filiere = "";
  public promotion = "";
  public secteur = "";
  public genre = "";
  public province = "";
  public organisme = "";


  public organismesubscription : Subscription;
  public organismes = [];
  public provinces = [];
  public promotions = [];




  constructor(public navCtrl: NavController,public laureatsProvider:LaureatsProvider,public httpClient: HttpClient,public toastCtrl: ToastController, public navParams: NavParams,public organismesProvider: OrganismesProvider) {


    this.promotions = [];

    this.organismesubscription = this.organismesProvider.organismeList$.subscribe(

      (organismesImported : any) => {


        console.log(organismesImported);
        this.organismes = organismesImported;
        console.log(this.organismes);

      }

    );


    let requeteOrganisme = "http://localhost:9090/requestAny/select%20*%20from%20organisme";

    this.httpClient.get(requeteOrganisme)
      .subscribe(data => {
        console.log(data);

        this.organismes = (data as any).features;

      });


    let requeteProvince = "http://localhost:9090/requestAny/select%20nom_provin%20from%20provinceswgs%20order%20by%20nom_provin";

    this.httpClient.get(requeteProvince)
      .subscribe(data => {
        console.log(data);

        this.provinces = (data as any).features;

      });


    for(let i = 1970; i<=2020;i++){

      this.promotions.push(i.toString());

    }


    console.log(this.promotions);






  }





  onSubmitForm(form: NgForm):void {

    /*
  public filiere = "";
  public promotion = "";
  public secteur = "";
  public genre = "";
  public province = "";
  public organisme = "";
  */
    let requeteFiltre = "http://localhost:9090/requestAny/select%20nom,prenom,photo,organisme.long,organisme.lat,filiere,promotion,organisme.secteur,genre,organisme.province,nomorganisme%20from%20utilisateur,organisme%20";
    let clauseWhere = "";

    console.log(this.secteur == "");

    if(this.filiere != ""){

      clauseWhere = clauseWhere + "filiere%20='" + this.filiere + "'%20and%20";


    }

    if(this.promotion != ""){

      clauseWhere = clauseWhere + "promotion%20='" + this.promotion + "'%20and%20";

    }

    if(this.secteur != "" ){

      clauseWhere = clauseWhere + "organisme.secteur%20='" + this.secteur + "'%20and%20";

    }

    if(this.genre != ""){

      clauseWhere = clauseWhere + "genre%20='" + this.genre + "'%20and%20";

    }


    if(this.province != ""){

      clauseWhere = clauseWhere + "organisme.province%20='" + this.secteur + "'%20and%20";

    }

    if(this.organisme != ""){

      clauseWhere = clauseWhere + "nomorganisme%20='" + this.organisme + "'%20and%20";

    }


    if(clauseWhere != ""){

      requeteFiltre = requeteFiltre + "where%20utilisateur.reforganisme=organisme.id%20and%20";

      requeteFiltre = requeteFiltre +clauseWhere.substring(0,clauseWhere.length-9);

    }
    else{
      requeteFiltre = requeteFiltre + "where%20utilisateur.reforganisme=organisme.id%20";

    }

    console.log(requeteFiltre);

    this.laureatsProvider.nouveauFiltre(requeteFiltre);


    const toast = this.toastCtrl.create({
      message: 'Filtre Enregistré',
      duration: 3000,
      position: 'top'
    });
    toast.present();


  }





}
