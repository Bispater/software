import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EquipmentsTouchedComponent } from './equipments-touched.component';

describe('EquipmentsTouchedComponent', () => {
  let component: EquipmentsTouchedComponent;
  let fixture: ComponentFixture<EquipmentsTouchedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EquipmentsTouchedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EquipmentsTouchedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
