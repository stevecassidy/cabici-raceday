import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Race} from '../classes/race';
import {AuthService} from './auth.service';
import {ApiHttpClient} from '../api-http-client';
import {BusydialogComponent} from '../components/busydialog/busydialog.component';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})

export class RacesService {

  private readonly endpoint: string;
  private readonly dataStore: {
    races: Race[]
  };
  private _races: BehaviorSubject<Race[]>;
  private _selected: Race;

  constructor(public authService: AuthService,
              public dialog: MatDialog,
              public http: ApiHttpClient) {

    this.endpoint = '/api/races/?select=raceday&club=';

    this.dataStore = {
      races: <Race[]> []
    };
    this._races = <BehaviorSubject<Race[]>>new BehaviorSubject([]);
    this.loadFromLocalStorage();
  }

  get selected(): Race {
    return this._selected;
  }

  set selected(value: Race) {
    this._selected = value;
  }

  /* 
   * return the next race from today
   */
  nextRace(): Race {
    const today = new Date();
    let future = new Array();
    const races = this.dataStore.races;
    for (let index = 0; index < races.length; index++) {
      const race = races[index];
      const raceDate = new Date(race.date);
      if (raceDate.getDate() >= today.getDate()) {
        future.push(race);
      }
    }
    return future[0];
  }

  isToday(race: Race): string {
    const today = new Date();
    const racedate = new Date(race.date);
    if (racedate.getDate() === today.getDate()) {
      return 'selected';
    } else {
      return '';
    }
  }

  getRaces(): Observable<Race[]> {
    return this._races.asObservable();
    // return of(this.races);
  }

  loadRaces(): void {
    if (!this.authService.currentUser()) {
      return;
    }
    const user = this.authService.currentUser();

    const url = this.endpoint + user.club;

    const dialogRef = this.dialog.open(BusydialogComponent,
      {
        disableClose: true,
        data: {message: 'Loading Races...'}
      });

    const response = this.http.get(url);

    response.subscribe(httpResp => {
      this.dataStore.races = <Race[]>httpResp;
      this.updateLocalStorage();
      this._races.next(Object.assign({}, this.dataStore).races);
      dialogRef.close();
    }, error1 => {
      dialogRef.close();
    });
  }

  loadFromLocalStorage(): void {

    // load riders from local storage
    const local = JSON.parse(window.localStorage.getItem('races'));
    if (local !== null) {
      this.dataStore.races = <Race[]>local;
    } else {
      // force load from cabici API
      this.loadRaces();
    }
    this._races.next(Object.assign({}, this.dataStore).races);
  }

  updateLocalStorage(): void {
    window.localStorage.setItem('races', JSON.stringify(this.dataStore.races));
  }
}
