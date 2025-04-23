import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialissueComponent } from './materialissue.component';

describe('MaterialissueComponent', () => {
  let component: MaterialissueComponent;
  let fixture: ComponentFixture<MaterialissueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialissueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaterialissueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
