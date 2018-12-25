import {Component, Inject, OnInit} from '@angular/core';
import {Rider} from '../rider';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {RacesService} from '../races.service';
import {Race} from '../race';
import {Club} from '../club';
import {ClubList} from '../club-list';

@Component({
  selector: 'app-add-rider-dialog',
  templateUrl: './add-rider-dialog.component.html',
  styleUrls: ['./add-rider-dialog.component.css']
})

export class AddRiderDialogComponent implements OnInit {
  public rider: Rider;
  public race: Race;
  public grade: string;
  public number: string;
  public grades: string[];
  public disabled: boolean;
  public clubs: string[];
  public clubslug: string;

  constructor(public racesService: RacesService,
              public dialogRef: MatDialogRef<AddRiderDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {

  }

  onCancel(): void {
    this.dialogRef.close(null);
    // result is undefined by default. I just prefer null.
  }

  ngOnInit() {


    this.clubs = ClubList.clubSlugs();

    this.disabled = this.data.editable;
    this.race = this.racesService.selected;
    this.rider = this.data.rider;
    this.grades = 'A|B|C|D|E|F'.split('|');
    let raceclub = 'WaratahMastersCC';  // default to find grade

    if (this.race) {
      this.grades = this.race.grades.split('|');
      raceclub = this.race.club.slug;
    }

    if (!this.data.editable) {
      this.grade = this.rider.grades[raceclub];
      this.clubslug = this.rider.clubslug;
    } else {
      this.grade = '';
    }
  }


}
