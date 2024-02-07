import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QcparamconfigurationComponent } from './qcparamconfiguration.component';

describe('QcparamconfigurationComponent', () => {
  let component: QcparamconfigurationComponent;
  let fixture: ComponentFixture<QcparamconfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QcparamconfigurationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QcparamconfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
