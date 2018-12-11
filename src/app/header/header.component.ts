import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {Race} from '../race';
import {RacesService} from '../races.service';
import {RidersService} from '../riders.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private racesService: RacesService,
              private ridersService: RidersService,
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

  }

}
