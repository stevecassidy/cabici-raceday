import {Component, Inject, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Rider} from '../../classes/rider';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {RacesService} from '../../services/races.service';
import {Race} from '../../classes/race';
import {ClubService} from '../../services/club.service';

@Component({
  selector: 'app-add-rider-dialog',
  templateUrl: './add-rider-dialog.component.html',
  styleUrls: ['./add-rider-dialog.component.css']
})

export class AddRiderDialogComponent implements OnInit, OnChanges {
  public rider: Rider;
  public race: Race;
  public grade: string;
  public number: string;
  public grading: string[];
  public disabled: boolean;
  public clubs: string[];
  public clubslug: string;

  constructor(public racesService: RacesService,
              private clubService: ClubService,
              public dialogRef: MatDialogRef<AddRiderDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {

  }

  onCancel(): void {
    this.dialogRef.close(null);
    // result is undefined by default. I just prefer null.
  }

  ngOnInit() {

    this.clubs = this.clubService.clubSlugs();

    this.disabled = this.data.editable;
    this.race = this.racesService.selected;
    this.rider = this.data.rider;
    this.grading = 'A,B,C,D,E,F'.split(',');
    let raceclub = this.race.club.slug;

    if (this.race) {
      this.grading = this.race.grading.split(',');
      raceclub = this.race.club.slug;
    }

    if (!this.data.editable) {
      if (this.rider.grades) {
        this.grade = this.rider.grades[raceclub];
      }
      this.clubslug = this.rider.clubslug;
    } else {
      this.grade = '';
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }


}
