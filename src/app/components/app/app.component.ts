import { Component } from '@angular/core';
import {UpdateService} from '../../services/update.service';
import { EntryService } from '../../services/entry.service';
import { RacesService } from '../../services/races.service';
import { Router } from '@angular/router';
import { RidersService } from '../../services/riders.service';
import { ClubService } from '../../services/club.service';

@Component({
  selector: 'cabici',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public navLinks = [
    {path: 'races', label: 'Race'},
    {path: 'entries', label: 'Entries'},
    {path: 'results', label: 'Results'}
  ];

  constructor(
    private update: UpdateService,
    public entryService: EntryService,
    public racesService: RacesService,
    public ridersService: RidersService,
    public clubService: ClubService,
    private router: Router
  ) {

  }

  log(message: string): void {
    console.log(message);
  }

  resetEntries(): void {
    this.entryService.resetEntries();
    this.router.navigate(['/races']);
  }


  apiLoad(): void {
    this.racesService.loadRaces();
    this.ridersService.loadChangedRiders();
    this.clubService.loadClubs();
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

}

/* 
  TODO:
   - confirm dialog on Reset Results, warn if not uploaded
   - confirm dialog on upload results if it would overwrite existing results
   - confirm dialog on download entries if it will overwrite
   - disable buttons if no entries (reset, upload, download csv) 
   - modify race grading sends request up to Cabici to edit on server
*/