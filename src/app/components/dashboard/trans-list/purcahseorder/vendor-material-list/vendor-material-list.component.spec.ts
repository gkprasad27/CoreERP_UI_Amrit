import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorMaterialListComponent } from './vendor-material-list.component';

describe('VendorMaterialListComponent', () => {
  let component: VendorMaterialListComponent;
  let fixture: ComponentFixture<VendorMaterialListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorMaterialListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorMaterialListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
