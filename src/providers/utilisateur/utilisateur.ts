import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Subject} from "rxjs";
import {Uid} from "@ionic-native/uid";
import {AndroidPermissions} from "@ionic-native/android-permissions";

/*
  Generated class for the UtilisateurProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UtilisateurProvider {

  public utilisateur = {
    "id":0,
    "nom":"",
    "prenom":"",
    "genre":"",
    "telephone":"",
    "promotion":"",
    "secteur":"",
    "filiere":"",
    "email":"dezfzeq",
    "pdp":"",
    "organisme":0,
    "autreOrganisme":"",
    "long":0,
    "lat":0,
    "description":"",
    "emeiExisteDeja" : false,
    "compteEstAssocie" : false, //associé à un compte utilisateur
    "inscriptionValide" : false,
    "besoinConfirmation" : true,
    "currentEmei":"",
    "etatAvancement":""

  };

  public currentEmei;

  public utilisateur$ = new Subject<any>();


  constructor(public httpClient: HttpClient, private uid: Uid, private androidPermissions: AndroidPermissions) {

    //pour la premiere fois la fonction emitUtilisateur ne poura pas s'executer toute seule
    this.emitUtilisateur();
    this.checkUser();
    this.emitUtilisateur();




  }



  //permet d'indiquer qu'une mise à jour au niveau du service est necessaire
  //en d'autre terme on informe le subject (la chaine youtube ) pour notifier les abonnés
  emitUtilisateur() {
    this.utilisateur$.next(this.utilisateur);
    console.log(this.utilisateur);
  }

  updateUtilisateur(user : any){

    this.utilisateur = user;
    this.emitUtilisateur();

  }


  public checkUser():void {



      this.utilisateur.currentEmei = "358224090292636";
      this.emitUtilisateur();
      //on commencera le code de notre application
      //cette requete represente la liste de tout utilisateur ayant soumis une inscription à partir de cet appareil ou s'est connecté avec son compte par ordre décroissant de la date de connexion
      let requete1Emei = "http://localhost:9090/requestAny/select%20refutilisateur,etat%20from%20emei%20where%20emei%20=%20'" + this.utilisateur.currentEmei + "'%20order%20by%20datechangement%20desc";
      //let requete1Emei = "http://localhost:9090/requestAny/select%20refutilisateur,etat%20from%20emei%20where%20emei%20=%20'" + d + "'%20and%20etat='accepted'%20order%20by%20datechangement%20desc";

      this.httpClient.get(requete1Emei)
        .subscribe(data => {


          //si on a rien recu comme reponse donc l'imei n'existe pas
          if((data as any).features.length != 0 ){


            //un utilisateur quelquonque a déjà tenté de s'enregistrer à partir de cet appareil
            this.utilisateur.emeiExisteDeja = true;

            //voyons maintenant si la derniere connexion à ce pereipherique etait associé à un compte?
            let requete2Emei = "http://localhost:9090/requestAny/select%20refutilisateur,etat%20from%20emei%20where%20emei%20=%20'" + this.utilisateur.currentEmei + "'%20and%20etat='associe'%20order%20by%20datechangement%20desc";
            this.httpClient.get(requete2Emei)
              .subscribe(data2 => {

                console.log("c est data2");

                console.log(data2);


                if((data2 as any).features.length != 0  && (data2 as any).features[0] && (data2 as any).features[0].etat == "associe"){
                  //si la derniere connexion correspond à un compte associé il suffit maintenant de verifier l'avancement de son inscription




                  this.utilisateur.compteEstAssocie = true;
                  //voyons maintenant alos l'avancement de son inscription
                  let requete3InscriptionValide = "http://localhost:9090/requestAny/select%20*%20from%20utilisateur,%20avancement%20where%20utilisateur.id%20=%20"+ (data2 as any).features[0].refutilisateur +"%20and%20avancement.refutilisateur%20=%20utilisateur.id%20order%20by%20datetraitement%20desc";
                  this.httpClient.get(requete3InscriptionValide)
                    .subscribe(data3 => {

                      console.log("http://localhost:9090/requestAny/select%20*%20from%20utilisateur,organisme,%20avancement%20where%20utilisateur.reforganisme=organisme.id%20and%20utilisateur.id%20=%20"+ (data2 as any).features[0].refutilisateur +"%20and%20avancement.refutilisateur%20=%20utilisateur.id%20order%20by%20datetraitement%20desc");


                      this.utilisateur.id = Number((data3 as any).features[0].id);
                      this.utilisateur.nom = (data3 as any).features[0].nom;
                      this.utilisateur.prenom = (data3 as any).features[0].prenom;
                      this.utilisateur.genre = (data3 as any).features[0].genre;
                      this.utilisateur.telephone = (data3 as any).features[0].telephone;
                      this.utilisateur.email = (data3 as any).features[0].email;
                      this.utilisateur.promotion = (data3 as any).features[0].promotion;
                      this.utilisateur.filiere = (data3 as any).features[0].filiere;
                      this.utilisateur.pdp = (data3 as any).features[0].photo;
                      this.utilisateur.secteur = (data3 as any).features[0].secteur;
                      this.utilisateur.description = (data3 as any).features[0].description;
                      this.utilisateur.etatAvancement = (data3 as any).features[0].etat;
                      this.utilisateur.organisme = Number((data3 as any).features[0].reforganisme);


                      if(!(data3 as any).features.length  && (data3 as any).features[0] && (data3 as any).features[0].etat == "valide") {

                        this.utilisateur.emeiExisteDeja = true;
                        this.utilisateur.compteEstAssocie  = true;
                        this.utilisateur.inscriptionValide = false;
                        this.utilisateur.besoinConfirmation = false;





                        this.emitUtilisateur();



                      }
                      else {

                        //sinon on affiche simplement l'etat d'avancement avec le motif
                        this.utilisateur.emeiExisteDeja = true;
                        this.utilisateur.compteEstAssocie  = true;
                        this.utilisateur.inscriptionValide = false;

                        this.emitUtilisateur();


                      }



                    });



                }
                else{
                  //si la derniere coonexion ne correspond pas à un compte associé (mais bien sur il y a deja des compte dans cet appareil)
                  //on doit saisir alors l'adresse mail ou le numero de tel
                  this.utilisateur.emeiExisteDeja = true;
                  this.utilisateur.compteEstAssocie  = false;
                  this.utilisateur.inscriptionValide = false;

                  this.emitUtilisateur();




                }


            });







          }
          else{
            //c'est la premiere fois qu'il tente de s'enregistrer donc on commence une inscription normale
            //donc il sera rederiger vers l'interface (inscription ou récupérer compte)
            this.utilisateur.emeiExisteDeja = false;
            this.utilisateur.compteEstAssocie  = false;
            this.utilisateur.inscriptionValide = false;

            this.emitUtilisateur();

          }

          //this.currentEmei
          //this.photoDeProfile=(data as any).features[0].photo;


        });




    /*

    this.getImei().then((d) =>
    {

      this.utilisateur.currentEmei = "358224090292636";
      this.emitUtilisateur();
      //on commencera le code de notre application
      //cette requete represente la liste de tout utilisateur ayant soumis une inscription à partir de cet appareil ou s'est connecté avec son compte par ordre décroissant de la date de connexion
      let requete1Emei = "http://localhost:9090/requestAny/select%20refutilisateur,etat%20from%20emei%20where%20emei%20=%20'" + this.utilisateur.currentEmei + "'%20order%20by%20datechangement%20desc";
      //let requete1Emei = "http://localhost:9090/requestAny/select%20refutilisateur,etat%20from%20emei%20where%20emei%20=%20'" + d + "'%20and%20etat='accepted'%20order%20by%20datechangement%20desc";

      this.httpClient.get(requete1Emei)
        .subscribe(data => {


          //si on a rien recu comme reponse donc l'imei n'existe pas
          if(!(data as any).features.length ){

            //un utilisateur quelquonque a déjà tenté de s'enregistrer à partir de cet appareil
            this.utilisateur.emeiExisteDeja = true;

            //voyons maintenant si la derniere connexion à ce pereipherique etait associé à un compte?
            let requete2Emei = "http://localhost:9090/requestAny/select%20refutilisateur,etat%20from%20emei%20where%20emei%20=%20'" + this.utilisateur.currentEmei + "'%20and%20etat='accepted'%20order%20by%20datechangement%20desc";
            this.httpClient.get(requete2Emei)
              .subscribe(data2 => {

                if(!(data2 as any).features.length  && (data2 as any).features[0] && (data2 as any).features[0].etat == "associe"){
                  //si la derniere connexion correspond à un compte associé il suffit maintenant de verifier l'avancement de son inscription

                  this.utilisateur.compteEstAssocie = true;
                  //voyons maintenant alos l'avancement de son inscription
                  let requete3InscriptionValide = "http://localhost:9090/requestAny/select%20datetraitement,motif,etat%20from%20utilisateur,%20avancement%20where%20utilisateur.id%20=%20"+ (data2 as any).features[0].refutilisateur +"%20and%20avancement.refutilisateur%20=%20utilisateur.id%20order%20by%20datetraitement%20desc";
                  this.httpClient.get(requete3InscriptionValide)
                    .subscribe(data3 => {

                      if(!(data3 as any).features.length  && (data3 as any).features[0] && (data3 as any).features[0].etat == "valide") {

                        this.utilisateur.emeiExisteDeja = true;
                        this.utilisateur.compteEstAssocie  = true;
                        this.utilisateur.inscriptionValide = false;
                        this.utilisateur.besoinConfirmation = false;

                        this.emitUtilisateur();



                      }
                      else {
                        //sinon on affiche simplement l'etat d'avancement avec le motif
                        this.utilisateur.emeiExisteDeja = true;
                        this.utilisateur.compteEstAssocie  = true;
                        this.utilisateur.inscriptionValide = false;
                        this.utilisateur.besoinConfirmation = false;

                        this.emitUtilisateur();


                      }



                    });



                }
                else{
                  //si la derniere coonexion ne correspond pas à un compte associé (mais bien sur il y a deja des compte dans cet appareil)
                  //on doit saisir alors l'adresse mail ou le numero de tel
                  this.utilisateur.emeiExisteDeja = true;
                  this.utilisateur.compteEstAssocie  = false;
                  this.utilisateur.inscriptionValide = false;
                  this.utilisateur.besoinConfirmation = false;

                  this.emitUtilisateur();




                }


            });







          }
          else{
            //c'est la premiere fois qu'il tente de s'enregistrer donc on commence une inscription normale
            //donc il sera rederiger vers l'interface (inscription ou récupérer compte)
            this.utilisateur.emeiExisteDeja = false;
            this.utilisateur.compteEstAssocie  = false;
            this.utilisateur.inscriptionValide = false;
            this.utilisateur.besoinConfirmation = false;

            this.emitUtilisateur();

          }

          console.log("dddd");
          console.log('my data: ', data);
          //this.currentEmei
          //this.photoDeProfile=(data as any).features[0].photo;


        });


    }).catch(reason => {

      console.log("eeee");

      console.log(reason);

    } );
     */






  }


  public checkCodeConfirmation(code : string){

    let requete1Emei = "http://localhost:9090/requestAny/select%20refutilisateur,etat%20from%20emei%20where%20emei%20=%20'" + this.utilisateur.currentEmei + "'%20order%20by%20datechangement%20desc";
    //let requete1Emei = "http://localhost:9090/requestAny/select%20refutilisateur,etat%20from%20emei%20where%20emei%20=%20'" + d + "'%20and%20etat='accepted'%20order%20by%20datechangement%20desc";

    this.httpClient.get(requete1Emei)
      .subscribe(data => {


      });

  }


  public async getImei() {

      const  {hasPermission} = await this.androidPermissions.checkPermission(
        this.androidPermissions.PERMISSION.READ_PHONE_STATE
      );


      if (!hasPermission) {
        const result = await this.androidPermissions.requestPermission(
          this.androidPermissions.PERMISSION.READ_PHONE_STATE
        );

        if (!result.hasPermission) {
          throw new Error('Permissions required');
        }

        // ok, a user gave us permission, we can get him identifiers after restart app
        return;
      }

      this.utilisateur.currentEmei = this.uid.IMEI;
      console.log(this.uid.IMEI);
      this.emitUtilisateur();


      return this.uid.IMEI
  }





}
