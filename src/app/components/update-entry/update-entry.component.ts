import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {EntryService} from '../../services/entry.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Entry} from '../../classes/entry';
import {RacesService} from '../../services/races.service';

@Component({
  selector: 'app-update-entry',
  templateUrl: './update-entry.component.html',
  styleUrls: ['./update-entry.component.css']
})
export class UpdateEntryComponent implements OnInit {

  public entryForm = new FormGroup({
    grade: new FormControl(''),
    grade_change: new FormControl(''),
    number: new FormControl('')
  });
  public grading: string[];
  public usual_grade: string;

  constructor(private entryService: EntryService,
              private racesService: RacesService,
              private dialogRef: MatDialogRef<UpdateEntryComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {

    this.grading = this.racesService.selected.grading.split(',');
    this.usual_grade = this.data.entry.rider.grades[this.racesService.selected.club.slug];
    this.entryForm.patchValue({
      grade: this.data.entry.grade,
      grade_change: this.data.entry.grade_change,
      number: this.data.entry.number
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  updateEntry() {
    const newGrade = this.entryForm.get('grade').value;
    const newGradeChange = this.entryForm.get('grade_change').value;
    const newNumber = this.entryForm.get('number').value;
    let modified = false;

    if (!(newGrade === this.data.entry.grade)) {
      this.data.entry.grade = newGrade;
      modified = true;
    }

    if (!(newGradeChange === this.data.entry.grade_change)) {
      this.data.entry.grade_change = newGradeChange;
      modified = true;
    }

    if (!(newNumber === this.data.entry.number)) {
      this.data.entry.number = newNumber;
      modified = true;
    }

    if (modified) {
      this.entryService.saveEntries();
    }
    this.dialogRef.close();
  }

  deleteEntry() {
    this.entryService.deleteEntry(this.data.entry);
    this.dialogRef.close();
  }

}
