import { Component, OnInit, Input } from '@angular/core';
import {Router} from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material';

import {RacesService} from '../../services/races.service';
import {RidersService} from '../../services/riders.service';
import {EntryService} from '../../services/entry.service';
import {AuthService} from '../../services/auth.service';
import {ClubService} from '../../services/club.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Input() inputSideNav: MatSidenav;

  constructor(public racesService: RacesService,
              public ridersService: RidersService,
              public clubService: ClubService,
              public entryService: EntryService,
              public authService: AuthService,
              public dialog: MatDialog,
              private router: Router) { }

  ngOnInit() {
  }

  selectRace(): void {
    this.racesService.loadRaces();
    this.router.navigate(['/races']);
  }

  loggedIn(): boolean {
    return this.authService.loggedIn();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  currentUser(): string {
    const user = this.authService.currentUser();
    if (user) {
      return 'Logged in as ' + user.first_name + ' ' + user.last_name;
    } else {
      return 'Not Logged In';
    }
  }

  currentRace(): any {
    // return the display name of the selected race if available
    if (this.racesService.selected) {
      return this.racesService.selected.title + ' | ' + this.racesService.selected.location.name + ' | ' + this.racesService.selected.date;
    } else {
      return 'Select Race';
    }
  }

}
