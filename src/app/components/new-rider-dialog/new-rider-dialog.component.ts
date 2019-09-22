import {Component, OnInit} from '@angular/core';
import {RacesService} from '../../services/races.service';
import {ClubService} from '../../services/club.service';
import {Entry} from '../../classes/entry';
import { MatDialogRef } from '@angular/material/dialog';
import {Rider} from '../../classes/rider';
import {EntryService} from '../../services/entry.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-new-rider-dialog',
  templateUrl: './new-rider-dialog.component.html',
  styleUrls: ['./new-rider-dialog.component.css']
})
export class NewRiderDialogComponent implements OnInit {

  public entry: Entry;

  public riderForm = new FormGroup({
    first_name: new FormControl('', Validators.required),
    last_name: new FormControl('', Validators.required),
    email: new FormControl('', Validators.email),
    phone: new FormControl(''),
    clubslug: new FormControl(''),
    licenceno: new FormControl(''),
    dob: new FormControl(''),
    gender: new FormControl('', Validators.required),
    financial: new FormControl('', Validators.required),
    grade: new FormControl('', Validators.required),
    number: new FormControl('', Validators.required)
  });

  constructor(public racesService: RacesService,
              public entryService: EntryService,
              public raceService: RacesService,
              public clubService: ClubService,
              public dialogRef: MatDialogRef<NewRiderDialogComponent>) {

  }

  ngOnInit() {
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  addRider(): boolean {
    if (this.riderForm.status === 'VALID') {
      const rider = new Rider();
      rider.first_name = this.riderForm.get('first_name').value;
      rider.last_name = this.riderForm.get('last_name').value;
      rider.email = this.riderForm.get('email').value;
      rider.phone = this.riderForm.get('phone').value;
      rider.clubslug = this.riderForm.get('clubslug').value;
      rider.licenceno = this.riderForm.get('licenceno').value;

      if (this.riderForm.get('dob').value) {
        rider.dob = this.riderForm.get('dob').value.toISOString().substring(0, 10);
      } else {
        rider.dob = '1970-01-01';
      }
      rider.gender = this.riderForm.get('gender').value;

      const now = new Date();
      switch (this.riderForm.get('financial').value) {
        case 'r':
          rider.member_category = 'race';
          // set date to end of this year
          rider.member_date = now.getFullYear() + '-12-31';
          break;
        case 'd':
          rider.member_category = 'race';
          rider.member_date = now.toISOString().substring(0, 10);
          break;
        case '3':
          rider.member_category = 'race';
          rider.member_date = now.toISOString().substring(0, 10);
      }

      const club = this.clubService.clubFromSlug(rider.clubslug);
      if (club) {
        rider.club = club.name;
      } else {
        rider.club = 'Unknown';
      }

      this.entryService.newRider(rider);

      const entry = new Entry(
            rider,
            this.riderForm.get('grade').value,
            this.riderForm.get('number').value
      );

      const storeResult = this.entryService.storeEntry(entry);
      // don't close the dialog if this didn't work...
      if (storeResult.success) {
        this.dialogRef.close();
      } else {
        alert(storeResult.message);
      }
      return true;
    } else {
      return false;
    }
  }
}
