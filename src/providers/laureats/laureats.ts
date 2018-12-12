import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Subject} from "rxjs";


/*
  Generated class for the LaureatsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/




@Injectable()
export class LaureatsProvider {


  private laureatsList: any[] = [];
  laureatsList$ = new Subject<any[]>();



  constructor(public httpClient: HttpClient) {




    console.log('Hello LaureatsProvider Provider');



  }


  //permet d'indiquer qu'une mise à jour au niveau du service est necessaire
  emitList() {
    this.laureatsList$.next(this.laureatsList);
    console.log(this.laureatsList);
  }



  public nouveauFiltre(requete : string): void{

    this.httpClient.get(requete)
      .subscribe( data => {

        this.laureatsList = (data as any).features;
        this.emitList();

    });


  }



}
