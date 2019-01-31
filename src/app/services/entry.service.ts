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
import {MatDialog, MatDialogRef, MatSnackBar} from '@angular/material';
import {BusydialogComponent} from '../components/busydialog/busydialog.component';

// @ts-ignore
@Injectable({
  providedIn: 'root'
})
export class EntryService {
  // https://coryrylan.com/blog/angular-observable-data-services
  private _entries: BehaviorSubject<Entry[]>;
  private readonly dataStore: {
    entries: Entry[],
    newriders: Rider[]
  };
  private _uploading: boolean = false;
  private busyDialogRef: MatDialogRef<BusydialogComponent>;

  constructor(private raceService: RacesService,
              private authService: AuthService,
              private ridersService: RidersService,
              private snackBar: MatSnackBar,
              private dialog: MatDialog,
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

  addPlace(number: string, place: number, grade: string): {entry: Entry, message: string} {

    let entry = this.getEntry(grade, number);
    let message = '';

    if (!entry) {
      return {entry: null, message: 'Number not found in grade'};
    }
    // check for duplicates
    for(let i=0; i<this.dataStore.entries.length; i++) {
      const e = this.dataStore.entries[i];
      if (e.grade === grade && e.place === place) {
        // we should overwrite this place
        e.place = 0;
      } else if (e.number === number && e.grade === grade && e.grade !== '') {
        message = 'Place already assigned for number in grade';
      }
    }
    if (message === '') {
      entry.place = place;
      this.saveEntries();
      message = 'Place added';
    } else {
      entry = null;
    }
    return {entry: entry, message: message};
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
      result.message = 'Entry stored';
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

  downloadEntries(reset: boolean): void {
    // download existing entries/results for this race from cabici

    const url = environment.apiURL + '/api/raceresults/?race=' + this.raceService.selected.id;

    // can't load if not logged in
    if (!this.authService.currentUser()) {
      return;
    }

    this.busyDialogRef = this.dialog.open(BusydialogComponent,
      {
        disableClose: true,
        data: {message: 'Loading Entries...'}
      });

    const response = this.http.get(url);

    response.subscribe(httpResp => {
      if (reset) {
        this.resetEntries();
      }

      for (let i=0; i<httpResp.length; i++) {
        const e = httpResp[i];
        const rider = this.ridersService.getRider(e.riderid);
        if (rider) {
          const entry: Entry = new Entry(rider, e.grade, e.number, e.place, e.dnf, e.grade_change);
          this.storeEntry(entry);
        } else {
          // unknown rider
          alert('Unknown rider: ' + e.rider);
        }
      }

      this.busyDialogRef.close();
    });
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
      if (!entry.grade || !entry.number) {
        console.log('invalid entry', entry);
        continue;
      }
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
        email: rider.email,
        clubslug: rider.clubslug,
        licenceno: rider.licenceno,
        member_date: rider.member_date,
        dob: rider.dob,
        gender: rider.gender,
        phone: rider.phone
      };
      payload.riders.unshift(r);
    }

    return payload;
  }

  uploadResults(): void {

    if (this._uploading) {
      return;
    }

    this._uploading = true;
    const dialogRef = this.dialog.open(BusydialogComponent,
      {
        disableClose: true,
        data: {message: 'Uploading Results...'}
      });

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
      const ridermap = httpResp['ridermap'];
      if (ridermap) {
        for (const riderid in ridermap) {
          // update rider id
          const rider = this.ridersService.getRider(riderid);
          if (rider) {
            rider.id = ridermap[riderid];
          }
        }
        // update local storage to reflect the new object ids
        this.ridersService.updateLocalStorage();
        this.updateLocalStorage();
      }
      const snackBarRef = this.snackBar.open(httpResp['message'], "Ok");
      this._uploading = false;
      dialogRef.close();
    },
      error => {
      console.log(error);
      this._uploading = false;
      dialogRef.close();
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
