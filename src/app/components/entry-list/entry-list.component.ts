import { Component, OnInit } from '@angular/core';
import { EntryService } from '../../services/entry.service';
import { MatTableDataSource } from '@angular/material';
import { Entry } from '../../classes/entry';
import { Grades } from '../../grades';
import {RacesService} from '../../services/races.service';


@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.css']
})
export class EntryListComponent implements OnInit {

  grading: string[];
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

    this.grading = this.racesService.selected.grading.split(',');
    this.gradeTables = Array<{ grade: string, table: MatTableDataSource<Entry> }>(this.grading.length);

    this.getEntries();

    // give data to grade tables
    for (let i = 0; i < this.grading.length; i++) {
      this.gradeTables[i] = {
        grade: this.grading[i],
        table: new MatTableDataSource<Entry>(this.filterEntries(this.grading[i]))
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
