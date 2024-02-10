import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobworkmaterialissueComponent } from './jobworkmaterialissue.component';

describe('JobworkmaterialissueComponent', () => {
  let component: JobworkmaterialissueComponent;
  let fixture: ComponentFixture<JobworkmaterialissueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobworkmaterialissueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobworkmaterialissueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
