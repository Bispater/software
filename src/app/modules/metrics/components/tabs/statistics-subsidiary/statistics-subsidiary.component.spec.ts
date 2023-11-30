import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticsSubsidiaryComponent } from './statistics-subsidiary.component';

describe('StatisticsSubsidiaryComponent', () => {
  let component: StatisticsSubsidiaryComponent;
  let fixture: ComponentFixture<StatisticsSubsidiaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatisticsSubsidiaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatisticsSubsidiaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
