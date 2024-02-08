import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StandardRateOComponent } from './standard-rate-o.component';

describe('StandardRateOComponent', () => {
  let component: StandardRateOComponent;
  let fixture: ComponentFixture<StandardRateOComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StandardRateOComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StandardRateOComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
