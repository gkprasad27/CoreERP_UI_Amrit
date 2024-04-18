import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceProcessComponent } from './attendance-process.component';

describe('AttendanceProcessComponent', () => {
  let component: AttendanceProcessComponent;
  let fixture: ComponentFixture<AttendanceProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttendanceProcessComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendanceProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
