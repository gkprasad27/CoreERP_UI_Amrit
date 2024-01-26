import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuorantineComponent } from './quorantine.component';

describe('QuorantineComponent', () => {
  let component: QuorantineComponent;
  let fixture: ComponentFixture<QuorantineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuorantineComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuorantineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
