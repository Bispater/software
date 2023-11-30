import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticsDeviceComponent } from './statistics-device.component';

describe('StatisticsDeviceComponent', () => {
  let component: StatisticsDeviceComponent;
  let fixture: ComponentFixture<StatisticsDeviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatisticsDeviceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatisticsDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
