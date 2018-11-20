import { Component, ViewChild, Inject } from '@angular/core';
import {
        MatPaginator,
        MatTableDataSource,
        MatDialog,
        MatDialogRef,
        MAT_DIALOG_DATA
    } from '@angular/material'

import { Grades } from '../grades';
import { Rider } from '../rider';
import { Club } from '../club';
import { Entry } from '../entry';
import { ClubList } from '../club-list';
import { RidersService } from '../riders.service';

@Component({
  selector: 'rider-list',
  templateUrl: './rider-list.component.html',
  styleUrls: ['./rider-list.component.css']
})
export class RiderListComponent {
    grades = Grades.grades;
    clubs = ClubList.clubs();
    riders = [];
    entries = Array<Entry>();
    gradeTables = Array<{ grade: string, table: MatTableDataSource<Entry> }>(this.grades.length);
    filterTable = null;
    displayedColumns = ['number', 'rider', 'club'];
    filterDisplayedColumns = ['rider', 'club', 'number'];
    @ViewChild(MatPaginator) paginator: MatPaginator;

    ngAfterViewInit() {
        this.filterTable.paginator = this.paginator;
    }

    getEntries(grade: string): Entry[] {
        return this.entries.filter(entry => entry.grade === grade);
    }

    constructor(private ridersService: RidersService, public dialog: MatDialog) {

        // invoke the riders service to get the list of riders
        this.riders = ridersService.getRiders();
        this.filterTable = new MatTableDataSource<Rider>(this.riders);

        this.loadFromLocalStorage();

        // give data to grade tables
        for (let i = 0; i < this.grades.length; i++) {
            this.gradeTables[i] = {
                grade: this.grades[i],
                table: new MatTableDataSource<Entry>(this.getEntries(this.grades[i]))
            };
        }
        // set filter function
        this.filterTable.filterPredicate = function (rider: Rider, term: string): boolean {
            /**
             * Matching for rider's first or last name, license no., or club.
             * Matches to the beginning of a word only
             */
            // array of all words in the term
            let words = term.toLowerCase().split(' ');
            // array of all words that match the rider
            let names = rider.first_name.toLowerCase().split(' ')
                        .concat(rider.last_name.toLowerCase().split(' '))
                        .concat(rider.club.toLowerCase().split(' '))
                        .concat(rider.licenseNo.toLowerCase().split(' '));

            // every term word must match at least one rider word
            let match = true;
            words.forEach(word => {
                // check word against all rider words
                let wordMatch = false;
                names.forEach(name => {
                    if (name.indexOf(word) === 0) {
                        wordMatch = true;
                    }
                });
                // continue if it matches at least one
                if (!wordMatch) {
                    match = false;
                }
            });
            return match;
        };
    }

    get diagnostic() { return JSON.stringify(this); }

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

    addRider(rider: Rider, grade: string, number: string): void {
        let entry = new Entry(rider, grade, number);
        this.entries.push(entry);
        this.gradeTables.forEach(gradeTable => {
            gradeTable.table = new MatTableDataSource<Entry>(this.getEntries(gradeTable.grade));
        });
        window.localStorage.setItem('entries', JSON.stringify(this.entries));
    }

    openDialog(rider: Rider): void {
        let dialogRef = this.dialog.open(AddRiderDialog, {
            // width: '50vw',
            data: { rider: rider, grades: this.grades },
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result !== null) {
                this.addRider(result.rider, result.grade, result.number);
            }
        });
    }

    applyFilter(term: string): void {
        term = term.trim();
        term = term.toLowerCase();
        this.filterTable.filter = term;
    }

}

@Component({
    selector: 'add-rider-dialog',
    templateUrl: './add-rider-dialog.html',
})
export class AddRiderDialog {
    rider: Rider;
    grade: string;
    number: string;
    grades: string[];

    constructor(
        public dialogRef: MatDialogRef<AddRiderDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
            this.rider = data.rider;
            this.grades = data.grades;
    }

    onCancel(): void {
        console.log(this.data);
        this.dialogRef.close(null);
        // result is undefined by default. I just prefer null.
    }

}
