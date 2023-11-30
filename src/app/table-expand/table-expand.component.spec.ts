import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableExpandComponent } from './table-expand.component';

describe('TableExpandComponent', () => {
  let component: TableExpandComponent;
  let fixture: ComponentFixture<TableExpandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableExpandComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableExpandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
