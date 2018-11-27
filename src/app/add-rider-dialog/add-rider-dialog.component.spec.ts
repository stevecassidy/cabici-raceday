import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRiderDialogComponent } from './add-rider-dialog.component';

describe('AddRiderDialogComponent', () => {
  let component: AddRiderDialogComponent;
  let fixture: ComponentFixture<AddRiderDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRiderDialogComponent ]
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
