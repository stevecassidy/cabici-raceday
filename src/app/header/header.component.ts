import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {Race} from '../race';
import {RacesService} from '../races.service';
import {RidersService} from '../riders.service';
import {Rider} from '../rider';
import {AddRiderDialogComponent} from '../add-rider-dialog/add-rider-dialog.component';
import {MatDialog} from '@angular/material';
import {Entry} from '../entry';
import {EntryService} from '../entry.service';
import {ClubList} from '../club-list';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private racesService: RacesService,
              private ridersService: RidersService,
              private entryService: EntryService,
              public dialog: MatDialog,
              private router: Router) { }

  ngOnInit() {
  }

  selectRace(): void {
    this.router.navigate(['/races']);
  }

  currentRace(): any {
    // return the display name of the selected race if available
    if (this.racesService.selected) {
      return this.racesService.selected.title;
    } else {
      return "Select Race";
    }
  }

  addRider(): void {

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
        result.rider.club = ClubList.clubFromSlug(result.rider.clubslug).name;
        this.ridersService.newRider(result.rider);
        let entry: Entry = new Entry(result.rider, result.grade, result.number);
        this.entryService.storeEntry(entry);
      }
    });
  }

}
