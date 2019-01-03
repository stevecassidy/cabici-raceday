import { Component, OnInit } from '@angular/core';
import {EntryService} from '../../services/entry.service';
import {RacesService} from '../../services/races.service';
import {MatTableDataSource} from '@angular/material';
import {Result} from '../../classes/result';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {

  public grades: string[];
  public resultTables: Array<{ grade: string, table: MatTableDataSource<Result> }>;
  public displayedColumns: string[];

  constructor(private entryService: EntryService,
              private racesService: RacesService) { }

  ngOnInit() {
    this.grades = this.racesService.selected.grading.split(',');
    this.resultTables = Array<{ grade: string, table: MatTableDataSource<Result> }>(this.grades.length);
    this.displayedColumns = ['place', 'number', 'rider'];

    // give data to grade tables
    for (let i = 0; i < this.grades.length; i++) {
      // make an array of five entries
      let results: Result[] = [];
      for(let place = 1; place <= 5; place++) {
        let number = '';
        let rider = 'Rider Name';
        const entry = this.entryService.getPlacedEntry(this.grades[i], place);
        if (entry) {
          number = entry.number;
          rider = entry.rider.first_name + ' ' + entry.rider.last_name;
        }
        results.push( new Result(place, number, rider) );
      }
      this.resultTables[i] = {
        grade: this.grades[i],
        table: new MatTableDataSource<Result>(results)
      };
    }
  }

  updateResult(number: string, place: number, grade: string): void {
    // get the result row
    let result = null;
    for(let i=0; i<this.resultTables.length; i++) {
      if (this.resultTables[i].grade == grade) {
        result = this.resultTables[i].table.data[place-1];
      }
    }
    if (!result) {
      alert('Invalid place number!');
      return;
    }

    // get the relevant entry
    let entry = this.entryService.getEntry(grade, number);
    if (!entry) {
      alert('No entry with this number in ' + grade);
      return;
    } else {
      entry.place = place;
      this.entryService.saveEntries();
      result.rider = entry.rider.first_name + ' ' + entry.rider.last_name;
    }
  }
}
