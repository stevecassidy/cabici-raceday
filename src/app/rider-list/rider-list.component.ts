import {Component, ViewChild, OnInit, AfterViewInit} from '@angular/core';
import {
        MatPaginator,
        MatTableDataSource,
        MatDialog
    } from '@angular/material'

import { Grades } from '../grades';
import { Rider } from '../rider';
import { Entry } from '../entry';
import { RidersService } from '../riders.service';
import {EntryService} from '../entry.service';
import {AddRiderDialogComponent} from '../add-rider-dialog/add-rider-dialog.component';

@Component({
  selector: 'app-rider-list',
  templateUrl: './rider-list.component.html',
  styleUrls: ['./rider-list.component.css']
})

export class RiderListComponent implements OnInit, AfterViewInit {
    grades = Grades.grades;
    riders = [];
    filterTable = null;
    filterDisplayedColumns = ['rider', 'club', 'number'];
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(private ridersService: RidersService,
                private entryService: EntryService,
                public dialog: MatDialog) {
    }

    ngAfterViewInit() {
        this.filterTable.paginator = this.paginator;
    }

    ngOnInit() {

      this.getRiders();

      // depends on this.riders so needs to deal with the observable...
      this.filterTable = new MatTableDataSource<Rider>(this.riders);
      // set filter function
      this.filterTable.filterPredicate = this.filterPredicate;
    }

    /* subscribe to the riders service */
    getRiders(): void {
      this.ridersService.getRiders()
        .subscribe(riders => this.riders = riders);
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

    addRider(rider: Rider, grade: string, number: string): void {
        let entry = new Entry(rider, grade, number);
        this.entryService.storeEntry(entry);
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

