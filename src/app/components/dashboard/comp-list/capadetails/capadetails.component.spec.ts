import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CAPAdetailsComponent } from './capadetails.component';

describe('CAPAdetailsComponent', () => {
  let component: CAPAdetailsComponent;
  let fixture: ComponentFixture<CAPAdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CAPAdetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CAPAdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
