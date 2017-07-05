import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

import { Grades } from './grades';
import { Rider } from './rider';
import { Club } from './club';
import { Entry } from './entry';
import { ClubList } from './club-list';
import { Riders } from './riders';

@Component({
    selector: 'rider-list',
    templateUrl: './rider-list.component.html'
})
export class RiderListComponent {
    grades = Grades.grades;
    clubs = ClubList.clubs();
    entries = Array<Entry>();

    riders = Riders.riders();
    search = (text$: Observable<string>) =>
      text$
        .debounceTime(200)
        .distinctUntilChanged()
        .map(term => term.length < 2 ? []
          : this.riders.filter(v => v.fullName().toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10));
    formatter = (x: Rider) => x.fullName();

    model = new Entry(null, null, null);

    get diagnostic() { return JSON.stringify(this.model) }

    addRider() {
        this.entries.push(this.model);
        this.model = new Entry(null, null, null);
    }

    getEntries(grade: string) {
        return this.entries.filter(entry => entry.grade === grade)
    }

}