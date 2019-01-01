import { Injectable } from '@angular/core';
import { Rider } from '../classes/rider';
import {BehaviorSubject, Observable, of} from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import {ApiHttpClient} from '../api-http-client';

@Injectable({
  providedIn: 'root'
})

export class RidersService {

  private _riders: BehaviorSubject<Rider[]>;
  private readonly dataStore: {
    riders: Rider[]
  };
  private readonly endpoint: string;

  constructor(private http: ApiHttpClient,
              private authService: AuthService) {

    this.endpoint = '/api/riders/';
    this._riders = <BehaviorSubject<Rider[]>>new BehaviorSubject([]);
    this.dataStore = {
      riders: [],
    };
    this.loadFromLocalStorage();
  }

  getRiders(): Observable<Rider[]> {
    return this._riders.asObservable();
  }

  newRider(rider: Rider): void {
    this.dataStore.riders.unshift(rider);
    this._riders.next(Object.assign({}, this.dataStore).riders);
  }

  loadRiders(): void {
    this.dataStore.riders = [];
    this._loadRiders(this.endpoint);
  }

  _loadRiders(url: string): void {

    // can't load if not logged in
    if (!this.authService.currentUser()) {
      return;
    }

    const response = this.http.get(url);

    response.subscribe(httpResp => {
      const riders = <Rider[]>httpResp['results'];
      this.dataStore.riders = this.dataStore.riders.concat(riders);
      this.updateLocalStorage();
      this._riders.next(Object.assign({}, this.dataStore).riders);
      if (httpResp['next']) {
        const u = new URL(httpResp['next']);
        this._loadRiders(u.pathname + u.search);
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

