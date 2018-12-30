import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {Race} from '../classes/race';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthService} from './auth.service';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class RacesService {

  private readonly apiUrl: string;
  private races: Race[];
  private _races: BehaviorSubject<Race[]>;
  private _selected: Race;

  constructor(public authService: AuthService,
              public http: HttpClient) {

    this.apiUrl = environment.apiURL + '/api/races/?select=future&club=';

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

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Token ' + user.token
      })
    };

    let url = this.apiUrl + user.club;

    let response = this.http.get(url, httpOptions);

    response.subscribe(httpResp => {
      this.races = <Race[]>httpResp;
      this.updateLocalStorage();
      this._races.next(Object.assign({}, this.races));
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
