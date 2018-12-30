import { Component, OnInit } from '@angular/core';
import {RacesService} from '../../services/races.service';
import {Race} from '../../classes/race';
import {MatTableDataSource} from '@angular/material';
import {Router} from '@angular/router';

@Component({
  selector: 'app-race-chooser',
  templateUrl: './race-chooser.component.html',
  styleUrls: ['./race-chooser.component.css']
})
export class RaceChooserComponent implements OnInit {

  public races: Race[];
  public displayedColumns: string[] = ['date', 'location', 'title'];
  public raceTable: MatTableDataSource<Race>;

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
