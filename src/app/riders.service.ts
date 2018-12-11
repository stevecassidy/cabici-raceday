import { Injectable } from '@angular/core';
import { Rider } from './rider';
import {BehaviorSubject, Observable, of} from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})

export class RidersService {

  private _riders: BehaviorSubject<Rider[]>;
  private dataStore: {
    riders: Rider[]
  };
  private apiUrl = 'https://cabici.net/api/riders/';

  constructor(private http: HttpClient,
              private authService: AuthService) {
    this._riders = <BehaviorSubject<Rider[]>>new BehaviorSubject([]);
    this.dataStore = {
      riders: []
    }
    this.loadFromLocalStorage();
  }

  getRiders(): Observable<Rider[]> {
    return this._riders.asObservable();
  }

  loadRiders() {
    this.dataStore.riders = [];
    this._loadRiders(this.apiUrl);
  }

  _loadRiders(url: string): void {

    const token = this.authService.currentUser().token;

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Token ' + token
      })
    };

    let response = this.http.get(url, httpOptions);

    response.subscribe(httpResp => {
      let riders = <Rider[]> httpResp['results'];
      this.dataStore.riders = this.dataStore.riders.concat(riders);
      window.localStorage.setItem('riders', JSON.stringify(this.dataStore.riders));
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
      this.dataStore.riders = <Rider[]> local;
    } else {
      // force load from cabici API
      this.loadRiders();
    }
    this._riders.next(Object.assign({}, this.dataStore).riders);
  }
}

