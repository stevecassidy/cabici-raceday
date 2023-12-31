import { Injectable } from '@angular/core';
import { Rider } from '../classes/rider';
import {BehaviorSubject, Observable} from 'rxjs';
import { AuthService } from './auth.service';
import {ApiHttpClient} from '../api-http-client';
import {BusydialogComponent} from '../components/busydialog/busydialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})

export class RidersService {

  private _riders: BehaviorSubject<Rider[]>;
  private readonly dataStore: {
    riders: Rider[],
    timestamp: Number
  };
  private readonly endpoint: string;
  private busyDialogRef: MatDialogRef<BusydialogComponent>;

  constructor(private http: ApiHttpClient,
              private dialog: MatDialog,
              private authService: AuthService) {

    this.endpoint = '/api/riders/';
    this._riders = <BehaviorSubject<Rider[]>>new BehaviorSubject([]);
    this.dataStore = {
      riders: [],
      timestamp: 0
    };
    this.loadFromLocalStorage();
  }

  getRiders(): Observable<Rider[]> {
    return this._riders.asObservable();
  }

  getRider(id: string): Rider {
    for(let i=0; i<this.dataStore.riders.length; i++) {
      if (this.dataStore.riders[i].id === id) {
        return this.dataStore.riders[i];
      }
    }
    return null;
  }

  newRider(rider: Rider): void {
    this.dataStore.riders.unshift(rider);
    this._riders.next(Object.assign({}, this.dataStore).riders);
  }

  /* load only changed riders from the API */


  loadChangedRiders(): void {
    this.busyDialogRef = this.dialog.open(BusydialogComponent,
      {
        disableClose: true,
        data: {message: 'Loading Riders...'}
      });

    const lasttimestamp = this.dataStore.timestamp;
    this._loadChangedRiders(this.endpoint+'?changed='+lasttimestamp);
  }

  _loadChangedRiders(url: string): void {
    
    // can't load if not logged in
    if (!this.authService.currentUser()) {
      this.busyDialogRef.close();
      return;
    }

    const response = this.http.get(url);

    response.subscribe(httpResp => {
      const riders = <Rider[]>httpResp['results'];
      this.dataStore.timestamp = Math.round(Date.now()/1000);
      /* update riders from the downloaded data */
      for (let rider of riders) {
        let existing = this.getRider(rider.id);
        if (existing) {
          /* copy properties across */
          for (let key in rider) {
            existing[key] = rider[key];
          }
        } else {
          this.dataStore.riders.unshift(rider);
        }
      }
      this._riders.next(Object.assign({}, this.dataStore).riders);
      this.updateLocalStorage();

      /* follow any next link to get next page */
      if (httpResp['next']) {
        const u = new URL(httpResp['next']);
        this._loadChangedRiders(u.pathname + u.search);
      } else {
        this.busyDialogRef.close();
      }
    });
  }

  loadRiders(): void {
    this.dataStore.riders = [];
    this.busyDialogRef = this.dialog.open(BusydialogComponent,
      {
        disableClose: true,
        data: {message: 'Loading Riders...'}
      });
    this._loadRiders(this.endpoint);
  }

  _loadRiders(url: string): void {

    // can't load if not logged in
    if (!this.authService.currentUser()) {
      this.busyDialogRef.close();
      return;
    }

    const response = this.http.get(url);

    response.subscribe(httpResp => {
      const riders = <Rider[]>httpResp['results'];
      this.dataStore.timestamp = Math.round(Date.now()/1000);
      this.dataStore.riders = this.dataStore.riders.concat(riders);
      this.updateLocalStorage();
      this._riders.next(Object.assign({}, this.dataStore).riders);
      if (httpResp['next']) {
        const u = new URL(httpResp['next']);
        this._loadRiders(u.pathname + u.search);
      } else {
        this.busyDialogRef.close();
      }
    });
  }

  loadFromLocalStorage(): void {

    // load riders from local storage
    const local = JSON.parse(window.localStorage.getItem('riders'));
    if (local !== null) {
      this.dataStore.riders = <Rider[]>local.riders;
      this.dataStore.timestamp = <Number>local.timestamp;
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

