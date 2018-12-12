
import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable()
export class ParcelleService {

  private laureatsList: any[] = [];
  laureatsList$ = new Subject<any[]>();

  constructor(private storage: Storage) {}


  updateParcelle(parcelle : any):void {

    for(let i = 0;i<this.laureatsList.length;i++){

      if(this.laureatsList[i] && this.laureatsList[i].id == parcelle.id){
        this.laureatsList[i] = parcelle;
        this.saveList();
        this.emitList();
      }

    }

  }

  deleteParcelle(parcelle : any):void {

    this.laureatsList.splice(this.laureatsList.indexOf(parcelle),1);
    this.saveList();
    this.emitList();
  }

  addParcelle(parcelle : any):void {
    this.laureatsList.push(parcelle);
    this.saveList();
    this.emitList();
  }

  //permet d'indiquer qu'une mise à jour au niveau du service est necessaire
  emitList() {
    this.laureatsList$.next(this.laureatsList);
  }



  //permet de stocker en dur une list dans un fichier nomée parcelles relative à l'application
  saveList() {
    this.storage.set('parcelles', this.laureatsList);
  }


  //permet de rafraichier notre variable laureatsList si de nouvelles données on été stocké en dur
  fetchList() {
    this.storage.get('parcelles').then(
      (list) => {
        // si la liste n'est pas vide alors on récupére nos donnée avec la methode slice()
        if (list && list.length) {
          this.laureatsList = list.slice();
        }
        this.emitList();
      }
    );
  }



}
