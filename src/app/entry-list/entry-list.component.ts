import { Component, OnInit } from '@angular/core';
import { EntryService } from '../entry.service';
import { MatTableDataSource } from '@angular/material';
import { Entry } from '../entry';
import { Grades } from '../grades';
import {RacesService} from '../races.service';


@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.css']
})
export class EntryListComponent implements OnInit {

  grades: string[];
  displayedColumns: string[] = ['number', 'rider', 'club'];
  gradeTables: Array<{ grade: string, table: MatTableDataSource<Entry> }>;
  entries: Entry[];
  selectedTab: number;

  constructor(
    private entryService: EntryService,
    private racesService: RacesService
  ) {

  }

  ngOnInit() {

    this.grades = this.racesService.selected.grades.split('|');
    this.gradeTables = Array<{ grade: string, table: MatTableDataSource<Entry> }>(this.grades.length);

    this.getEntries();

    // give data to grade tables
    for (let i = 0; i < this.grades.length; i++) {
      this.gradeTables[i] = {
        grade: this.grades[i],
        table: new MatTableDataSource<Entry>(this.filterEntries(this.grades[i]))
      };
    }
  }

  updateEntries(): void {
    // initialise entries
    this.gradeTables.forEach(gradeTable => {
      gradeTable.table = new MatTableDataSource<Entry>(this.filterEntries(gradeTable.grade));
    });
  }

  getEntries(): void {
    this.entryService.getEntries()
      .subscribe(entries => {
        this.entries = entries;
        this.updateEntries();
      });
  }

  filterEntries(grade: string): Entry[] {
    return this.entries.filter(entry => entry.grade === grade);
  }

  resetEntries() {
    this.entryService.resetEntries();
    this.updateEntries();
  }

  setTab(index: number): void {
    this.selectedTab = index;
  }
}
