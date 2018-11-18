import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiderListComponent } from './rider-list.component';
import {
  MatPaginatorModule,
  MatDialogModule,
  MatToolbarModule,
  MatFormFieldModule,
  MatTableModule,
  MatInputModule,
  MatTabsModule
} from '@angular/material';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

describe('RiderListComponent', () => {
  let component: RiderListComponent;
  let fixture: ComponentFixture<RiderListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiderListComponent ],
      imports: [
        MatPaginatorModule,
        MatDialogModule,
        MatToolbarModule,
        MatFormFieldModule,
        MatTableModule,
        MatInputModule,
        MatTabsModule,
        NoopAnimationsModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
