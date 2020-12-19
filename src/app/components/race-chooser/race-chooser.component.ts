import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {RacesService} from '../../services/races.service';
import {Race} from '../../classes/race';
import { MatTableDataSource } from '@angular/material/table';
import {Router} from '@angular/router';
import { MatRadioChange } from '@angular/material/radio';

@Component({
  selector: 'app-race-chooser',
  templateUrl: './race-chooser.component.html',
  styleUrls: ['./race-chooser.component.css']
})
export class RaceChooserComponent implements OnInit {

  public races: Race[];
  public displayedColumns: string[] = ['date', 'location', 'title'];
  public raceTable: MatTableDataSource<Race>;
  public selectedRaceOption: string;
  public selectedRace: Race;
  @ViewChild('filter', {static: true}) filterInput : ElementRef;

  constructor(
    private racesService: RacesService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getRaces();
    if (this.racesService.selected) {
      this.selectedRace = this.racesService.selected;
      if (this.racesService.selected === this.racesService.nextRace()) {
        this.selectedRaceOption = "next";
      } else {
        this.selectedRaceOption = "other";
      }
    }
  }

  disableOtherRaceInput(): void {
    this.filterInput.nativeElement.disabled = true;
  }

  updateRaceTable(): void {
    this.raceTable = new MatTableDataSource<Race>(this.races);
  }

  getRaces(): void {
    this.racesService.loadRaces();
    this.racesService.getRaces()
      .subscribe(races => {
        this.races = races;
        this.updateRaceTable();
      });
  }

  nextRace(): string {
    const nextRace = this.racesService.nextRace();
    if (nextRace) {
      return nextRace.title + ' | ' + nextRace.location.name + ' | ' + nextRace.date;
    } else {
      return "No Race Loaded"
    }
  }

  onChange(event: MatRadioChange): void {
    if (event.value === "next") {
      this.selectedRace = this.racesService.nextRace();
      this.filterInput.nativeElement.disabled = true;
    } else if (event.value === "other") {
      this.filterInput.nativeElement.disabled = false;
      this.filterInput.nativeElement.focus();
    }
  }

  applyFilter(term: string): void {
    term = term.trim();
    term = term.toLowerCase();
    this.raceTable.filter = term;
  }

  setSelected(race: Race): void {
    if (this.selectedRaceOption === "other") {
      this.selectedRace = race;
    }
}
  confirmSelected(): void {
      this.racesService.selected = this.selectedRace;
      this.router.navigate(['/entries']);
  }

  isSelected(race: Race): string {
    if (this.racesService.selected && (race.id === this.racesService.selected.id)) {
      return 'selected';
    } else {
      return '';
    }
  }

}
