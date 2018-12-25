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
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(public racesService: RacesService,
              public ridersService: RidersService,
              public entryService: EntryService,
              public authService: AuthService,
              public dialog: MatDialog,
              private router: Router) { }

  ngOnInit() {
  }

  selectRace(): void {
    this.router.navigate(['/races']);
  }

  currentUser(): string {
    let user = this.authService.currentUser();
    if (user) {
      return "Logged in as " + user.first_name + " " + user.last_name;
    } else {
      return "Not Logged In";
    }
  }

  currentRace(): any {
    // return the display name of the selected race if available
    if (this.racesService.selected) {
      return this.racesService.selected.title;
    } else {
      return "Select Race";
    }
  }


  navigateResults(): void {
    this.router.navigate(['results']);
  }

}
