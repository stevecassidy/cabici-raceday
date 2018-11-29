import {Component, ViewChild, Inject, OnInit, AfterViewInit} from '@angular/core';
import {
        MatPaginator,
        MatTableDataSource,
        MatDialog,
        MatDialogRef,
        MAT_DIALOG_DATA
    } from '@angular/material'

import { Grades } from '../grades';
import { Rider } from '../rider';
import { Entry } from '../entry';
import { RidersService } from '../riders.service';
import {EntryService} from '../entry.service';
import {AddRiderDialogComponent} from '../add-rider-dialog/add-rider-dialog.component';

@Component({
  selector: 'rider-list',
  templateUrl: './rider-list.component.html',
  styleUrls: ['./rider-list.component.css']
})

export class RiderListComponent implements OnInit, AfterViewInit {
    grades = Grades.grades;
    riders = [];
    entries = Array<Entry>();
    gradeTables = Array<{ grade: string, table: MatTableDataSource<Entry> }>(this.grades.length);
    filterTable = null;
    displayedColumns = ['number', 'rider', 'club'];
    filterDisplayedColumns = ['rider', 'club', 'number'];
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(private ridersService: RidersService,
                private entryService: EntryService,
                public dialog: MatDialog) {
      // give data to grade tables
      for (let i = 0; i < this.grades.length; i++) {
        this.gradeTables[i] = {
          grade: this.grades[i],
          table: new MatTableDataSource<Entry>(this.filterEntries(this.grades[i]))
        };
      }
    }

    ngAfterViewInit() {
        this.filterTable.paginator = this.paginator;
    }

    ngOnInit() {

      this.getRiders();
      this.getEntries();

      // depends on this.riders so needs to deal with the observable...
      this.filterTable = new MatTableDataSource<Rider>(this.riders);
      // set filter function
      this.filterTable.filterPredicate = this.filterPredicate;

      // initialise entries...should be a component
      this.gradeTables.forEach(gradeTable => {
        gradeTable.table = new MatTableDataSource<Entry>(this.filterEntries(gradeTable.grade));
      });
    }

    getEntries(): void {
      this.entryService.getEntries()
        .subscribe(entries => this.entries = entries);
    }

    /* subscribe to the riders service */
    getRiders(): void {
      this.ridersService.getRiders()
        .subscribe(riders => this.riders = riders);
    }

    filterEntries(grade: string): Entry[] {
      return this.entries.filter(entry => entry.grade === grade);
    }

    filterPredicate(rider: Rider, term: string): boolean {
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

    get diagnostic() { return JSON.stringify(this); }

    addRider(rider: Rider, grade: string, number: string): void {
        let entry = new Entry(rider, grade, number);
        this.entryService.storeEntry(entry);
        // update the display...should be another component
        this.gradeTables.forEach(gradeTable => {
            gradeTable.table = new MatTableDataSource<Entry>(this.filterEntries(gradeTable.grade));
        });
    }

    openDialog(rider: Rider): void {
        let dialogRef = this.dialog.open(AddRiderDialogComponent, {
          width: '600px',
          data: {
              rider: rider,
              grades: this.grades,
            }
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

