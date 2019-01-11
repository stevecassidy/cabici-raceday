import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {Race} from '../classes/race';
import {AuthService} from './auth.service';
import {ApiHttpClient} from '../api-http-client';
import {BusydialogComponent} from '../components/busydialog/busydialog.component';
import {MatDialog} from '@angular/material';

@Injectable({
  providedIn: 'root'
})

export class RacesService {

  private readonly endpoint: string;
  private races: Race[];
  private _races: BehaviorSubject<Race[]>;
  private _selected: Race;

  constructor(public authService: AuthService,
              public dialog: MatDialog,
              public http: ApiHttpClient) {

    this.endpoint = '/api/races/?select=future&club=';

    this._races = <BehaviorSubject<Race[]>>new BehaviorSubject([]);
    this.loadFromLocalStorage();
  }

  get selected(): Race {
    return this._selected;
  }

  set selected(value: Race) {
    this._selected = value;
  }

  getRaces(): Observable<Race[]> {
    return of(this.races);
  }



  loadRaces(): void {
    if (!this.authService.currentUser()) {
      return;
    }
    const user = this.authService.currentUser();

    let url = this.endpoint + user.club;

    let dialogRef = this.dialog.open(BusydialogComponent,
      {
        disableClose: true,
        data: {message: 'Loading Races...'}
      });

    let response = this.http.get(url);

    response.subscribe(httpResp => {
      this.races = <Race[]>httpResp;
      this.updateLocalStorage();
      this._races.next(Object.assign({}, this.races));
      dialogRef.close();
    });
  }

  loadFromLocalStorage(): void {

    // load riders from local storage
    const local = JSON.parse(window.localStorage.getItem('races'));
    if (local !== null) {
      this.races = <Race[]>local;
    } else {
      // force load from cabici API
      this.loadRaces();
    }
    this._races.next(Object.assign({}, this.races));
  }

  updateLocalStorage(): void {
    window.localStorage.setItem('races', JSON.stringify(this.races));
  }
}
