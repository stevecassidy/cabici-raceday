import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AddRiderDialogComponent } from './add-rider-dialog.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatOptionModule } from '@angular/material/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {HttpClientModule} from '@angular/common/http';

describe('AddRiderDialogComponent', () => {
  let component: AddRiderDialogComponent;
  let fixture: ComponentFixture<AddRiderDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AddRiderDialogComponent
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatGridListModule,
        MatOptionModule,
        MatSelectModule,
        MatButtonToggleModule,
        HttpClientModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRiderDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
