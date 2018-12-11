import { Component, OnInit } from '@angular/core';
import {RacesService} from '../races.service';
import {Race} from '../race';
import {MatTableDataSource} from '@angular/material';
import {Router} from '@angular/router';

@Component({
  selector: 'app-race-chooser',
  templateUrl: './race-chooser.component.html',
  styleUrls: ['./race-chooser.component.css']
})
export class RaceChooserComponent implements OnInit {

  private races: Race[];
  private displayedColumns: string[] = ['date', 'location', 'title'];
  private raceTable: MatTableDataSource<Race>;

  constructor(
    private racesService: RacesService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getRaces();
  }

  updateRaceTable(): void {
    this.raceTable = new MatTableDataSource<Race>(this.races);
  }

  getRaces(): void {
    this.racesService.getRaces()
      .subscribe(races => {
        this.races = races;
        this.updateRaceTable();
      });
  }

  setSelected(race: Race): void {
    this.racesService.selected = race;
    this.router.navigate(['/']);
  }
}
