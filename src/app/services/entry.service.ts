//  Service to store entries in a race.

import {Injectable} from '@angular/core';
import {Entry} from '../classes/entry';
import {Rider} from '../classes/rider';
import {BehaviorSubject, Observable} from 'rxjs';
import {RacesService} from './races.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthService} from './auth.service';
import {environment} from '../../environments/environment';

// @ts-ignore
@Injectable({
  providedIn: 'root'
})
export class EntryService {
  // https://coryrylan.com/blog/angular-observable-data-services
  private _entries: BehaviorSubject<Entry[]>;
  private dataStore: {
    entries: Entry[],
    newriders: Rider[]
  };

  constructor(private raceService: RacesService,
              private authService: AuthService,
              private http: HttpClient) {
    this._entries = <BehaviorSubject<Entry[]>>new BehaviorSubject([]);
    this.dataStore = {
      entries: [],
      newriders: []
    };
    this.loadFromLocalStorage();
  }

  getEntries(): Observable<Entry[]> {
    return this._entries.asObservable();
  }

  getEntry(grade: string, number: string): Entry {
    for(let i=0; i<this.dataStore.entries.length; i++) {
      const e = this.dataStore.entries[i];
      if (e.grade === grade && e.number === number) {
        return e;
      }
    }
    return null;
  }

  getPlacedEntry(grade: string, place: number): Entry {
    for(let i=0; i<this.dataStore.entries.length; i++) {
      const e = this.dataStore.entries[i];
      if (e.grade === grade && e.place === place) {
        return e;
      }
    }
    return null;
  }

  gradeEntries(grade: string): Entry[] {
   // return this._entries.filter(entry => entry.grade === grade);
    return [];
  }

  storeEntry(entry: Entry): void {
    this.dataStore.entries.unshift(entry);
    this.saveEntries();
  }

  newRider(rider: Rider): void {
    if (!this.dataStore.newriders) {
      this.dataStore.newriders = [];
    }
    // generate an ID for the new rider
    rider.id = "ID" + Math.floor(Math.random()*10000000)

    console.log("New Rider: ", rider);
    this.dataStore.newriders.unshift(rider);
    this.updateLocalStorage();
  }

  saveEntries(): void {
    this._entries.next(Object.assign({}, this.dataStore).entries);
    this.updateLocalStorage();
  }

  resetEntries() {
    this.dataStore.entries = [];
    this.dataStore.newriders = [];
    this.updateLocalStorage();
    this._entries.next(Object.assign({}, this.dataStore).entries);
  }

  loadFromLocalStorage(): void {
    // load entries from local storage
    let local = JSON.parse(window.localStorage.getItem('entries'));

    if (local) {
      this.dataStore.entries = <Entry[]>local.entries;
      this.dataStore.newriders = <Rider[]>local.newriders;
      this._entries.next(Object.assign({}, this.dataStore).entries);
    }
  }

  updateLocalStorage(): void {
    window.localStorage.setItem('entries', JSON.stringify(this.dataStore));
  }

  _buildUploadPayload(): any {

    // construct the data structure
    let payload = {
      race: this.raceService.selected.id,
      entries: [],
      riders: []
    };
    // copy over entries
    for (let i=0; i<this.dataStore.entries.length; i++) {
      const entry: Entry = this.dataStore.entries[i];
      const e = {
          rider: entry.rider.id,
          grade: entry.grade,
          number: entry.number,
          place: entry.place,
          dnf: entry.dnf,
          grade_change: entry.grade_change
        };
      payload.entries.unshift(e);
    }

    const newriders = this.dataStore.newriders;

    for(let i=0; i<newriders.length; i++) {
      const rider: Rider = newriders[i];
      const r = {
        id: rider.id,
        first_name: rider.first_name,
        last_name: rider.last_name,
        email: '',
        clubslug: rider.clubslug,
        licenceno: rider.licenceno,
        member_date: rider.member_date
      };
      payload.riders.unshift(r);
    }

    console.log(payload);
    return payload;
  }

  uploadResults(): void {

    const url = environment.apiURL + "/api/raceresults/";
    const payload = this._buildUploadPayload();

    console.log(payload);

    // can't upload if not logged in
    if (!this.authService.currentUser()) {
      return;
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Token ' + this.authService.currentUser().token
      })
    };

    const response = this.http.post(url, payload, httpOptions);

    response.subscribe(httpResp => {
       console.log(httpResp);
    });
  }

}
