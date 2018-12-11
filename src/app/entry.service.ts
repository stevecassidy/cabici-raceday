//  Service to store entries in a race.

import { Injectable } from '@angular/core';
import {Entry} from './entry';
import {Rider} from './rider';
import {BehaviorSubject, Observable, of} from 'rxjs';

// @ts-ignore
@Injectable({
  providedIn: 'root'
})
export class EntryService {
  // https://coryrylan.com/blog/angular-observable-data-services
  private _entries: BehaviorSubject<Entry[]>;
  private dataStore: {
    entries: Entry[]
  };

  constructor() {
    this._entries = <BehaviorSubject<Entry[]>>new BehaviorSubject([]);
    this.dataStore = {
      entries: []
    };
    this.loadFromLocalStorage();
  }

  getEntries(): Observable<Entry[]> {
    return this._entries.asObservable();
  }

  storeEntry(entry: Entry) {
    this.dataStore.entries.unshift(entry);
    this._entries.next(Object.assign({}, this.dataStore).entries);
    window.localStorage.setItem('entries', JSON.stringify(this.dataStore.entries));
  }

  resetEntries() {
    this.dataStore.entries = [];
    window.localStorage.setItem('entries', '[]')
    this._entries.next(Object.assign({}, this.dataStore).entries);
  }

  loadFromLocalStorage(): void {
    // load entries from local storage
    let localEntries = JSON.parse(window.localStorage.getItem('entries'));
    if (localEntries !== null) {
      for (let i = 0; i < localEntries.length; i++) {
        if (localEntries[i].rider !== null) {
          let rider = <Rider>localEntries[i].rider;
          let grade = localEntries[i].grade;
          let number = localEntries[i].number;
          this.dataStore.entries.push(new Entry(rider, grade, number));

          this._entries.next(Object.assign({}, this.dataStore).entries);
        }
      }
    }
  }

}
