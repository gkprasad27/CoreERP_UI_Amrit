import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoHistoryComponent } from './po-history.component';

describe('PoHistoryComponent', () => {
  let component: PoHistoryComponent;
  let fixture: ComponentFixture<PoHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PoHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
