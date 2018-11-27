import {Component, Inject, OnInit} from '@angular/core';
import {Rider} from '../rider';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-add-rider-dialog',
  templateUrl: './add-rider-dialog.component.html',
  styleUrls: ['./add-rider-dialog.component.css']
})

export class AddRiderDialogComponent implements OnInit {
  rider: Rider;
  grade: string;
  number: string;
  grades: string[];

  constructor(public dialogRef: MatDialogRef<AddRiderDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {

  }

  onCancel(): void {
    this.dialogRef.close(null);
    // result is undefined by default. I just prefer null.
  }

  ngOnInit() {
    this.rider = this.data.rider;
    this.grades = this.data.grades;
    this.grade = this.rider.grades['WaratahMastersCC'];
  }
}
