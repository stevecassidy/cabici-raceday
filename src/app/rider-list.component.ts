import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatPaginator, MatTableDataSource } from '@angular/material';

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

function searchFilter(rider: Rider, term: string) {
    /**
     * Matches if all words in a search term match
     * either the first or last name of the rider
     */
    let words = term.toLowerCase().split(' ');
    let match = true;
    words.forEach(word => {
        if (rider.firstName.toLowerCase().indexOf(word) !== 0 &&
            rider.lastName.toLowerCase().indexOf(word) !== 0) {
            match = false;
        }
    });
    return match;
}

@Component({
    selector: 'rider-list',
    templateUrl: './rider-list.component.html'
})
export class RiderListComponent {
    grades = Grades.grades;
    clubs = ClubList.clubs();
    entries = Array<Entry>();
    model = new Entry(null, null, null);
    gradeTables = Array<{ grade: string, table: MatTableDataSource<Entry> }>(this.grades.length);
    displayedColumns = ['number', 'rider', 'club'];
    // @ViewChild(MatPaginator) paginator: MatPaginator;
    // ngAfterViewInit() {
    //     this.dataSource.paginator = this.paginator;
    //   }

    riders = Riders.riders();
    search = (text$: Observable<string>) =>
      text$
        .debounceTime(200)
        .distinctUntilChanged()
        .map(term => term.length < 2 ? []
        //   : this.riders.filter(v => v.fullName().toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10));
        : this.riders.filter(v => searchFilter(v, term)).slice(0, 10));

    formatter = (x: Rider) => (x.fullName());

    constructor() {
        let localEntries = JSON.parse(window.localStorage.getItem('entries'));
        if (localEntries !== null) {
            // load entries from local storage
            for (let i = 0; i < localEntries.length; i++) {
                if (localEntries[i].rider !== null) {
                    let localRider = localEntries[i].rider;
                    let rider = new Rider(localRider.id, localRider.username, localRider.firstName, localRider.lastName, localRider.club);
                    let grade = localEntries[i].grade;
                    let number = localEntries[i].number;
                    this.entries.push(new Entry(rider, grade, number));
                }
            }
        }
        for (let i = 0; i < this.grades.length; i++) {
            this.gradeTables[i] = {
                grade: this.grades[i],
                table: new MatTableDataSource<Entry>(this.getEntries(this.grades[i]))
            };
        }
    }

    get diagnostic() { return JSON.stringify(this.model) }

    addRider() {
        console.log(this.model);
        if (this.model.rider !== null) {
            this.entries.push(this.model);
            this.gradeTables.forEach(gradeTable => {
                gradeTable.table = new MatTableDataSource<Entry>(this.getEntries(gradeTable.grade));
            });
            this.model = new Entry(null, null, null);
            window.localStorage.setItem('entries', JSON.stringify(this.entries));
        }
    }

    getEntries(grade: string) {
        return this.entries.filter(entry => entry.grade === grade)
    }

}