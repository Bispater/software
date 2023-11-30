import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StoresInteractionsComponent } from './stores-interactions.component';

describe('StoresInteractionsComponent', () => {
  let component: StoresInteractionsComponent;
  let fixture: ComponentFixture<StoresInteractionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StoresInteractionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoresInteractionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
