import { Component, OnInit } from '@angular/core';
import { EntryService } from '../../services/entry.service';
import {MatDialog, MatTableDataSource} from '@angular/material';
import { Entry } from '../../classes/entry';
import {RacesService} from '../../services/races.service';
import {UpdateEntryComponent} from '../update-entry/update-entry.component';


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
    public entryService: EntryService,
    public racesService: RacesService,
    private dialog: MatDialog
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

  updateEntry(entry: Entry): void {
    this.dialog.open(UpdateEntryComponent, {
      width: '800px',
      data: {
        entry: entry
      }
    });
  }

  csvDownload(download: any) {

    const csvData = this.entryService.toCSV();
    const blob = new Blob([csvData], { type: 'text/csv' });

    download.href = window.URL.createObjectURL(blob);
    download.target = '_blank';

    // target filename
    download.download = 'entries.csv';
  }

  jsonDownload(download: any) {
    const jsonData = this.entryService.toJSON();
    const blob = new Blob([jsonData], { type: 'text/plain' });

    download.href = window.URL.createObjectURL(blob);
    download.target = '_blank';

    // target filename
    download.download = 'entries-dump.txt';
  }

  loadJSONFile(fileInput: any): void {

    if (fileInput.target.files && fileInput.target.files[0]) {
      const reader = new FileReader();
      const self = this;
      reader.onload = function (e: any) {
        self.entryService.fromJSON(e.target.result);
      };

      reader.readAsText(fileInput.target.files[0]);
    }
  }

  setTab(index: number): void {
    this.selectedTab = index;
  }

}
