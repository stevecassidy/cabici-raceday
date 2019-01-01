import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRiderDialogComponent } from './new-rider-dialog.component';

describe('NewRiderDialogComponent', () => {
  let component: NewRiderDialogComponent;
  let fixture: ComponentFixture<NewRiderDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewRiderDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewRiderDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
