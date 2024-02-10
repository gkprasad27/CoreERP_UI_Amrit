import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobworkmaterialreceivingComponent } from './jobworkmaterialreceiving.component';

describe('JobworkmaterialreceivingComponent', () => {
  let component: JobworkmaterialreceivingComponent;
  let fixture: ComponentFixture<JobworkmaterialreceivingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobworkmaterialreceivingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobworkmaterialreceivingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
