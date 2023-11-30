import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CircleOptionComponent } from './circle-option.component';

describe('CircleOptionComponent', () => {
  let component: CircleOptionComponent;
  let fixture: ComponentFixture<CircleOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CircleOptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CircleOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
