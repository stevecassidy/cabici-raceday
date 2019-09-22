import {Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {RacesService} from '../../services/races.service';
import {Race} from '../../classes/race';
import {ClubService} from '../../services/club.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Entry} from '../../classes/entry';
import {EntryService} from '../../services/entry.service';
import {Rider} from '../../classes/rider';

@Component({
  selector: 'app-add-rider-dialog',
  templateUrl: './add-rider-dialog.component.html',
  styleUrls: ['./add-rider-dialog.component.css']
})

export class AddRiderDialogComponent implements OnInit {

  public race: Race;
  public clubs: string[];
  public usual_grade: string;
  public grading: string[];
  public entryForm = new FormGroup({
    first_name: new FormControl('', Validators.required),
    last_name: new FormControl('', Validators.required),
    clubslug: new FormControl(''),
    licenceno: new FormControl(''),
    classification: new FormControl({value: '', disabled: true}),
    financial: new FormControl('', Validators.required),
    grade: new FormControl('', Validators.required),
    grade_change: new FormControl(''),
    number: new FormControl('', Validators.required)
  });


  constructor(public racesService: RacesService,
              public clubService: ClubService,
              public entryService: EntryService,
              public dialogRef: MatDialogRef<AddRiderDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {

  }

  onCancel(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {

    this.clubs = this.clubService.clubSlugs();
    this.race = this.racesService.selected;
    if (!this.race) {
      // need to select a race before we can enter riders
      this.dialogRef.close();
      return;
    }

    let raceclub = this.race.club.slug;
    this.grading = this.race.grading.split(',');
    let grade = this.grading[0];

    if (this.data.rider.grades) {
      grade = this.data.rider.grades[raceclub];
    }

    this.usual_grade = Rider.usualGrade(this.data.rider, this.race.club.slug);

    let financial = 'r';
    if (!Rider.isFinancial(this.data.rider)) {
      financial = 'n';
    }

    this.entryForm.patchValue(
      {
        'first_name': this.data.rider.first_name,
        'last_name': this.data.rider.last_name,
        'clubslug': this.data.rider.clubslug,
        'licenceno': this.data.rider.licenceno,
        'classification': this.data.rider.classification,
        'grade': grade,
        'grade_change': 'n',
        'financial': financial
      }
    );
  }

  addEntry(): boolean {
    // copy over any rider changes

    if (this.entryForm.invalid) {
      return false;
    }

    let modified = false;
    const rider = this.data.rider;

    const fields = ['first_name', 'last_name', 'clubslug', 'licenceno'];
    for( let i = 0; i < fields.length; i++) {
      const formfield = this.entryForm.get(fields[i]);
      if (formfield) {
        if (!(rider[fields[i]] === formfield.value)) {
          modified = true;
          rider[fields[i]] = formfield.value;
        }
      }
    }
    // membership
    const now = new Date();
    if (!Rider.isFinancial(rider)) {
      switch (this.entryForm.get('financial').value) {
        case 'r':
          rider.member_date = now.getFullYear() + "-12-31";
          rider.member_category = 'race';
          modified = true;
          break;
        case 'd':
          rider.member_date = now.toISOString().substring(0,10)
          rider.member_category = 'race';
          modified = true;
          break;
        case '3':
          rider.member_date = now.toISOString().substring(0,10);
          rider.member_category = 'race';
          modified = true;
      }
    }
    const grade = this.entryForm.get('grade').value;
    const number = this.entryForm.get('number').value;
    const entry = new Entry(rider, grade, number);

    // grade change
    if (!(this.entryForm.get('grade').value === this.usual_grade)) {
      entry.grade_change = this.entryForm.get('grade_change').value;
      //rider.grades[this.race.club.slug] = this.entryForm.get('grade').value;
      //modified = true;
    }

    // if the rider was modified, queue it for upload
    if (modified) {
      this.entryService.newRider(rider);
    }

    const result = this.entryService.storeEntry(entry);

    if (!result.success) {
      alert(result.message);
    } else {
      this.dialogRef.close();
    }
    return true;
  }
}
