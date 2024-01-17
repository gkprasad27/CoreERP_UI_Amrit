import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchdetailsComponent } from './dispatchdetails.component';

describe('DispatchdetailsComponent', () => {
  let component: DispatchdetailsComponent;
  let fixture: ComponentFixture<DispatchdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DispatchdetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DispatchdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
