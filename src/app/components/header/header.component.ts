import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {RacesService} from '../../services/races.service';
import {RidersService} from '../../services/riders.service';
import {MatDialog} from '@angular/material';
import {EntryService} from '../../services/entry.service';
import {AuthService} from '../../services/auth.service';

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
      return 'Logged in as ' + user.first_name + ' ' + user.last_name;
    } else {
      return 'Not Logged In';
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

  apiLoad(): void {
    this.racesService.loadRaces();
    this.ridersService.loadRiders();
  }

  csvDownload(download: any) {

    console.log(download);

    let csvData = this.entryService.toCSV();
    console.log(csvData);

    let blob = new Blob([csvData], { type: 'text/csv' });

    let url = window.URL.createObjectURL(blob);

    download.href = url;
    download.target = '_blank';

    // target filename
    download.download = 'entries.csv';
  }

}
