import {Component, ViewChild, OnInit, SimpleChanges, OnChanges} from '@angular/core';
import {
        MatPaginator,
        MatTableDataSource,
        MatDialog
    } from '@angular/material'

import { Rider } from '../../classes/rider';
import { Entry } from '../../classes/entry';
import { RidersService } from '../../services/riders.service';
import {EntryService} from '../../services/entry.service';
import {AddRiderDialogComponent} from '../add-rider-dialog/add-rider-dialog.component';
import {ClubService} from '../../services/club.service';

@Component({
  selector: 'app-rider-list',
  templateUrl: './rider-list.component.html',
  styleUrls: ['./rider-list.component.css']
})

export class RiderListComponent implements OnInit {
    private grading: string[];
    private riders: Rider[];
    public filterTable: MatTableDataSource<Rider>;
    public filterDisplayedColumns = ['rider', 'club', 'number'];
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(private ridersService: RidersService,
                private entryService: EntryService,
                private clubService: ClubService,
                public dialog: MatDialog) {
    }

    ngOnInit() {
      this.getRiders();
    }

    updateRiderTable(): void {
      this.filterTable = new MatTableDataSource<Rider>(this.riders);
      // set filter function
      this.filterTable.filterPredicate = this.filterPredicate;
      this.filterTable.paginator = this.paginator;
    }

    /* subscribe to the riders service */
    getRiders(): void {
      this.ridersService.getRiders()
        .subscribe(riders => {
          this.riders = riders;
          this.updateRiderTable();
        });
    }

    filterPredicate(rider: Rider, term: string): boolean {
      /**
       * Matching for rider's first or last name, license no., or club.
       * Matches to the beginning of a word only
       */
        // array of all words in the term
      let words = term.toLowerCase().split(' ');
      let clubname : string[] = [''];
      if (rider.club) {
        clubname = rider.club.toLowerCase().split('');
      }
      // array of all words that match the rider
      let names = rider.first_name.toLowerCase().split(' ')
        .concat(rider.last_name.toLowerCase().split(' '))
        .concat(clubname)
        .concat(rider.licenceno.toLowerCase().split(' '));

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

    applyFilter(term: string): void {
      term = term.trim();
      term = term.toLowerCase();
      this.filterTable.filter = term;
    }

    addRider(rider: Rider, grade: string, number: string): void {
        let entry = new Entry(rider, grade, number, 0);
        this.entryService.storeEntry(entry);
        this.filterTable.filter = '';
    }

    openDialog(rider: Rider): void {
        let dialogRef = this.dialog.open(AddRiderDialogComponent, {
          width: '700px',
          data: {
              rider: rider,
              grades: this.grading,
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result !== null) {
                this.addRider(result.rider, result.grade, result.number);
            }
        });
    }

  newRiderDialog(): void {

    let dialogRef = this.dialog.open(AddRiderDialogComponent, {
      width: '800px',
      data: {
        rider: new Rider(),
        editable: true,
        grades: [],
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== null) {
        // TODO: fill out some rider details, eg. club
        result.rider.club = this.clubService.clubFromSlug(result.rider.clubslug).name;
        this.entryService.newRider(result.rider);
        let entry: Entry = new Entry(result.rider, result.grade, result.number, 0);
        this.entryService.storeEntry(entry);
      }
    });
  }

}

