//  Service to store entries in a race.

import {Injectable} from '@angular/core';
import {Entry} from '../classes/entry';
import {Rider} from '../classes/rider';
import {BehaviorSubject, Observable} from 'rxjs';
import {RacesService} from './races.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthService} from './auth.service';
import {environment} from '../../environments/environment';
import {RidersService} from './riders.service';

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
              private ridersService: RidersService,
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
      if (e.grade == grade && e.number == number) {
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

  storeEntry(entry: Entry): {success: boolean, message: string} {
    // check for duplicate number (in this grade) or rider (anywhere)
    const result = {
      success: true,
      message: ''
    };

    for (let i=0; i<this.dataStore.entries.length; i++) {
      const ref = this.dataStore.entries[i];
      if (entry.number === ref.number && entry.grade === ref.grade) {
        result.success = false;
        result.message = 'Duplicate number ' + entry.number + ' in grade';
      } else if (entry.rider.id === ref.rider.id) {
        result.success = false;
        result.message = 'Rider already entered';
      }
    }

    if (result.success) {
      this.dataStore.entries.unshift(entry);
      this.saveEntries();
      result.message = "Entry stored";
    }
    return result;
  }

  newRider(rider: Rider): void {
    if (!this.dataStore.newriders) {
      this.dataStore.newriders = [];
    }
    if (!rider.id) {
      // generate an ID for the new rider and remember them
      rider.id = "ID" + Math.floor(Math.random() * 10000000)
      this.ridersService.newRider(rider);
    }

    // queue new or modified rider for upload
    this.dataStore.newriders.unshift(rider);
    this.saveEntries();
    // update riders storage too so we remember the updated rider
    this.ridersService.updateLocalStorage();
  }

  saveEntries(): void {
    this._entries.next(Object.assign({}, this.dataStore).entries);
    this.updateLocalStorage();
  }

  resetEntries() {
    this.dataStore.entries = [];
    this.dataStore.newriders = [];
    this.saveEntries();
  }

  deleteEntry(entry: Entry): void {
    // remove this entry if we have it
    const idx = this.dataStore.entries.indexOf(entry);
    if (idx >= 0) {
      this.dataStore.entries.splice(idx, 1);
    }
    this.saveEntries();
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

    return payload;
  }

  uploadResults(): void {

    const url = environment.apiURL + "/api/raceresults/";
    const payload = this._buildUploadPayload();

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

  toCSV(): string {
    // return all entries in a CSV format

    let result = '';
    // headers
    result += 'LastName,FirstName,Regd,Grade,ShirtNo,Place,LicenceNo,Club,Email,Id\n';

    for(let i=0; i<this.dataStore.entries.length; i++) {
      let row = '';
      let entry = this.dataStore.entries[i];

      row += entry.rider.first_name + ',';
      row += entry.rider.last_name + ',';
      row += Rider.isFinancial(entry.rider) + ',';
      row += entry.grade + ',';
      row += entry.number + ',';
      row += entry.place + ',';
      row += entry.rider.licenceno + ',';
      row += entry.rider.clubslug + ',';
      row += entry.rider.email + ',';
      row += entry.rider.id + '\n';

      result += row;
    }
    return result;
  }
}
