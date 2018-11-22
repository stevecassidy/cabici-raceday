//  Service to store entries in a race.

import { Injectable } from '@angular/core';
import {Entry} from './entry';
import {Rider} from './rider';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EntryService {

  entries = [];

  constructor() {
    this.loadFromLocalStorage();
  }

  getEntries(): Observable<Entry[]> {
    return of(this.entries);
  }

  storeEntry(entry: Entry) {
    this.entries.push(entry);
    window.localStorage.setItem('entries', JSON.stringify(this.entries));
    console.log(this.entries);
  }

  loadFromLocalStorage(): void {
    // load entries from local storage
    let localEntries = JSON.parse(window.localStorage.getItem('entries'));
    if (localEntries !== null) {
      for (let i = 0; i < localEntries.length; i++) {
        if (localEntries[i].rider !== null) {
          let lr = localEntries[i].rider;
          let rider = new Rider(
            lr.id,
            lr.first_name,
            lr.last_name,
            lr.club,
            lr.clubslug,
            lr.licenseNo,
            lr.classification,
            lr.member_category,
            lr.member_date,
            lr.grades,
            lr.gender,
            lr.emergencyphone,
            lr.emergencyname
          );
          let grade = localEntries[i].grade;
          let number = localEntries[i].number;
          this.entries.push(new Entry(rider, grade, number));
        }
      }
    }
  }

}
