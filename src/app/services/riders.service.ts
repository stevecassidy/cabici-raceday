import { Injectable } from '@angular/core';
import { Rider } from '../classes/rider';
import {BehaviorSubject, Observable, of} from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class RidersService {

  private _riders: BehaviorSubject<Rider[]>;
  private dataStore: {
    riders: Rider[]
  };
  private readonly apiUrl: string;

  constructor(private http: HttpClient,
              private authService: AuthService) {

    this.apiUrl = environment.apiURL + "/api/riders/";
    this._riders = <BehaviorSubject<Rider[]>>new BehaviorSubject([]);
    this.dataStore = {
      riders: [],
    };
    this.loadFromLocalStorage();
  }

  getRiders(): Observable<Rider[]> {
    return this._riders.asObservable();
  }

  loadRiders(): void {
    this.dataStore.riders = [];
    this._loadRiders(this.apiUrl);
  }

  _loadRiders(url: string): void {

    // can't load if not logged in
    if (!this.authService.currentUser()) {
      return;
    }

    const token = this.authService.currentUser().token;

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Token ' + token
      })
    };

    let response = this.http.get(url, httpOptions);

    response.subscribe(httpResp => {
      let riders = <Rider[]>httpResp['results'];
      this.dataStore.riders = this.dataStore.riders.concat(riders);
      this.updateLocalStorage();
      this._riders.next(Object.assign({}, this.dataStore).riders);
      if (httpResp['next']) {
        this._loadRiders(httpResp['next']);
      }
    });
  }

  loadFromLocalStorage(): void {

    // load riders from local storage
    const local = JSON.parse(window.localStorage.getItem('riders'));
    if (local !== null) {
      this.dataStore.riders = <Rider[]>local.riders;
    } else {
      // force load from cabici API
      this.loadRiders();
    }
    this._riders.next(Object.assign({}, this.dataStore).riders);
  }

  updateLocalStorage(): void {
    window.localStorage.setItem('riders', JSON.stringify(this.dataStore));
  }
}

